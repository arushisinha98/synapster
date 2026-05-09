"""FastAPI inference server for synapster CTRNN bundles.

Implements the API contract from README.md §"How the RNN fits the dashboard":

    GET  /tasks           -> ["perceptual_decision", ...]
    GET  /bundle/<task>   -> contents of ctrnn/bundles/<task>.json
    POST /infer           -> {activations, task_output, dt_ms}

Coupling-α placement
--------------------
The dashboard ships V/m field magnitudes per region. The bundle declares
``coupling_alpha_mV_per_Vm`` (≈ 0.1). The server multiplies field by alpha
*here* before passing to the model so the bundle stays the single source
of truth for the conversion factor and the CTRNN itself stays unitless.

Reconstruction of the trained CTRNN at startup
----------------------------------------------
A .pt file is just a state_dict — to load it we have to re-instantiate the
exact same CTRNN architecture (input/output dims, hidden_dim, mask, dt, tau).
We pull all hyperparameters from the bundle JSON. ``tau_ms`` is a schema
extension beyond the README spec; if it's missing we default to 100 ms with
a warning, but every bundle written by ctrnn/train.py includes it.

Run with:
    pixi run python ctrnn/infer_server.py
or:
    pixi run python -m uvicorn ctrnn.infer_server:app --host 0.0.0.0 --port 8000
"""

from __future__ import annotations

import json
import sys
import warnings
from contextlib import asynccontextmanager
from pathlib import Path
from typing import List, Optional

import numpy as np
import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Allow `python ctrnn/infer_server.py` and `python -m ctrnn.infer_server`.
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import neurogym as ngym  # noqa: E402

from ctrnn.model import CTRNN, expand_sc_to_unit_mask  # noqa: E402
from ctrnn.train import TASK_MAP, load_aparc_sc  # noqa: E402

BUNDLES_DIR = ROOT / "ctrnn" / "bundles"
CENTROIDS_PATH = BUNDLES_DIR / "aparc_centroids.json"


# ---------------------------------------------------------------------------
# Request / response schemas
# ---------------------------------------------------------------------------


class InferRequest(BaseModel):
    """POST /infer body. Field shape conventions match README §API."""

    task: str = Field(..., description="snake_case task key, e.g. 'perceptual_decision'")
    # T x n_units (= T x 68) V/m field magnitudes per region. Server multiplies
    # by bundle.coupling_alpha_mV_per_Vm before adding to the dynamics.
    field_per_region: List[List[float]]
    # Optional T x input_dim drive overriding the default canned trial.
    input_stimulus: Optional[List[List[float]]] = None


class InferResponse(BaseModel):
    activations: List[List[float]]    # T x n_units, post-tanh rates
    task_output: List[List[float]]    # T x output_dim, behavioural readout
    dt_ms: float


# ---------------------------------------------------------------------------
# Loaded-task container
# ---------------------------------------------------------------------------


class _LoadedTask:
    """Everything we need at inference time for one task.

    Held in memory for the life of the server so /infer is one matmul, not
    a disk + ENIGMA + neurogym round-trip per request.
    """

    def __init__(
        self,
        task: str,
        bundle: dict,
        model: CTRNN,
        canned_input: torch.Tensor,
    ):
        self.task = task
        self.bundle = bundle
        self.model = model
        # canned_input shape: (T, 1, input_dim) — pre-batched for forward()
        self.canned_input = canned_input


_TASKS: dict[str, _LoadedTask] = {}
_DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# ---------------------------------------------------------------------------
# Startup helpers
# ---------------------------------------------------------------------------


def _validate_centroid_alignment(bundle_labels: list[str]) -> None:
    """Catch index drift between trained weights and the centroids file.

    Both lists must contain the same 68 region names in the same order, so
    that activation index i and centroid position i refer to the same region.
    Raising at startup beats producing silently misaligned visualizations
    in front of the demo audience.
    """
    if not CENTROIDS_PATH.exists():
        warnings.warn(
            f"{CENTROIDS_PATH.relative_to(ROOT)} missing — skipping alignment "
            "check. Generate it with scripts/generate_centroids.py before any "
            "dashboard demo, or the 3D nodes will be unplaced."
        )
        return
    with open(CENTROIDS_PATH) as f:
        centroids = json.load(f)
    centroid_labels = list(centroids["labels"])
    if centroid_labels != bundle_labels:
        # Show the first divergence so the failure is debuggable.
        diff_idx = next(
            (i for i, (a, b) in enumerate(zip(bundle_labels, centroid_labels)) if a != b),
            min(len(bundle_labels), len(centroid_labels)),
        )
        raise RuntimeError(
            "Region label drift between bundle and aparc_centroids.json:\n"
            f"  first divergence at index {diff_idx}\n"
            f"  bundle:    {bundle_labels[max(0, diff_idx-1):diff_idx+2]}\n"
            f"  centroids: {centroid_labels[max(0, diff_idx-1):diff_idx+2]}\n"
            "Regenerate the centroids file from the same SC cache used at "
            "training time."
        )


