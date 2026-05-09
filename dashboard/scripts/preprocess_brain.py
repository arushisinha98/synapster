#!/usr/bin/env python3
"""Decimate, normalize, and export Brain_Model.obj as compact JSON for the dashboard.

Reads:  data/Brain_Model.obj                (gitignored, 20 MB, ~192k faces)
Writes: dashboard/assets/brain.json         (committed, ~1-3 MB, ~30k faces)

Pipeline: load -> dedup verts -> decimate -> axis-orient -> recenter -> scale ->
recompute normals -> emit flat-array JSON.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np

try:
    import trimesh
except ImportError:
    sys.exit("trimesh not installed. `pip install trimesh` (or via pixi).")

try:
    import fast_simplification
    HAVE_SIMPLIFY = True
except ImportError:
    HAVE_SIMPLIFY = False

REPO = Path(__file__).resolve().parents[2]
SRC = REPO / "data" / "Brain_Model.obj"
DST = REPO / "dashboard" / "assets" / "brain.json"

TARGET_FACES = 30_000
TARGET_LONGEST_AXIS = 2.0


def main() -> None:
    if not SRC.exists():
        sys.exit(f"missing source: {SRC}")

    print(f"Loading {SRC.relative_to(REPO)}...")
    mesh = trimesh.load(SRC, force="mesh", process=False)
    print(f"  raw       : {len(mesh.vertices):>8,} verts, {len(mesh.faces):>8,} faces")
    print(f"  raw bbox  : min={mesh.bounds[0]}  max={mesh.bounds[1]}")
    print(f"  raw extent: {(mesh.bounds[1] - mesh.bounds[0])}")

    mesh.process(validate=True)
    mesh.merge_vertices(merge_tex=False, merge_norm=True)
    print(f"  dedup     : {len(mesh.vertices):>8,} verts, {len(mesh.faces):>8,} faces")

    if HAVE_SIMPLIFY and len(mesh.faces) > TARGET_FACES:
        verts = np.ascontiguousarray(mesh.vertices, dtype=np.float32)
        faces = np.ascontiguousarray(mesh.faces, dtype=np.uint32)
        new_verts, new_faces = fast_simplification.simplify(
            verts, faces, target_count=TARGET_FACES
        )
        mesh = trimesh.Trimesh(vertices=new_verts, faces=new_faces, process=False)
        mesh.process(validate=True)
        print(f"  decimate  : {len(mesh.vertices):>8,} verts, {len(mesh.faces):>8,} faces")
    elif not HAVE_SIMPLIFY:
        print("  WARN: fast-simplification missing; shipping full-resolution mesh.")
        print("        `pip install fast-simplification` for ~10x smaller payload.")

    extents = (mesh.bounds[1] - mesh.bounds[0])
    print(f"  extents   : x={extents[0]:.3f}  y={extents[1]:.3f}  z={extents[2]:.3f}")
    # Trust the input axis convention. This OBJ is Y-up (vertices in [0, 1.12]
    # for Y), Z=anteroposterior, X=mediolateral — three.js-friendly as-is.
    # If a future asset comes in with a different convention, hand-edit a perm
    # here rather than auto-detecting.

    center = (mesh.bounds[0] + mesh.bounds[1]) / 2.0
    mesh.vertices = mesh.vertices - center

    new_extents = (mesh.bounds[1] - mesh.bounds[0])
    scale = TARGET_LONGEST_AXIS / float(np.max(new_extents))
    mesh.vertices = mesh.vertices * scale
    print(f"  final     : extent={(mesh.bounds[1] - mesh.bounds[0])}  bbox={mesh.bounds[0]}..{mesh.bounds[1]}")

    mesh.fix_normals()
    positions = np.asarray(mesh.vertices, dtype=np.float32)
    indices = np.asarray(mesh.faces, dtype=np.uint32)
    normals = np.asarray(mesh.vertex_normals, dtype=np.float32)

    DST.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "n_verts": int(len(positions)),
        "n_faces": int(len(indices)),
        "positions": positions.flatten().tolist(),
        "indices": indices.flatten().tolist(),
        "normals": normals.flatten().tolist(),
    }
    with open(DST, "w") as f:
        json.dump(payload, f)

    size_kb = DST.stat().st_size / 1024.0
    print(f"  wrote     : {DST.relative_to(REPO)}  ({size_kb:,.1f} KB)")


if __name__ == "__main__":
    main()
