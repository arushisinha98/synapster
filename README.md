# synapster

London hackathon project. 4 people, 3 hours.

A dashboard for designing brain stimulation protocols (tDCS / tACS / TI) on a 3D brain, with a spatially embedded CTRNN inside, and an LLM side panel that proposes protocols from a patient ailment description.

Research foundation in [`docs/`](docs): seRNN ([`spatial-neuro-rnn.md`](docs/spatial-neuro-rnn.md)), multi-task cognitive networks ([`cognitive-tasks.md`](docs/cognitive-tasks.md)), digital twin brain from connectomes ([`digital-twin-brain.md`](docs/digital-twin-brain.md)), multiregion neocortex theory ([`multiregion-neurocortex.md`](docs/multiregion-neurocortex.md)), RL-driven closed-loop stim ([`rl-stimulation.md`](docs/rl-stimulation.md)), and virtual brain twins for epilepsy with TI ([`virtual-brain-epilepsy.md`](docs/virtual-brain-epilepsy.md)).

## Team split

- **CTRNN crew (2):** spatially embedded CTRNNs on neurogym tasks; export model bundles for the dashboard.
- **Dashboard (1, Martin):** Vite + React + react-three-fiber. 3D brain, electrode placement, stim volume viz, RNN unit activity playback.
- **LLM loop (1):** side-panel agent that takes a patient ailment, reads papers, returns a structured stim protocol JSON.

## Integration contract

Everyone exports/consumes these. Lock this before writing anything else.

**`model_bundle.json`** — produced once per trained CTRNN.
```json
{
  "task": "perceptual_decision",
  "n_units": 144,
  "unit_positions": [[x, y, z], ...],
  "region_labels": ["dlPFC", "Visual", ...],
  "weights_path": "model_weights.pt"
}
```

**`activations.json`** — produced per inference run.
```json
{
  "timesteps": [[u0_t0, u1_t0, ...], [u0_t1, ...], ...],
  "dt_ms": 20
}
```

**LLM protocol output** — produced by the side panel.
```json
{
  "modality": "tDCS" | "tACS" | "TI",
  "electrodes": [{"pos": [x,y,z], "current_mA": 2.0, "freq_Hz": 10}],
  "rationale": "string",
  "papers": ["doi or url", ...]
}
```

Coordinates are MNI mm in all three.

## Tasks (pretrained dropdown)

| Task slot       | neurogym env                  |
| --------------- | ----------------------------- |
| Attention       | `PerceptualDecisionMaking-v0` |
| Working memory  | `DelayedMatchSample-v0`       |
| Reaction time   | `ReadySetGo-v0`               |

## Connectome / parcellation

ENIGMA Toolbox structural connectivity, **`aparc`** (Desikan-Killiany, 68 cortical regions). Simple, fast, exactly what's needed for a 3hr demo.

```python
from enigmatoolbox.datasets import load_sc
sc, labels, _, _ = load_sc(parcellation='aparc')
```

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

## CTRNN crew workflow

1. Build a CTRNN whose recurrent weight mask comes from the connectome (Dale's law optional, ~10 units per region).
2. Train on each of the three neurogym tasks above. Target: > 70% accuracy. Don't perfect — demo-quality is fine.
3. Export `model_bundle.json` + weights `.pt` per task into `ctrnn/bundles/`.
4. Provide `python ctrnn/infer.py --task perceptual_decision --stim_pattern stim.json` that produces `activations.json`.

`stim.json` shape (what the dashboard sends in):
```json
{ "stim_per_unit": [0.0, 0.3, 0.0, ...] }
```

The CTRNN injects this as an extra current term into the dynamics.

## LLM loop workflow

Side panel = textarea + button. On submit:

1. Send patient ailment to Claude (Anthropic API) or OpenAI with a system prompt: "you are a neuromodulation expert; output JSON matching the protocol schema above; cite papers".
2. Optionally use Anthropic's web search tool, or hit arXiv / Semantic Scholar API directly to ground citations.
3. Return the JSON to the dashboard, which auto-places the electrodes.

Put `ANTHROPIC_API_KEY` and/or `OPENAI_API_KEY` in `.env`.

## Dashboard workflow

Separate `dashboard/` Vite app (not yet scaffolded). Loads model bundles + brain GLB, places electrodes via raycasting (surface + normal locked, ~1mm offset), computes per-unit stim from electrode field falloff, sends to inference endpoint, plays back activations.

## Repo layout (target)

```
.
├── README.md
├── pixi.toml
├── docs/                   # research papers (already present)
├── data/                   # gitignored heavy assets
├── ctrnn/                  # CTRNN crew code
│   ├── model.py
│   ├── train.py
│   ├── infer.py
│   └── bundles/            # model_bundle.json + weights per task
├── llm/                    # LLM side panel backend
│   └── protocol_agent.py
└── dashboard/              # Vite + react-three-fiber
    ├── package.json
    └── src/
```

## Hack rule

Strict no-prior-work policy: every line written in the hack window. No copying from previous repos.
