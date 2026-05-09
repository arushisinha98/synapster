# synapster

London hackathon project. 4 people, 3 hours.

A dashboard for designing brain stimulation protocols (tDCS / tACS / TI) on a 3D brain, with a spatially embedded CTRNN inside, and an LLM side panel that proposes protocols from a patient ailment description.

Research foundation in [`docs/`](docs): seRNN ([`spatial-neuro-rnn.md`](docs/spatial-neuro-rnn.md)), multi-task cognitive networks ([`cognitive-tasks.md`](docs/cognitive-tasks.md)), digital twin brain from connectomes ([`digital-twin-brain.md`](docs/digital-twin-brain.md)), multiregion neocortex theory ([`multiregion-neurocortex.md`](docs/multiregion-neurocortex.md)), RL-driven closed-loop stim ([`rl-stimulation.md`](docs/rl-stimulation.md)), and virtual brain twins for epilepsy with TI ([`virtual-brain-epilepsy.md`](docs/virtual-brain-epilepsy.md)).

## Team split

- **CTRNN crew (2):** spatially embedded CTRNNs on neurogym tasks; export model bundles + run the inference backend.
- **Dashboard (1, Martin):** Vite + React + react-three-fiber. 3D brain, electrode placement, stim physics, RNN unit activity playback.
- **LLM loop (1):** side-panel agent that takes a patient ailment, reads papers, places electrodes via MCP, runs simulations.

---

## How the RNN fits the dashboard (integration contract)

This is the single most important thing to get right. Read carefully.

### Spatial model

- **68 aparc regions** (Desikan–Killiany, ENIGMA Toolbox).
- **One CTRNN unit per region.** N = 68. Simple, interpretable, fast.
- Unit `i` lives at the MNI centroid of region `i`. Both the CTRNN and the dashboard share the same length-68 ordering, defined once in `bundles/aparc_centroids.json`.

### Stim physics — what the field actually is

Scalp electrodes inject current; what reaches the cortex is an **electric field** (V/m). A neuron in that field experiences a small membrane voltage offset (~0.1–0.2 mV per V/m for pyramidal cells aligned with the field). So the physically honest perturbation is **field magnitude**, not "current into a unit".

**The dashboard owns the physics.** For each electrode the dashboard knows position, current, modality, frequency. It computes the per-region E-field magnitude over time:

- **tDCS:** point source, `|E(r)| = k · I / r²`, constant in time.
- **tACS:** same falloff, `|E(r, t)| = k · I / r² · sin(2π f t)`.
- **TI:** two AC sources at `f1`, `f2`. The amplitude-modulated envelope at `|f1 − f2|` only emerges where both fields overlap. Compute as `|E(r, t)| = |A1·sin(2π f1 t) + A2·sin(2π f2 t)|` per region.

The dashboard ships the resulting **`field_per_region`** trace (V/m, shape T × 68) to the backend. The backend converts to membrane perturbation with a fixed coupling constant `α ≈ 0.1 mV / (V/m)` and adds it as an input current term in the CTRNN dynamics:

```
τ · dx_i/dt = -x_i + Σ_j W_ij · r(x_j) + W_in · u(t) + α · field_i(t) + b_i
```

Stim enters at the **input** of each unit — never modulates the weights. The membrane time constant τ naturally low-passes oscillating fields, which is also the right physics.

### Static asset (dashboard reads at app load)

`bundles/aparc_centroids.json` — shared across all tasks, regions don't change:
```json
{
  "n_regions": 68,
  "labels": ["L_bankssts", "L_caudalanteriorcingulate", ..., "R_insula"],
  "positions": [[-50.2, -33.1, 5.6], ...]
}
```

`bundles/<task>.json` — one per pretrained CTRNN. Dashboard reads metadata only; never opens the `.pt`:
```json
{
  "task": "working_memory",
  "n_units": 68,
  "input_dim": 3,
  "output_dim": 2,
  "dt_ms": 20,
  "trial_duration_ms": 4000,
  "coupling_alpha_mV_per_Vm": 0.1,
  "weights_path": "bundles/working_memory.pt"
}
```

### API (FastAPI on `localhost:8000`)

```
GET  /tasks
  → ["perceptual_decision", "working_memory", "reaction_time"]

GET  /bundle/<task>
  → contents of bundles/<task>.json

POST /infer
  body:
  {
    "task": "working_memory",
    "field_per_region": [[f0_t0, ..., f67_t0], ..., [f0_tT, ..., f67_tT]],
    "input_stimulus": [[...], ...]   // optional, T x input_dim; defaults to a canned trial
  }
  →
  {
    "activations": [[a0_t0, ..., a67_t0], ...],   // T x 68, post-activation rates
    "task_output": [[...], ...],                   // T x output_dim, the model's behavioural readout
    "dt_ms": 20
  }
```

Units of `field_per_region` are V/m. Backend multiplies by `coupling_alpha_mV_per_Vm` internally.

### Tasks dropdown

| Task slot       | neurogym env                  |
| --------------- | ----------------------------- |
| Attention       | `PerceptualDecisionMaking-v0` |
| Working memory  | `DelayedMatchSample-v0`       |
| Reaction time   | `ReadySetGo-v0`               |

Backend loads all three `.pt` files at startup and switches on `task` field.

---

