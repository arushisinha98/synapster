#!/usr/bin/env python3
"""Preprocess BrainMesh_ICBM152 (MNI152-registered cortex) for the dashboard.

Reads:  data/BrainMesh_ICBM152.lh.mz3       (downloaded from NiiVue's CDN)
Writes: dashboard/assets/brain.json          (same flat-array schema as
                                              preprocess_brain.py)

Notes
-----
- Only the LH file is on the niivue CDN. The RH is synthesised by mirroring
  LH across X=0 — anatomically faithful since ICBM152 is a symmetric template.
- Vertices stay in MNI mm. The dashboard JS applies a single uniform scale
  on load, so every consumer (dashboard mesh, aparc centroids, future field
  volumes) shares one obvious affine.
"""

from __future__ import annotations

import gzip
import json
import struct
import sys
import urllib.request
from pathlib import Path

import numpy as np

try:
    import fast_simplification
    HAVE_SIMPLIFY = True
except ImportError:
    HAVE_SIMPLIFY = False

REPO = Path(__file__).resolve().parents[2]
LH_URL = "https://niivue.com/demos/images/BrainMesh_ICBM152.lh.mz3"
LH_PATH = REPO / "data" / "BrainMesh_ICBM152.lh.mz3"
DST = REPO / "dashboard" / "assets" / "brain.json"

TARGET_FACES = 30_000


def download_if_missing(url: str, path: Path) -> None:
    if path.exists() and path.stat().st_size > 1000:
        print(f"  cached    : {path.relative_to(REPO)} ({path.stat().st_size / 1024:.1f} KB)")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    print(f"  fetching  : {url}")
    urllib.request.urlretrieve(url, path)
    print(f"  saved     : {path.relative_to(REPO)} ({path.stat().st_size / 1024:.1f} KB)")


def load_mz3(path: Path) -> tuple[np.ndarray, np.ndarray]:
    raw = path.read_bytes()
    data = gzip.decompress(raw) if raw[:2] == b"\x1f\x8b" else raw
    magic, attr, n_face, n_vert, n_skip = struct.unpack("<HHIII", data[:16])
    if magic != 0x5A4D:
        raise ValueError(f"unexpected magic 0x{magic:04x} (expected 0x5a4d)")
    if not (attr & 1) or not (attr & 2):
        raise ValueError(f"MZ3 must contain faces+verts (attr=0x{attr:04x})")
    is_double = bool(attr & 16)
    hdr = 16 + n_skip
    faces = np.frombuffer(data, dtype=np.uint32, count=n_face * 3, offset=hdr).reshape(-1, 3)
    vert_offset = hdr + n_face * 3 * 4
    vert_dtype = np.float64 if is_double else np.float32
    verts = np.frombuffer(data, dtype=vert_dtype, count=n_vert * 3, offset=vert_offset).reshape(-1, 3)
    return verts.astype(np.float32).copy(), faces.astype(np.uint32).copy()


def mirror_to_right(verts_lh: np.ndarray, faces_lh: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Make a right hemisphere by negating X. Reverse face winding so outward
    normals stay outward after the mirror."""
    verts_rh = verts_lh.copy()
    verts_rh[:, 0] = -verts_rh[:, 0]
    faces_rh = faces_lh[:, ::-1].copy()  # flip winding
    return verts_rh, faces_rh


def merge(verts_a, faces_a, verts_b, faces_b) -> tuple[np.ndarray, np.ndarray]:
    verts = np.vstack([verts_a, verts_b]).astype(np.float32)
    faces = np.vstack([faces_a, faces_b + len(verts_a)]).astype(np.uint32)
    return verts, faces


def vertex_normals(verts: np.ndarray, faces: np.ndarray) -> np.ndarray:
    """Area-weighted vertex normals."""
    v0 = verts[faces[:, 0]]
    v1 = verts[faces[:, 1]]
    v2 = verts[faces[:, 2]]
    fn = np.cross(v1 - v0, v2 - v0)
    nrm = np.zeros_like(verts)
    for i in range(3):
        np.add.at(nrm, faces[:, i], fn)
    n = np.linalg.norm(nrm, axis=1, keepdims=True)
    n[n == 0] = 1.0
    return (nrm / n).astype(np.float32)


def main() -> None:
    print("Preprocess BrainMesh_ICBM152 -> dashboard/assets/brain.json")
    download_if_missing(LH_URL, LH_PATH)

    verts_lh, faces_lh = load_mz3(LH_PATH)
    print(f"  LH       : {len(verts_lh):>7,} verts, {len(faces_lh):>7,} faces  bbox x=[{verts_lh[:,0].min():+.2f}, {verts_lh[:,0].max():+.2f}]")

    verts_rh, faces_rh = mirror_to_right(verts_lh, faces_lh)
    print(f"  RH (mir) : {len(verts_rh):>7,} verts, {len(faces_rh):>7,} faces  bbox x=[{verts_rh[:,0].min():+.2f}, {verts_rh[:,0].max():+.2f}]")

    verts, faces = merge(verts_lh, faces_lh, verts_rh, faces_rh)
    print(f"  combined : {len(verts):>7,} verts, {len(faces):>7,} faces")

    if HAVE_SIMPLIFY and len(faces) > TARGET_FACES:
        new_v, new_f = fast_simplification.simplify(
            np.ascontiguousarray(verts, dtype=np.float32),
            np.ascontiguousarray(faces, dtype=np.uint32),
            target_count=TARGET_FACES,
        )
        verts = new_v.astype(np.float32)
        faces = new_f.astype(np.uint32)
        print(f"  decimate : {len(verts):>7,} verts, {len(faces):>7,} faces")
    elif not HAVE_SIMPLIFY:
        print("  WARN     : fast-simplification missing; shipping full-resolution mesh")

    bbox_min = verts.min(axis=0)
    bbox_max = verts.max(axis=0)
    extent = bbox_max - bbox_min
    print(f"  bbox (mm): min={bbox_min}  max={bbox_max}")
    print(f"  extent   : {extent}  (longest = {extent.max():.2f} mm)")

    normals = vertex_normals(verts, faces)

    DST.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "n_verts": int(len(verts)),
        "n_faces": int(len(faces)),
        "positions": verts.flatten().tolist(),
        "indices": faces.flatten().tolist(),
        "normals": normals.flatten().tolist(),
    }
    with open(DST, "w") as f:
        json.dump(payload, f)
    print(f"  wrote    : {DST.relative_to(REPO)} ({DST.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
