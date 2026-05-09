# Demo screenshot guide

For the deck, the post, the README cover. Roughly ordered "first thing
people see" → "and here's the depth."

1. **Hero shot.** Three-quarter view of the 3D brain with all 68 region
   nodes lit at low intensity, two electrodes visible on the scalp
   (anode + cathode), faint field falloff rendered on the cortical
   surface. Both hemispheres visible. This is the "what is this thing"
   image.

2. **LLM in motion.** Side panel showing the patient-ailment input
   (e.g. "treatment-resistant depression, 47y, prior failed SSRI") and
   the returned protocol JSON: modality, electrode positions, currents,
   the rationale paragraph, and the cited papers. Pair it with the
   dashboard mid-update, electrodes already placed where Claude
   recommended.

3. **Field physics overlay.** Mid-tACS animation, V/m field shown as a
   translucent gradient on the cortical surface. Looks like a real
   neuro figure and signals "they did the physics."

4. **Activation playback strip.** Three frames from a working-memory
   trial under stim, units cycling colour as the network encodes,
   maintains, and decodes. Lay out as a film strip with timestamps.

5. **No-stim vs stim side-by-side.** Same trial, two activation strips
   stacked, with a one-line caption (e.g. *tDCS @ dlPFC, 2 mA, anode
   left*). This is the "and it actually changes the brain's behaviour"
   moment.

6. **Network topology.** Brain with the top-K strongest recurrent
   connections rendered as glowing edges between region nodes. Bonus
   if you can colour edges by weight sign.

7. **Task switcher.** Dropdown open showing the three tasks
   (`perceptual_decision`, `working_memory`, `reaction_time`).
   Reinforces that this is a cognitive testbed, not a static toy.

8. **Architecture diagram.** Clean redraw of the box-arrow flow from
   the README. Five-second readability.

9. **The bundle contract.** A `model_bundle.json` snippet next to the
   matching FastAPI route. For technical audiences — shows there's a
   real engineering interface, not duct tape.

10. **The dynamics equation in code.** The line in `ctrnn/model.py`
    where `α · field_i(t)` enters the integration step, with the
    comment about why stim is a drive and not a weight perturbation.

## Recommended ordering for a deck or post

- **Open** with (1) hero and (2) LLM-in-motion side by side. Both
  halves of the system in one glance.
- **Middle** with (3) field overlay, (4) activation strip, (6) network
  topology — depth and "it's working" evidence.
- **Close** with (5) no-stim vs stim — the moment of truth.
- **Appendix slide** for technical audiences: (8) architecture, (9)
  bundle contract, (10) dynamics code.

## One-shot picks

- For a tweet or LinkedIn post: **#2 LLM-in-motion**, with the
  dashboard updating in the same frame. Highest information per pixel,
  no caption required to convey "this is something new."
- For the deck cover: **#1 hero**. Save the punch for inside.
- For a one-image README banner: **#5 no-stim vs stim**, captioned.
