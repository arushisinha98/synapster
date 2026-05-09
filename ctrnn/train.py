"""Train the synapster CTRNN on a single neurogym task and export a bundle.

Pattern follows neurogym's pytorch supervised-learning example:
https://neurogym.github.io/neurogym/latest/examples/supervised_learning_pytorch/

Usage:
    python ctrnn/train.py --task PerceptualDecisionMaking-v0 \
        --epochs 2000 --hidden 144 --seed 0 --device cuda \
        --out ctrnn/bundles/perceptual_decision
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn

# Allow running from anywhere as `python ctrnn/train.py` or `python -m ctrnn.train`.
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import neurogym as ngym  # noqa: E402

from ctrnn.model import CTRNN, expand_sc_to_unit_mask  # noqa: E402


def load_aparc_sc():
    """Load aparc cortical SC matrix and region labels (68 regions).

    Prefers the cache at ``data/aparc_sc.npz`` (created by
    ``scripts/setup_data.py``). Falls back to ENIGMA toolbox if the cache is
    missing — fine on a login node, but the fallback may fail on a compute
    node without network access.
    """
    cache = ROOT / "data" / "aparc_sc.npz"
    if cache.exists():
        d = np.load(cache, allow_pickle=False)
        return d["sc"], [str(label) for label in d["labels"]]
    print("[warn] no cached SC matrix; falling back to enigmatoolbox")
    from enigmatoolbox.datasets import load_sc

    sc, labels, _, _ = load_sc(parcellation="aparc")
    return np.asarray(sc), [str(label) for label in labels]


def fibonacci_sphere_centroids(n: int, radius_mm: float = 70.0) -> np.ndarray:
    """Even-ish placement of n points on a sphere, in MNI-mm-ish space.

    Stand-in for true Desikan-Killiany centroids. The dashboard's brain mesh is
    loaded independently, so unit positions only need to occupy a plausible
    cortex-shaped shell for the demo. Swap in real MNI centroids later.
    """
    indices = np.arange(0, n, dtype=np.float64) + 0.5
    phi = np.arccos(1 - 2 * indices / n)
    theta = math.pi * (1 + 5 ** 0.5) * indices
    x = radius_mm * np.cos(theta) * np.sin(phi)
    y = radius_mm * np.sin(theta) * np.sin(phi)
    z = radius_mm * np.cos(phi)
    return np.stack([x, y, z], axis=1)


def assign_unit_positions(
    centroids: np.ndarray,
    units_per_region: int,
    jitter_mm: float,
    rng: np.random.Generator,
) -> np.ndarray:
    """Place units near their region centroid with small Gaussian jitter."""
    positions = np.repeat(centroids, units_per_region, axis=0)
    positions += rng.normal(0.0, jitter_mm, size=positions.shape)
    return positions


def evaluate(model: CTRNN, dataset, n_batches: int, device: torch.device) -> float:
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for _ in range(n_batches):
            inputs_np, labels_np = dataset()
            inputs = torch.from_numpy(inputs_np).float().to(device)
            labels = torch.from_numpy(labels_np.flatten()).long().to(device)
            outputs, _ = model(inputs)
            preds = outputs.view(-1, model.output_dim).argmax(dim=-1)
            correct += (preds == labels).sum().item()
            total += labels.numel()
    model.train()
    return correct / max(total, 1)


def train(args):
    if args.device == "cuda" and not torch.cuda.is_available():
        print("[warn] cuda requested but unavailable, falling back to cpu")
        device = torch.device("cpu")
    else:
        device = torch.device(args.device)

    rng = np.random.default_rng(args.seed)
    torch.manual_seed(args.seed)

    # ---- connectome mask ---------------------------------------------------
    sc, region_labels = load_aparc_sc()
    n_regions = sc.shape[0]
    units_per_region = max(1, args.hidden // n_regions)
    actual_hidden = n_regions * units_per_region
    if actual_hidden != args.hidden:
        print(
            f"[info] adjusted hidden_dim {args.hidden} -> {actual_hidden} "
            f"({n_regions} regions x {units_per_region} units/region)"
        )
    mask = expand_sc_to_unit_mask(sc, units_per_region=units_per_region)
    sparsity = 1.0 - mask.mean().item()
    print(f"[mask] {actual_hidden}x{actual_hidden}, sparsity={sparsity:.2%}")

    # ---- neurogym dataset --------------------------------------------------
    env_kwargs = {"dt": 100}
    dataset = ngym.Dataset(
        args.task,
        env_kwargs=env_kwargs,
        batch_size=args.batch_size,
        seq_len=args.seq_len,
    )
    env = dataset.env
    input_dim = env.observation_space.shape[0]
    output_dim = env.action_space.n

    # ---- model -------------------------------------------------------------
    model = CTRNN(
        input_dim=input_dim,
        hidden_dim=actual_hidden,
        output_dim=output_dim,
        mask=mask,
        dt=args.dt_ms,
        tau=args.tau_ms,
    ).to(device)
    print(f"[model] params={sum(p.numel() for p in model.parameters()):,}")

    optimizer = torch.optim.Adam(model.parameters(), lr=args.lr)
    criterion = nn.CrossEntropyLoss()

    # ---- training loop -----------------------------------------------------
    print(
        f"[train] task={args.task} hidden={actual_hidden} obs={input_dim} "
        f"act={output_dim} device={device}"
    )
    running = 0.0
    for step in range(args.epochs):
        inputs_np, labels_np = dataset()
        inputs = torch.from_numpy(inputs_np).float().to(device)
        labels = torch.from_numpy(labels_np.flatten()).long().to(device)

        optimizer.zero_grad()
        outputs, _ = model(inputs)
        loss = criterion(outputs.view(-1, output_dim), labels)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        running += loss.item()

        if (step + 1) % args.log_every == 0:
            avg = running / args.log_every
            running = 0.0
            with torch.no_grad():
                preds = outputs.view(-1, output_dim).argmax(dim=-1)
                acc = (preds == labels).float().mean().item()
            print(f"  step {step + 1:>5d}/{args.epochs}  loss={avg:.4f}  acc={acc:.3f}")

    val_acc = evaluate(model, dataset, n_batches=args.eval_batches, device=device)
    print(f"[eval] val_acc={val_acc:.3f}")

    # ---- bundle export -----------------------------------------------------
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    torch.save(model.state_dict(), out_dir / "weights.pt")

    centroids = fibonacci_sphere_centroids(n_regions)
    unit_positions = assign_unit_positions(
        centroids, units_per_region, jitter_mm=args.jitter_mm, rng=rng
    )
    per_unit_region_labels = [
        region_labels[i // units_per_region] for i in range(actual_hidden)
    ]

    # Stretch field for the dashboard: top-K strongest masked recurrent edges.
    with torch.no_grad():
        W_eff = model.masked_W().detach().cpu().numpy()
    nonzero = int((W_eff != 0).sum())
    top_k = min(args.top_edges, nonzero)
    flat_idx = np.argsort(np.abs(W_eff).ravel())[::-1][:top_k]
    rows, cols = np.unravel_index(flat_idx, W_eff.shape)
    top_edges = [[int(r), int(c), float(W_eff[r, c])] for r, c in zip(rows, cols)]

    bundle = {
        "task": args.task,
        "n_units": actual_hidden,
        "units_per_region": units_per_region,
        "region_labels_unique": region_labels,
        "region_labels": per_unit_region_labels,
        "unit_positions": unit_positions.round(3).tolist(),
        "weights_path": "weights.pt",
        "dt_ms": args.dt_ms,
        "tau_ms": args.tau_ms,
        "input_dim": input_dim,
        "output_dim": output_dim,
        "val_acc": val_acc,
        "top_edges": top_edges,
    }
    with open(out_dir / "model_bundle.json", "w") as f:
        json.dump(bundle, f, indent=2)
    print(f"[done] bundle -> {out_dir}/model_bundle.json")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--task", default="PerceptualDecisionMaking-v0")
    p.add_argument("--epochs", type=int, default=2000)
    p.add_argument("--hidden", type=int, default=144)
    p.add_argument("--batch-size", type=int, default=16)
    p.add_argument("--seq-len", type=int, default=100)
    p.add_argument("--dt-ms", type=float, default=20.0)
    p.add_argument("--tau-ms", type=float, default=100.0)
    p.add_argument("--lr", type=float, default=1e-3)
    p.add_argument("--seed", type=int, default=0)
    p.add_argument("--device", default="cuda")
    p.add_argument("--out", default="ctrnn/bundles/default")
    p.add_argument("--log-every", type=int, default=100)
    p.add_argument("--eval-batches", type=int, default=20)
    p.add_argument("--top-edges", type=int, default=512)
    p.add_argument("--jitter-mm", type=float, default=3.0)
    args = p.parse_args()
    train(args)


if __name__ == "__main__":
    main()
