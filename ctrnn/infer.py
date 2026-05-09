"""FastAPI inference server for the synapster dashboard.

Implements the integration contract described in README.md (see "How the RNN
fits the dashboard"):

  GET  /health                      - public; tunnel/uptime check
  GET  /tasks                       - list of task ids
  GET  /bundle/{task}               - per-task model_bundle.json metadata
  POST /infer                       - run inference for a given (task, field_per_region)

All non-/health routes are protected by HTTP Basic Auth using the
`API_PASSWORD` environment variable. CORS is fully open to keep the demo
deploy frictionless; tighten via `ALLOWED_ORIGIN` if needed.

Run on MBP-2:
    export API_PASSWORD="judge-2026"   # match what's in Vercel env
    pixi run uvicorn ctrnn.infer:app --host 0.0.0.0 --port 8000
"""

from __future__ import annotations

import json
import os
import secrets
from pathlib import Path
from typing import Annotated, Any

import numpy as np
import torch
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent.parent
BUNDLE_DIR = ROOT / "ctrnn" / "bundles"

# ---------- auth ----------

security = HTTPBasic()


def require_password(
    creds: Annotated[HTTPBasicCredentials, Depends(security)],
) -> None:
    expected = os.environ.get("API_PASSWORD", "")
    if not expected:
        # Fail closed if the server was started without a password configured.
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "API_PASSWORD env var not set on server",
        )
    if not secrets.compare_digest(creds.password.encode(), expected.encode()):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )


Auth = Depends(require_password)


# ---------- request/response models ----------


class InferRequest(BaseModel):
    task: str
    field_per_region: list[list[float]] = Field(
        ..., description="T x N_regions, V/m at each region, each timestep"
    )
    # Optional: caller can override default trial input. T must match field_per_region.
    input_stimulus: list[list[float]] | None = None


class InferResponse(BaseModel):
    activations: list[list[float]]  # T x N
    task_output: list[list[float]]  # T x output_dim
    dt_ms: float
    coupling_alpha_mV_per_Vm: float


# ---------- bundle loading ----------


class TaskBundle:
    """In-memory wrapper around a trained CTRNN bundle."""

    def __init__(self, task_dir: Path):
        meta_path = task_dir / "model_bundle.json"
        if not meta_path.exists():
            raise FileNotFoundError(f"missing bundle: {meta_path}")
        with open(meta_path) as f:
            self.meta = json.load(f)
        self.task = self.meta["task"]
        self.dt_ms = float(self.meta.get("dt_ms", 20))
        self.alpha = float(self.meta.get("coupling_alpha_mV_per_Vm", 0.1))
        # Lazy: weights load on first /infer call so /tasks stays cheap.
        self._model: Any = None
        self._weights_path = task_dir / Path(self.meta["weights_path"]).name

    def model(self) -> Any:
        if self._model is None:
            # Imported here so /tasks works without torch being healthy.
            from ctrnn.model import CTRNN  # type: ignore

            sd = torch.load(self._weights_path, map_location="cpu", weights_only=False)
            # Bundle should carry enough kwargs to reconstruct the CTRNN. If
            # this dict shape evolves with model.py, adjust here only.
            kwargs = self.meta.get("model_kwargs", {})
            net = CTRNN(**kwargs)
            net.load_state_dict(sd)
            net.eval()
            self._model = net
        return self._model


def discover_bundles() -> dict[str, TaskBundle]:
    out: dict[str, TaskBundle] = {}
    if not BUNDLE_DIR.exists():
        return out
    for d in sorted(BUNDLE_DIR.iterdir()):
        if d.is_dir() and (d / "model_bundle.json").exists():
            try:
                b = TaskBundle(d)
                out[b.task] = b
            except Exception as e:
                print(f"[infer] skip bundle {d.name}: {e}")
    return out


# ---------- app ----------

app = FastAPI(title="synapster-infer", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("ALLOWED_ORIGIN", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BUNDLES: dict[str, TaskBundle] = {}


@app.on_event("startup")
def startup() -> None:
    global BUNDLES
    BUNDLES = discover_bundles()
    print(f"[infer] loaded {len(BUNDLES)} bundles: {list(BUNDLES.keys())}")
    if not os.environ.get("API_PASSWORD"):
        print("[infer] WARN: API_PASSWORD not set; protected routes will 500")
    # Pre-warm ENIGMA structural connectivity so the first /infer call doesn't
    # block on the toolbox's first-time download. Best-effort; non-fatal.
    try:
        from enigmatoolbox.datasets import load_sc  # type: ignore

        _ = load_sc(parcellation="aparc")
        print("[infer] ENIGMA aparc SC pre-warmed")
    except Exception as e:
        print(f"[infer] ENIGMA warmup skipped: {e}")


@app.get("/health")
def health() -> dict[str, Any]:
    """Public liveness probe; safe to curl from anywhere."""
    return {
        "ok": True,
        "n_bundles": len(BUNDLES),
        "tasks": list(BUNDLES.keys()),
        "auth_configured": bool(os.environ.get("API_PASSWORD")),
    }


@app.get("/tasks")
def tasks(_: None = Auth) -> list[str]:
    return list(BUNDLES.keys())


@app.get("/bundle/{task}")
def bundle(task: str, _: None = Auth) -> dict[str, Any]:
    if task not in BUNDLES:
        raise HTTPException(404, f"unknown task: {task}")
    return BUNDLES[task].meta


@app.post("/infer", response_model=InferResponse)
def infer(req: InferRequest, _: None = Auth) -> InferResponse:
    if req.task not in BUNDLES:
        raise HTTPException(404, f"unknown task: {req.task}")
    b = BUNDLES[req.task]
    field = np.asarray(req.field_per_region, dtype=np.float32)
    if field.ndim != 2:
        raise HTTPException(400, f"field_per_region must be 2D, got shape {field.shape}")
    T, N = field.shape

    net = b.model()
    n_units = int(b.meta.get("n_units", N))
    if N != n_units:
        raise HTTPException(
            400, f"field_per_region last dim {N} != bundle n_units {n_units}"
        )

    # V/m field → membrane voltage perturbation (mV) → CTRNN input current term.
    # Bio-accurate convention: stim is added at the input of each unit, never
    # to the recurrent weights. The CTRNN's tau naturally low-passes oscillation.
    stim_mV = torch.from_numpy(field * b.alpha).unsqueeze(0)  # (1, T, N)

    if req.input_stimulus is not None:
        u = torch.tensor(req.input_stimulus, dtype=torch.float32).unsqueeze(0)
    else:
        # Canned zero input — caller is just probing the stim response.
        input_dim = int(b.meta.get("input_dim", 1))
        u = torch.zeros((1, T, input_dim), dtype=torch.float32)

    with torch.no_grad():
        # The CTRNN.forward signature is decided by ctrnn/model.py. The
        # bundle is expected to declare a stim-aware forward; if model.py's
        # API differs, adjust the call here only.
        out = net(u, stim=stim_mV)
        # Common shapes: (rates, output) tuple, or a dict; handle both.
        if isinstance(out, tuple):
            rates, output = out[:2]
        elif isinstance(out, dict):
            rates, output = out["rates"], out["output"]
        else:
            raise HTTPException(500, f"unexpected model output: {type(out)}")

    rates_np = rates.squeeze(0).cpu().numpy()
    output_np = output.squeeze(0).cpu().numpy()
    return InferResponse(
        activations=rates_np.tolist(),
        task_output=output_np.tolist(),
        dt_ms=b.dt_ms,
        coupling_alpha_mV_per_Vm=b.alpha,
    )