def _make_canned_trial(env_id: str, seq_len: int, input_dim: int) -> torch.Tensor:
    """Pre-generate one representative trial per task at startup.

    Used as the default ``input_stimulus`` when /infer is called without one.
    Caching means repeated stim experiments produce a deterministic baseline:
    same input across calls, so any change in activations is fully attributable
    to the field. (Generating fresh on every call would make the dashboard's
    'turn stim off' button look broken, since the input would also change.)
    """
    ds = ngym.Dataset(env_id, env_kwargs={"dt": 100}, batch_size=1, seq_len=seq_len)
    inputs_np, _ = ds()
    # neurogym returns (T, B, input_dim); we keep B=1.
    if inputs_np.shape[-1] != input_dim:
        raise RuntimeError(
            f"canned trial input_dim {inputs_np.shape[-1]} != bundle "
            f"input_dim {input_dim}; env or training config drifted"
        )
    return torch.from_numpy(inputs_np).float()


def _load_one_task(task: str) -> _LoadedTask:
    """Load bundle + weights + canned trial for one task and prepare for inference."""
    bundle_file = BUNDLES_DIR / f"{task}.json"
    weights_file = BUNDLES_DIR / f"{task}.pt"
    if not bundle_file.exists():
        raise FileNotFoundError(f"missing bundle: {bundle_file.relative_to(ROOT)}")
    if not weights_file.exists():
        raise FileNotFoundError(f"missing weights: {weights_file.relative_to(ROOT)}")

    with open(bundle_file) as f:
        bundle = json.load(f)

    # ---- Reconstruct the trained CTRNN -----------------------------------
    # The mask is derived from the cached SC matrix the same way train.py
    # does it. Identical SC -> identical binary mask -> the masked W_rec
    # the .pt was trained against.
    sc, region_labels_from_sc = load_aparc_sc()

    # Region-label sanity: the bundle stores the labels seen at training; the
    # current SC cache had better produce the same list. If they diverge
    # (e.g. someone regenerated the cache with a different ENIGMA version),
    # fail loud rather than silently shuffling units.
    bundle_labels = bundle.get("region_labels")
    if bundle_labels is not None and bundle_labels != region_labels_from_sc:
        raise RuntimeError(
            f"SC label drift for task {task!r}: bundle's region_labels do not "
            "match data/aparc_sc.npz. Re-run training or restore the original cache."
        )
    # And sanity check against the static centroids file.
    _validate_centroid_alignment(region_labels_from_sc)

    if len(region_labels_from_sc) != bundle["n_units"]:
        raise RuntimeError(
            f"SC has {len(region_labels_from_sc)} regions but bundle expects "
            f"{bundle['n_units']} units."
        )
    mask = expand_sc_to_unit_mask(sc, units_per_region=1)

    # tau_ms is a schema extension; default to 100 ms (train.py's default)
    # for older bundles and warn so the operator notices.
    if "tau_ms" not in bundle:
        warnings.warn(
            f"bundle {task} predates tau_ms field; defaulting to 100 ms. "
            "Retrain to embed the actual tau used."
        )
    tau_ms = float(bundle.get("tau_ms", 100.0))

    model = CTRNN(
        input_dim=bundle["input_dim"],
        hidden_dim=bundle["n_units"],
        output_dim=bundle["output_dim"],
        mask=mask,
        dt=bundle["dt_ms"],
        tau=tau_ms,
    )
    # weights_only=True is the safe default in modern torch — refuses to
    # unpickle arbitrary code from the .pt file.
    state = torch.load(weights_file, map_location=_DEVICE, weights_only=True)
    model.load_state_dict(state)
    model.eval().to(_DEVICE)

    # ---- Canned trial -----------------------------------------------------
    seq_len = int(bundle["trial_duration_ms"] // bundle["dt_ms"])
    canned = _make_canned_trial(
        env_id=TASK_MAP[task],
        seq_len=seq_len,
        input_dim=bundle["input_dim"],
    ).to(_DEVICE)

    return _LoadedTask(task=task, bundle=bundle, model=model, canned_input=canned)


def _load_all_tasks() -> None:
    """Load every task whose bundle exists. Missing bundles are skipped, not fatal."""
    for task in TASK_MAP:
        bundle_file = BUNDLES_DIR / f"{task}.json"
        if not bundle_file.exists():
            warnings.warn(f"skipping {task}: no bundle at {bundle_file.relative_to(ROOT)}")
            continue
        try:
            _TASKS[task] = _load_one_task(task)
            print(f"[infer_server] loaded {task}")
        except Exception as exc:
            # Don't take down the whole server because one task failed. The
            # /tasks endpoint will simply not list it.
            warnings.warn(f"skipping {task}: {exc}")


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load all task bundles at startup, drop them at shutdown."""
    _load_all_tasks()
    if not _TASKS:
        warnings.warn(
            "No bundles loaded. Run `python ctrnn/train.py --task <key>` first."
        )
    yield
    _TASKS.clear()


app = FastAPI(title="synapster CTRNN inference", lifespan=lifespan)

# Permissive CORS for local dashboard development. Tighten before any deployment
# beyond `localhost`.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.get("/tasks")
def list_tasks() -> list[str]:
    """README §API: return loaded task keys (snake_case)."""
    return sorted(_TASKS.keys())


@app.get("/bundle/{task}")
def get_bundle(task: str) -> dict:
    """README §API: return the bundle JSON for one task verbatim."""
    if task not in _TASKS:
        raise HTTPException(404, f"unknown task: {task}")
    return _TASKS[task].bundle


@app.post("/infer", response_model=InferResponse)
def infer(req: InferRequest) -> InferResponse:
    """README §API: run one trial through the CTRNN under the given field.

    Steps:
      1. Validate field shape against the bundle's n_units.
      2. Apply coupling alpha (V/m -> mV-equivalent membrane perturbation).
      3. Resolve task input: explicit input_stimulus, or the canned trial
         padded/truncated to match T.
      4. Forward pass; squeeze batch dim; return as plain JSON lists.
    """
    if req.task not in _TASKS:
        raise HTTPException(404, f"unknown task: {req.task}")

    loaded = _TASKS[req.task]
    bundle = loaded.bundle
    n_units = bundle["n_units"]
    input_dim = bundle["input_dim"]
    alpha = float(bundle["coupling_alpha_mV_per_Vm"])

    # ---- Field validation + coupling -------------------------------------
    field = np.asarray(req.field_per_region, dtype=np.float32)
    if field.ndim != 2 or field.shape[1] != n_units:
        raise HTTPException(
            422,
            f"field_per_region must be shape (T, {n_units}); got {tuple(field.shape)}",
        )
    T = int(field.shape[0])

    # V/m -> mV; .unsqueeze(1) adds the batch dim the model expects.
    stim = torch.from_numpy(field * alpha).unsqueeze(1).to(_DEVICE)

    # ---- Task input ------------------------------------------------------
    if req.input_stimulus is not None:
        u_np = np.asarray(req.input_stimulus, dtype=np.float32)
        if u_np.shape != (T, input_dim):
            raise HTTPException(
                422,
                f"input_stimulus must be shape (T={T}, input_dim={input_dim}); "
                f"got {tuple(u_np.shape)}",
            )
        inputs = torch.from_numpy(u_np).unsqueeze(1).to(_DEVICE)
    else:
        # Slice or zero-pad the canned trial to match the field's T. Padding
        # is silence (zero drive) rather than tiling; tiling would re-trigger
        # the trial mid-stim and confuse the activations.
        canned = loaded.canned_input  # (T_canned, 1, input_dim)
        T_canned = canned.shape[0]
        if T == T_canned:
            inputs = canned
        elif T < T_canned:
            inputs = canned[:T]
        else:
            pad = torch.zeros(T - T_canned, 1, input_dim, device=_DEVICE)
            inputs = torch.cat([canned, pad], dim=0)

    # ---- Forward ---------------------------------------------------------
    with torch.no_grad():
        outputs, hidden = loaded.model(inputs, stim=stim)

    # Drop batch dim and convert to plain Python lists for JSON serialization.
    return InferResponse(
        activations=hidden.squeeze(1).cpu().numpy().tolist(),
        task_output=outputs.squeeze(1).cpu().numpy().tolist(),
        dt_ms=float(bundle["dt_ms"]),
    )


if __name__ == "__main__":
    # Run the server. `reload=False` because reload=True would re-import
    # everything per file change, including reloading every .pt — too slow
    # to be useful. For frontend iteration the server doesn't need to reload.
    import uvicorn

    uvicorn.run("ctrnn.infer_server:app", host="0.0.0.0", port=8000, reload=False)
