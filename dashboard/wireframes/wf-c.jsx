// Wireframe C — LLM-first / "agent-led" layout
// Big chat-style protocol agent on left as the primary surface,
// brain visualization is the proof / preview, controls minimal & contextual.

const WireframeC = () => {
  const electrodes = [
    { x: -0.4, y: -0.5, label: 'F3' },
    { x: 0.4, y: -0.5, label: 'F4' },
  ];
  const stim = { x: 0, y: -0.45, r: 0.5 };

  return (
    <div className="wf" style={{ display: 'grid', gridTemplateColumns: '420px 1fr', height: '100%' }}>
      {/* LEFT — agent thread */}
      <div style={{ borderRight: '1.5px solid var(--ink)', background: 'var(--paper-2)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Label size="lg" style={{ fontFamily: 'var(--hand-bold)' }}>CTRNN-Viewer</Label>
          <Mono>· agent mode</Mono>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* user msg */}
          <div style={{ alignSelf: 'flex-end', maxWidth: '85%' }}>
            <Box className="thin" style={{ padding: 8, background: 'var(--ink)', color: 'var(--paper)', borderRadius: '12px 12px 2px 12px' }}>
              <Mono style={{ color: 'var(--paper)' }}>
                42M, treatment-resistant depression. SSRIs failed.<br/>
                Looking at non-invasive options before considering ECT.
              </Mono>
            </Box>
            <Mono style={{ display: 'block', textAlign: 'right', marginTop: 2 }}>you · 2m ago</Mono>
          </div>

          {/* agent msg */}
          <div style={{ maxWidth: '95%' }}>
            <Box className="thin" style={{ padding: 10, background: 'var(--paper)', borderRadius: '12px 12px 12px 2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                <Label size="sm">protocol agent</Label>
                <Mono style={{ marginLeft: 'auto' }}>read 18 papers</Mono>
              </div>
              <Mono style={{ display: 'block', lineHeight: 1.5, color: 'var(--ink)' }}>
                strongest evidence for tDCS in TRD targets <b>left DLPFC</b>{' '}
                (anode F3, cathode F4 or right supraorbital). meta-analysis Brunoni '16
                shows d ≈ 0.30 vs sham. recent Nature paper Woodham '24 reports
                home-based tDCS comparable to clinic.
              </Mono>
            </Box>
            <Mono style={{ display: 'block', marginTop: 2 }}>· cited 3 RCTs · 2 meta-analyses</Mono>
          </div>

          {/* protocol card */}
          <Box className="thick" style={{ padding: 12, background: 'var(--paper)', borderColor: 'var(--accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Chip variant="accent">recommended</Chip>
              <Label size="md">left anodal DLPFC tDCS</Label>
            </div>
            <Divider dashed style={{ margin: '4px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', rowGap: 3, columnGap: 8 }}>
              <Mono>mode</Mono><Mono style={{ color: 'var(--ink)' }}>tDCS (anodal)</Mono>
              <Mono>anode</Mono><Mono style={{ color: 'var(--ink)' }}>F3 (left DLPFC)</Mono>
              <Mono>cathode</Mono><Mono style={{ color: 'var(--ink)' }}>F4 / right supra-orb.</Mono>
              <Mono>current</Mono><Mono style={{ color: 'var(--ink)' }}>2.0 mA</Mono>
              <Mono>duration</Mono><Mono style={{ color: 'var(--ink)' }}>30 min</Mono>
              <Mono>schedule</Mono><Mono style={{ color: 'var(--ink)' }}>5×/wk for 6 wks</Mono>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <Btn size="sm" variant="accent">↗ apply to brain</Btn>
              <Btn size="sm">edit montage</Btn>
              <Btn size="sm">papers (5)</Btn>
            </div>
          </Box>

          {/* alt protocols collapsed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Mono>2 alternatives ▾</Mono>
            <Box className="thin" style={{ padding: '6px 10px', background: 'var(--paper)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Label size="sm">bilateral DLPFC tACS · θ</Label>
              <Mono style={{ marginLeft: 'auto' }}>0.62</Mono>
            </Box>
            <Box className="thin" style={{ padding: '6px 10px', background: 'var(--paper)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Label size="sm">deep TI · subgenual ACC</Label>
              <Chip>exp</Chip>
              <Mono style={{ marginLeft: 'auto' }}>0.39</Mono>
            </Box>
          </div>
        </div>

        {/* composer */}
        <div style={{ padding: 12, borderTop: '1.5px solid var(--ink)', background: 'var(--paper)' }}>
          <Box className="thin" style={{ padding: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Mono style={{ color: 'var(--ink-faint)', flex: 1 }}>refine: "what about tACS at gamma instead?"</Mono>
            <Btn size="sm" variant="primary">↗</Btn>
          </Box>
          <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
            <Chip>+ patient context</Chip>
            <Chip>+ baseline scan</Chip>
            <Chip>+ contraindications</Chip>
          </div>
        </div>
      </div>

      {/* RIGHT — viewer */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* mini top bar */}
        <div style={{ height: 44, borderBottom: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 12 }}>
          <Mono>RNN</Mono>
          <Label size="sm">depression-net · 256u</Label>
          <Chip>simulated</Chip>
          <div style={{ flex: 1 }} />
          <Chip variant="active">tDCS</Chip>
          <Chip>tACS</Chip>
          <Chip>TI</Chip>
          <span style={{ width: 1, height: 20, background: 'var(--ink)', opacity: 0.2 }} />
          <Btn size="sm">⛶</Btn>
          <Btn size="sm" variant="primary">▶ run</Btn>
        </div>

        {/* viewport */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BrainBlob size={500} electrodes={electrodes} stim={stim} units={220} />

          {/* preview banner */}
          <div style={{ position: 'absolute', top: 14, left: 14 }}>
            <Box className="thick" style={{ padding: '6px 12px', background: 'var(--accent)', color: 'var(--paper)', borderColor: 'var(--ink)' }}>
              <Label size="sm">previewing: agent's recommended protocol</Label>
            </Box>
            <Mono style={{ display: 'block', marginTop: 4 }}>↳ 2 electrodes auto-placed · stim volume rendered</Mono>
          </div>

          {/* annotations */}
          <div style={{ position: 'absolute', top: 110, right: 30, color: 'var(--accent)', fontFamily: 'var(--hand)', fontSize: 14, maxWidth: 150 }}>
            ↙ stim volume<br/>(point-source · current density falloff)
          </div>
          <div style={{ position: 'absolute', bottom: 90, left: 40, color: 'var(--accent-2)', fontFamily: 'var(--hand)', fontSize: 14, maxWidth: 150 }}>
            ↗ electrode F3 · auto-placed by agent
          </div>
        </div>

        {/* bottom strip */}
        <div style={{ borderTop: '1.5px dashed var(--ink)', padding: '10px 14px', display: 'flex', gap: 18, alignItems: 'center' }}>
          <div><Mono>units stim'd</Mono><div><Label size="md">63<span style={{ color: 'var(--ink-faint)' }}>/256</span></Label></div></div>
          <div style={{ width: 1, height: 30, background: 'var(--ink)', opacity: 0.2 }} />
          <div><Mono>peak |E|</Mono><div><Label size="md">0.58</Label></div></div>
          <div style={{ width: 1, height: 30, background: 'var(--ink)', opacity: 0.2 }} />
          <div><Mono>predicted Δ</Mono><div><Label size="md" style={{ color: 'var(--accent)' }}>HAM-D −4.1</Label></div></div>
          <div style={{ flex: 1 }} />
          <Btn size="sm">⟳ reset</Btn>
          <Btn size="sm">save montage</Btn>
        </div>
      </div>
    </div>
  );
};

window.WireframeC = WireframeC;
