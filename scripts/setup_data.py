"""One-time setup: cache the ENIGMA aparc SC matrix and verify all deps.

Run this on the HPC login node (which has internet) before submitting jobs.
Compute nodes usually have no outbound connectivity, so any first-time fetch
or import-time network call must happen here.

Usage:
    pixi run -e hpc python scripts/setup_data.py    # on the cluster
    pixi run python scripts/setup_data.py           # locally on macOS
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
DATA.mkdir(exist_ok=True)


def verify_torch() -> None:
    print("[setup] torch...")
    import torch

    mps = (
        torch.backends.mps.is_available()
        if hasattr(torch.backends, "mps")
        else False
    )
    print(
        f"  torch={torch.__version__}  cuda={torch.cuda.is_available()}  mps={mps}"
    )


def fetch_aparc_sc() -> Path:
    print("[setup] ENIGMA aparc SC matrix...")
    from enigmatoolbox.datasets import load_sc

    sc, labels, _, _ = load_sc(parcellation="aparc")
    sc = np.asarray(sc, dtype=np.float64)
    labels = np.asarray([str(label) for label in labels])

    out = DATA / "aparc_sc.npz"
    np.savez(out, sc=sc, labels=labels)
    print(
        f"  cached -> {out.relative_to(ROOT)}  "
        f"shape={sc.shape}  density={(sc > 0).mean():.2%}"
    )
    return out


def verify_neurogym() -> None:
    print("[setup] neurogym tasks...")
    import neurogym as ngym

    for task in [
        "PerceptualDecisionMaking-v0",
        "DelayMatchSample-v0",
        "ReadySetGo-v0",
    ]:
        ds = ngym.Dataset(task, env_kwargs={"dt": 100}, batch_size=2, seq_len=10)
        x, y = ds()
        print(f"  {task}: obs={tuple(x.shape)} labels={tuple(y.shape)}")


def main() -> int:
    verify_torch()
    fetch_aparc_sc()
    verify_neurogym()
    print("[setup] done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
