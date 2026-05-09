# Synapster — what we built

A live tool for designing personalized brain stimulation protocols.
Type a patient ailment, and an LLM agent reads papers, places electrodes
on a 3D brain, runs a simulation, and refines until it converges on a
protocol. The "brain" is a CTRNN wired by a real human connectome and
pre-trained on three cognitive tasks. The "stimulation" is real V/m
field physics coupled into the model dynamics. The LLM acts through
tools, not freeform text.

## The story

Three things that don't usually live in the same room:

### 1. Computational neuroscience that's actually neuroscience

A 68-region continuous-time recurrent neural network. One unit per
cortical region in the Desikan–Killiany parcellation. Recurrent
connectivity is masked by the ENIGMA Toolbox structural connectome —
signal can only flow where real human white-matter tracts exist.
Trained on three neurogym cognitive tasks (perceptual decision,
working memory, reaction time) and task-switchable from the dashboard.

This isn't a generic RNN with a "brain" sticker. It's a CTRNN whose
graph is the HCP-derived structural matrix, whose unit positions are
fsaverage5 vertex centroids in MNI mm, and whose dynamics follow the
seRNN / multi-region neocortex literature.

### 2. Stimulation physics, no fudge

Real scalp electrodes inject current; what reaches cortex is a vector
electric field (V/m). The dashboard computes |E(r,t)| per region using
the actual modality physics:

- **tDCS** — constant point-source falloff: `|E| = k · I / r²`
- **tACS** — oscillatory: `|E(t)| = k · I / r² · sin(2πft)`
- **TI** — amplitude-modulated envelope `|A₁sin(2πf₁t) + A₂sin(2πf₂t)|`,
  emerging only where the two carrier fields overlap

The field is converted to a membrane perturbation via
`α ≈ 0.1 mV/(V/m)` (the empirical pyramidal-cell coupling) and added
at each unit's input — never to the weights. Stim is a *drive*, not a
*retraining*. The membrane time constant naturally low-passes
oscillating fields, which is also the right physics.

### 3. A tool-using LLM agent that operates the simulator

The side panel takes a patient ailment in plain English. The LLM does
not just emit a JSON blob and stop. It iteratively builds a protocol
by calling MCP tools:

```
search_papers(query)            → titles, abstracts, dois
get_region_coords(region)       → MNI mm
place_electrode(...)            → updates the dashboard live
run_simulation()                → activations from /infer
get_current_protocol()          → state inspection
```

The dashboard mirrors every tool call as it happens. The agent runs
the simulator it's writing for, sees the activations, and revises.
That's the actual scientific loop, not a one-shot.

## What's innovative

- **Closed-loop AI for medicine.** Most "AI for healthcare" demos are
  one-shot prompt → answer. Synapster is iterative: the agent perceives
  the simulation it just commissioned and adjusts.

- **Stim as input, not as retraining.** The CTRNN is fixed; protocols
  modulate dynamics through the same input pathway as task drive.
  Means arbitrary protocols can be tested in milliseconds against a
  *single* trained brain, and closed-loop optimization becomes
  tractable.

- **Anatomically and physically grounded.** No invented coordinates,
  no waved-away coupling constant, no abstract "stim parameter" knob.
  V/m, mV, MNI mm, region labels from FreeSurfer, connectivity from
  HCP. Every number traces back to a published source.

- **Honest about its limits.** The membrane time constant low-passes
  high-frequency stim — so we tell you above ~25 Hz the model can't
  resolve the field. The TI carriers can't be sampled directly at
  20 ms — so we ship the analytic envelope. We don't hide the floor;
  we draw it.

## Real-world application

The shortest pitch: **AI-assisted protocol design for non-invasive
neuromodulation.**

Concretely:

- **Treatment-resistant depression.** Canonical tDCS-dlPFC indication.
  LLM walks through the literature, places anode/cathode, runs sim,
  shows you the cortical reach of the field and the network's
  response.
- **Pre-clinical screening.** Investigators design protocols on a
  digital twin before any human trial, exposing off-target activation
  or unexpected coupling.
- **Personalized stimulation.** Substitute a patient-specific
  connectome from diffusion MRI and the same loop becomes a
  per-patient protocol designer. The architecture doesn't change —
  only the structural matrix.
- **Education.** Neuro residents, BME students, and clinical
  researchers manipulate the same physics-grounded toy that a serious
  modeling pipeline would.

