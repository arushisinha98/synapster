#!/usr/bin/env python3
"""Sanity-check aparc centroid placement against the dashboard cortex mesh.

After the swap to BrainMesh_ICBM152 (true MNI152), brain.json now ships in
pure MNI mm — and the aparc centroids in dashboard/data/aparc_centroids.js
are also in MNI mm. So inside-ness can be tested directly: no affine needed.

Usage:
  python dashboard/scripts/test_aparc_inside.py
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import numpy as np
import trimesh

REPO = Path(__file__).resolve().parents[2]
BRAIN_JSON = REPO / "dashboard" / "assets" / "brain.json"
APARC_JS = REPO / "dashboard" / "data" / "aparc_centroids.js"


def load_brain_mesh() -> trimesh.Trimesh:
    if not BRAIN_JSON.exists():
        sys.exit(f"missing {BRAIN_JSON}; run preprocess_brain_mni.py first")
    with open(BRAIN_JSON) as f:
        data = json.load(f)
    verts = np.array(data["positions"], dtype=np.float64).reshape(-1, 3)
    faces = np.array(data["indices"], dtype=np.int64).reshape(-1, 3)
    mesh = trimesh.Trimesh(vertices=verts, faces=faces, process=False)
    mesh.process(validate=True)
    return mesh


def load_aparc_centroids() -> list[dict]:
    src = APARC_JS.read_text()
    rows = []
    pat = re.compile(
        r"\{\s*name:\s*'([^']+)',\s*x:\s*([-\d.]+),\s*y:\s*([-\d.]+),\s*z:\s*([-\d.]+)\s*\}"
    )
    for m in pat.finditer(src):
        name, x, y, z = m.group(1), float(m.group(2)), float(m.group(3)), float(m.group(4))
        rows.append({"label": "L_" + name, "mni": [x, y, z]})
        rows.append({"label": "R_" + name, "mni": [-x, y, z]})
    if len(rows) != 68:
        print(f"WARN: parsed {len(rows)} entries (expected 68)")
    return rows


def lobe_of(label: str) -> str:
    name = label.split("_", 1)[1]
    frontal = {"superiorfrontal", "caudalmiddlefrontal", "rostralmiddlefrontal",
               "precentral", "paracentral", "lateralorbitofrontal",
               "medialorbitofrontal", "parsopercularis", "parsorbitalis",
               "parstriangularis", "frontalpole"}
    parietal = {"postcentral", "superiorparietal", "inferiorparietal",
                "supramarginal", "precuneus"}
    temporal = {"superiortemporal", "middletemporal", "inferiortemporal",
                "temporalpole", "transversetemporal", "bankssts", "entorhinal",
                "parahippocampal", "fusiform"}
    occipital = {"pericalcarine", "cuneus", "lingual", "lateraloccipital"}
    cingulate = {"caudalanteriorcingulate", "rostralanteriorcingulate",
                 "posteriorcingulate", "isthmuscingulate"}
    if name in frontal: return "frontal"
    if name in parietal: return "parietal"
    if name in temporal: return "temporal"
    if name in occipital: return "occipital"
    if name in cingulate: return "cingulate"
    if name == "insula": return "insula"
    return "other"


def main() -> None:
    mesh = load_brain_mesh()
    print(f"mesh: {len(mesh.vertices):,} verts, {len(mesh.faces):,} faces, "
          f"watertight={mesh.is_watertight}")
    print(f"mesh bbox (mm): min={mesh.bounds[0]}  max={mesh.bounds[1]}")

    centroids = load_aparc_centroids()
    pts = np.array([c["mni"] for c in centroids], dtype=np.float64)
    print(f"aparc: {len(centroids)} regions in MNI mm")

    inside = mesh.contains(pts)
    pct = 100.0 * inside.mean()
    print(f"\ninside : {inside.sum()} / {len(inside)}  ({pct:.1f}%)")

    if inside.sum() == len(inside):
        print("PASS — every aparc centroid lands inside the cortex mesh.")
        return

    by_lobe_out = {}
    by_lobe_total = {}
    for i, c in enumerate(centroids):
        lobe = lobe_of(c["label"])
        by_lobe_total[lobe] = by_lobe_total.get(lobe, 0) + 1
        if not inside[i]:
            by_lobe_out[lobe] = by_lobe_out.get(lobe, 0) + 1
    print("\noutside by lobe (outside / total):")
    for k in sorted(by_lobe_total):
        print(f"  {k:10s}  {by_lobe_out.get(k, 0):>2}/{by_lobe_total[k]:>2}")

    out_idx = np.where(~inside)[0]
    if len(out_idx):
        verts = np.asarray(mesh.vertices)
        diffs = pts[out_idx, None, :] - verts[None, :, :]
        dists_mm = np.sqrt((diffs ** 2).sum(axis=2)).min(axis=1)
        order = np.argsort(-dists_mm)
        print("\noutside regions (sorted by distance to nearest cortex vertex):")
        for k in order:
            gi = out_idx[k]
            lbl = centroids[gi]["label"]
            mni = centroids[gi]["mni"]
            print(f"  {lbl:36s} MNI=({mni[0]:+4.0f},{mni[1]:+4.0f},{mni[2]:+4.0f})  "
                  f"d={dists_mm[k]:.2f} mm")


if __name__ == "__main__":
    main()
