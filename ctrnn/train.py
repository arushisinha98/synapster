"""Train the synapster CTRNN on a single neurogym task and export a bundle.

Pattern follows neurogym's pytorch supervised-learning example:
https://neurogym.github.io/neurogym/latest/examples/supervised_learning_pytorch/

Bundle layout matches the integration contract in README.md:
    ctrnn/bundles/<task>.json   - metadata read by the dashboard
    ctrnn/bundles/<task>.pt     - state dict loaded by the inference server

Task names are snake_case (perceptual_decision, working_memory, reaction_time)
to match the dashboard's API; the neurogym env id is resolved via TASK_MAP.

Usage:
    python ctrnn/train.py --task perceptual_decision \\
        --epochs 2000 --device cuda --out ctrnn/bundles
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn

# Allow running as `python ctrnn/train.py` or `python -m ctrnn.train`.
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import neurogym as ngym  # noqa: E402

from ctrnn.model import CTRNN, expand_sc_to_unit_mask  # noqa: E402


# Snake-case task name -> neurogym env id. Single source of truth; the
# inference server should import this dict too.
TASK_MAP = {
    "perceptual_decision": "PerceptualDecisionMaking-v0",
    "working_memory":      "DelayMatchSample-v0",
    "reaction_time":       "ReadySetGo-v0",
}


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
    if args.task not in TASK_MAP:
        raise SystemExit(
            f"unknown task {args.task!r}; choose one of {list(TASK_MAP)}"
        )
    env_id = TASK_MAP[args.task]

    if args.device == "cuda" and not torch.cuda.is_available():
        print("[warn] cuda requested but unavailable, falling back to cpu")
        device = torch.device("cpu")
    else:
        device = torch.device(args.device)

    torch.manual_seed(args.seed)

    # ---- connectome mask ---------------------------------------------------
    sc, region_labels = load_aparc_sc()
    n_regions = int(sc.shape[0])
    if args.hidden != n_regions:
        print(
            f"[info] --hidden {args.hidden} != n_regions {n_regions}; "
            f"forcing one unit per region (N={n_regions})"
        )
    n_units = n_regions
    mask = expand_sc_to_unit_mask(sc, units_per_region=1)
    sparsity = 1.0 - mask.mean().item()
    print(f"[mask] {n_units}x{n_units}, sparsity={sparsity:.2%}")

    # ---- neurogym dataset --------------------------------------------------
    # neurogym's env-internal dt is in task-time ms; our CTRNN's dt is the
    # integration step. They're independent: model sees seq_len timesteps,
    # each interpreted as args.dt_ms of "brain time" by the dashboard.
    env_kwargs = {"dt": 100}
    dataset = ngym.Dataset(
        env_id,
        env_kwargs=env_kwargs,
        batch_size=args.batch_size,
        seq_len=args.seq_len,
    )
    env = dataset.env
    input_dim = int(env.observation_space.shape[0])
    output_dim = int(env.action_space.n)

    # ---- model -------------------------------------------------------------
    model = CTRNN(
        input_dim=input_dim,
        hidden_dim=n_units,
        output_dim=output_dim,
        mask=mask,
        dt=args.dt_ms,
        tau=args.tau_ms,
    ).to(device)
    print(f"[model] params={sum(p.numel() for p in model.parameters()):,}")

    optimizer = torch.optim.Adam(model.parameters(), lr=args.lr)
    criterion = nn.CrossEntropyLoss()

    print(
        f"[train] task={args.task} ({env_id}) hidden={n_units} "
        f"input_dim={input_dim} output_dim={output_dim} device={device}"
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
    weights_file = out_dir / f"{args.task}.pt"
    bundle_file = out_dir / f"{args.task}.json"

    torch.save(model.state_dict(), weights_file)

    bundle = {
        "task": args.task,
        "n_units": n_units,
        "input_dim": input_dim,
        "output_dim": output_dim,
        "dt_ms": args.dt_ms,
        "trial_duration_ms": int(args.seq_len * args.dt_ms),
        "coupling_alpha_mV_per_Vm": args.coupling_alpha,
        "weights_path": f"bundles/{args.task}.pt",
    }
    with open(bundle_file, "w") as f:
        json.dump(bundle, f, indent=2)
    print(f"[done] bundle -> {bundle_file}  weights -> {weights_file}  val_acc={val_acc:.3f}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--task", default="perceptual_decision",
                   help=f"snake_case task key; one of {list(TASK_MAP)}")
    p.add_argument("--epochs", type=int, default=2000)
    p.add_argument("--hidden", type=int, default=68,
                   help="forced to n_regions; flag kept for sanity-check warnings")
    p.add_argument("--batch-size", type=int, default=16)
    p.add_argument("--seq-len", type=int, default=200,
                   help="timesteps per trial; trial_duration_ms = seq_len * dt_ms")
    p.add_argument("--dt-ms", type=float, default=20.0)
    p.add_argument("--tau-ms", type=float, default=100.0)
    p.add_argument("--lr", type=float, default=1e-3)
    p.add_argument("--seed", type=int, default=0)
    p.add_argument("--device", default="cuda",
                   help="cuda | cpu | mps")
    p.add_argument("--out", default="ctrnn/bundles",
                   help="dir holding <task>.json + <task>.pt (flat layout)")
    p.add_argument("--coupling-alpha", type=float, default=0.1,
                   help="mV per V/m; written into bundle, applied by infer server")
    p.add_argument("--log-every", type=int, default=100)
    p.add_argument("--eval-batches", type=int, default=20)
    args = p.parse_args()
    train(args)


if __name__ == "__main__":
    main()