This is "AI agents do real things in the world": the LLM is not
generating prose *about* brain stimulation, it is *operating* a brain
stimulation simulator.

## Architecture

```
[ user types ailment ]
        ↓
[ LLM agent ] ←─ MCP tools ─→ [ 3D brain dashboard ]
        ↓                              ↓
   place_electrode             physics.ts: V/m, T × 68
   run_simulation                       ↓
        ↓                       POST /infer
[ FastAPI infer_server ] ─ coupling α → [ CTRNN, 68 units, connectome-masked ]
        ↓
[ activations T × 68, task_output T × output_dim ]
        ↓
[ dashboard plays back: nodes color-cycle, behaviour readout updates ]
```

## Status

| Component | State |
|---|---|
| CTRNN with connectome mask + stim-as-input | built |
| Pre-trained bundles for all three tasks | built (`ctrnn/bundles/*.{json,pt}`) |
| FastAPI inference server (`/tasks`, `/bundle/<task>`, `/infer`) | built |
| Per-region MNI centroids from ENIGMA fsaverage5 | built (`ctrnn/bundles/aparc_centroids.json`) |
| Stim physics: tDCS / tACS / TI envelopes | dashboard side |
| 3D brain rendering, electrode placement | dashboard side |
| LLM agent + MCP tools | `llm/protocol_agent.py` |
| HPC training pipeline (PBS, CUDA env) | built |
| Patient-specific connectome injection | future work |
| Multi-region cross-task coupling | future work |

## Hack window

3 hours. 4 people. Every line written in the room.

---

# Screenshots to take

In rough order of "first thing people see" to "and here's the depth":

1. **Hero shot.** Three-quarter view of the 3D brain, all 68 region
   nodes lit at low intensity, two electrodes visible on the scalp
   (anode + cathode), faint field falloff rendered on the cortical
   surface. This is the "what is this thing" image — make sure both
   hemispheres are visible.

2. **LLM in motion.** Side panel showing a patient ailment input
   ("treatment-resistant depression, 47y, prior failed SSRI") and the
   agent's tool calls scrolling: `search_papers(...)`,
   `place_electrode(dlPFC, 2.0 mA, anode)`, `run_simulation()`,
   `→ rationale`. Capture the exact frame where a tool call lands and
   the dashboard updates an electrode position. This is the agentic-AI
   money shot.

3. **Field physics overlay.** Same brain, mid-tACS animation, V/m
   field shown as a translucent gradient on the cortical surface. Looks
   like a real neuro figure and tells the audience "they did the
   physics."

4. **Activation playback strip.** Three frames from a working-memory
   trial under stim, units cycling colour as the network encodes,
   maintains, and decodes. Lay out as a film strip with timestamps.

5. **No-stim vs stim side-by-side.** Same trial, two activation strips
   stacked, with a one-line caption: *tDCS @ dlPFC, 2 mA, anode left*.
   Quantifies "the stimulation is doing something."

6. **Network topology.** Brain with the top-K strongest recurrent
   connections rendered as glowing edges between region nodes. The "wow
   it's a graph in 3D" image. Bonus if you can colour edges by weight
   sign.

7. **Task switcher.** Dropdown open showing the three tasks
   (`perceptual_decision`, `working_memory`, `reaction_time`).
   Reinforces "this is a cognitive testbed, not a toy."

8. **Architecture diagram.** Clean redraw of the box-arrow flow above.
   People skim and understand the loop in five seconds. This is the
   slide-deck image.

9. **The bundle contract.** A `model_bundle.json` snippet next to a
   diff of the API contract. Optional but powerful for technical
   audiences — shows there's a real engineering interface, not duct
   tape.

10. **The dynamics equation in code.** The line where
    `α · field_i(t)` enters the integration step, alongside the comment
    explaining why stim is a drive and not a weight perturbation.
    Demonstrates the science.

## Recommended ordering for a deck or post

- **Open** with (1) hero and (2) LLM-in-motion side by side. People
  see both halves of the system in one glance.
- **Middle** with (3) field overlay, (4) activation strip, (6) network
  topology — depth and "it's working" evidence.
- **Close** with (5) no-stim vs stim — the moment of truth.
- **Appendix slide** for technical audiences: (8) architecture, (9)
  bundle contract, (10) dynamics code.