## LLM side panel — electrode-placement MCP

The LLM doesn't just *return* a protocol JSON. It *iteratively builds* one by calling tools while it researches papers. We expose those as an **MCP server** (`llm/mcp_server.py`) the LLM agent talks to:

```
search_papers(query)            → list of {title, abstract, doi}
get_region_coords(region)       → {pos: [x,y,z], label: "dlPFC"}
place_electrode(region | pos, current_mA, modality, freq_Hz, freq2_Hz?)
clear_electrodes()
run_simulation()                → summary stats from /infer
get_current_protocol()          → current electrode list
```

When the LLM calls `place_electrode`, the MCP server pushes the update to the dashboard via WebSocket (or simple polling — pick whatever ships fastest). Demo flow: user types "treatment-resistant depression" → LLM searches papers → places electrodes on dlPFC → runs sim → adjusts placement → returns final rationale.

For 3hr scope the MCP can be bare-bones (a single `tools/list` + `tools/call` endpoint). Use the official MCP Python SDK or roll a thin HTTP shim — the LLM agent doesn't care which.

---

## Connectome / parcellation

ENIGMA Toolbox structural connectivity, **`aparc`** (68 cortical regions). Used for the CTRNN's recurrent weight mask only — the spatial viz uses centroids, the dynamics use the connectivity.

```python
from enigmatoolbox.datasets import load_sc
sc, labels, _, _ = load_sc(parcellation='aparc')
# binarize sc -> recurrent mask, multiplied with W in forward pass
```

Centroid coordinates: hardcode the 68 MNI centroids into `bundles/aparc_centroids.json` (publicly known). Don't fetch at runtime.

---

## Setup

We use [pixi](https://pixi.sh) (already configured in `pixi.toml`). On macOS:

```bash
curl -fsSL https://pixi.sh/install.sh | bash
pixi install
pixi shell
```

Smoke-test:
```bash
pixi run smoke
```

### Setup gotchas

- **`gym==0.21.0` pin is fragile.** neurogym needs old gym (not gymnasium). If pixi can't resolve the wheel on a fresh Python, try `pip install gym==0.21.0 --no-deps` inside `pixi shell`, then re-run.
- **`nn4n` is intentionally not in deps.** It's not on PyPI and the integration cost isn't worth it for 3hrs. Roll a clean torch CTRNN with a connectome mask in ~50 lines. If you really want it: `pip install git+https://github.com/zhaoyuelu/nn4n.git`.
- **ENIGMA toolbox** may require a one-time data fetch on first `load_sc` call — see https://enigma-toolbox.readthedocs.io.

---

## Workflows

### CTRNN crew

1. Build a CTRNN with N=68 units, recurrent weight mask from ENIGMA aparc structural connectivity. Dale's law optional.
2. Train on each of the three neurogym tasks. Target: > 70% accuracy.
3. Export `bundles/<task>.json` + `bundles/<task>.pt` per task.
4. Run `infer_server.py` — FastAPI on `localhost:8000` exposing `/tasks`, `/bundle/<task>`, `/infer`. Loads all three `.pt` files at startup.
5. Stim enters the dynamics as `α · field_i(t)` added to the input of unit `i`. Do NOT modify the recurrent matrix.

### LLM loop

1. Start `llm/mcp_server.py` exposing the tools listed above.
2. `llm/protocol_agent.py` is the agent loop: takes a patient ailment, runs an Anthropic or OpenAI chat with tool use against the MCP, terminates when the LLM emits a final protocol.
3. Put `ANTHROPIC_API_KEY` and/or `OPENAI_API_KEY` in `.env`.

### Dashboard

Separate `dashboard/` Vite app (not yet scaffolded). At load: fetches `/tasks` and `aparc_centroids.json`, renders 68 region nodes on a brain GLB. On interaction:

1. User clicks brain → raycast hits surface → places electrode (surface + normal locked, ~1 mm offset).
2. User picks modality, current, freq.
3. `physics.ts` computes T × 68 `field_per_region` from electrode list.
4. POST `/infer` → receives T × 68 activations → animates region nodes (color = activation).
5. WebSocket subscription to MCP server: when LLM places electrodes, dashboard mirrors them.

---

## Repo layout (target)

```
.
├── README.md
├── pixi.toml
├── docs/                       # research papers (already present)
├── data/                       # gitignored heavy assets
├── ctrnn/
│   ├── model.py                # CTRNN with connectome mask, field-as-input
│   ├── train.py
│   ├── infer_server.py         # FastAPI: /tasks, /bundle/<task>, /infer
│   └── bundles/
│       ├── aparc_centroids.json
│       ├── perceptual_decision.{json,pt}
│       ├── working_memory.{json,pt}
│       └── reaction_time.{json,pt}
├── llm/
│   ├── mcp_server.py           # exposes place_electrode etc
│   └── protocol_agent.py
└── dashboard/
    ├── package.json
    └── src/
        ├── api.ts              # /infer, /tasks, /bundle wrappers
        ├── physics.ts          # electrodes -> T x 68 field_per_region (V/m)
        ├── brain/              # r3f scene, electrode placement
        └── llm/                # WebSocket sub to MCP electrode updates
```

---

## Hack rule

Strict no-prior-work policy: every line written in the hack window. No copying from previous repos.
