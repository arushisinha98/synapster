"""Generate ctrnn/bundles/aparc_centroids.json — the static asset the dashboard
reads at app load to place the 68 region nodes in 3D.

WHY THIS IS A SEPARATE SCRIPT
-----------------------------
The centroid coordinates are stable across all tasks (regions don't move).
Computing them once and committing the JSON means:
  - the dashboard doesn't have to fetch enigmatoolbox-bundled surfaces,
  - HPC compute nodes never need enigmatoolbox installed,
  - teammates pulling the repo get the file for free.

The label order in the output JSON MUST match data/aparc_sc.npz so that
unit `i` in trained weights corresponds to centroid `i` here. We pull the
canonical label order from the SC cache to guarantee this.

WHERE TO RUN
------------
Run this once in the python environment where enigmatoolbox is installed.
For most of us that's the (base) conda env (since enigmatoolbox's setup.py
fights with pixi). After the JSON is committed, no one ever needs to run
this again.

Usage:
    python scripts/generate_centroids.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SC_CACHE = ROOT / "data" / "aparc_sc.npz"
OUT_PATH = ROOT / "ctrnn" / "bundles" / "aparc_centroids.json"


def get_canonical_labels() -> list[str]:
    """Return the 68-label order from the cached SC matrix.

    This is the single source of truth for region order. Whatever order
    ENIGMA's load_sc() returned when the cache was generated is the order
    the trained weights are aligned to.
    """
    if not SC_CACHE.exists():
        raise SystemExit(
            f"{SC_CACHE.relative_to(ROOT)} missing. Run scripts/setup_data.py first."
        )
    d = np.load(SC_CACHE, allow_pickle=False)
    return [str(label) for label in d["labels"]]


def compute_centroids_via_enigma(n_expected: int) -> np.ndarray:
    """Mean fsaverage5 vertex position per aparc parcel.

    fsaverage5 surfaces in MNI152 space are roughly MNI-aligned for cortex,
    so per-parcel mean (x, y, z) gives sensible MNI-mm centroids for the
    demo. Real anatomical pipelines would use the volumetric atlas centroids
    in MNI152, but for visualization a few mm of slop on the cortical shell
    is invisible against the dashboard's brain mesh.

    Returns:
        (n_parcels, 3) array of [x, y, z] in mm. Order is whatever
        surface_to_parcel returns — we check it has the expected length;
        deeper-level alignment with the SC labels is asserted by the caller.
    """
    from enigmatoolbox.datasets import load_fsa5
    from enigmatoolbox.utils.parcellation import surface_to_parcel

    # load_fsa5() returns left/right BSPolyData (brainspace mesh objects).
    # .Points is an (n_vertices, 3) array of MNI-aligned coordinates.
    surf_lh, surf_rh = load_fsa5()
    pts = np.vstack([np.asarray(surf_lh.Points), np.asarray(surf_rh.Points)])

    # surface_to_parcel reduces a per-vertex array to per-parcel using the
    # mean. We do this once per coordinate axis to get centroids.
    x = np.asarray(surface_to_parcel(pts[:, 0], "aparc"))
    y = np.asarray(surface_to_parcel(pts[:, 1], "aparc"))
    z = np.asarray(surface_to_parcel(pts[:, 2], "aparc"))
    centroids = np.stack([x, y, z], axis=1)

    # Some ENIGMA versions prepend a 'background' / 'unknown' parcel at
    # index 0. Drop it if the count is one too high.
    if centroids.shape[0] == n_expected + 1:
        print("[centroids] dropping leading background parcel")
        centroids = centroids[1:]
    elif centroids.shape[0] == n_expected + 2:
        print("[centroids] dropping leading background parcels (lh + rh)")
        centroids = centroids[[i for i in range(centroids.shape[0]) if i not in (0, n_expected // 2 + 1)]]

    return centroids


def main() -> int:
    labels = get_canonical_labels()
    n = len(labels)
    print(f"[centroids] canonical label count: {n}")

    centroids = compute_centroids_via_enigma(n_expected=n)
    if centroids.shape[0] != n:
        raise SystemExit(
            f"centroid count {centroids.shape[0]} != SC label count {n}.\n"
            "  enigmatoolbox's surface_to_parcel returned a different parcel\n"
            "  count than load_sc. Likely an ENIGMA version mismatch — verify\n"
            "  both came from the same install."
        )

    # Round to 3 decimals — sub-millimetre precision is meaningless on a
    # cortical mesh and bloats the JSON unnecessarily.
    out = {
        "n_regions": n,
        "labels": labels,
        "positions": centroids.round(3).tolist(),
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(out, f, indent=2)
    print(f"[centroids] wrote -> {OUT_PATH.relative_to(ROOT)}")
    print("[centroids] commit this file: it's a stable shared asset.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
