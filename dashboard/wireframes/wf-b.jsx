// Wireframe B — Viewport-dominant: full-bleed brain, floating glass panels
// The brain is the page. Panels float over it.

const WireframeB = () => {
  const electrodes = [
    { x: -0.45, y: -0.55, label: 'F3' },
    { x: 0.45, y: -0.55, label: 'F4' },
    { x: -0.15, y: -0.2, label: 'C1' },
    { x: 0.15, y: -0.2, label: 'C2' },
  ];
  const stim = { x: 0, y: -0.35, r: 0.55 };

  const Panel = ({ children, style = {} }) => (
    <div style={{
      position: 'absolute',
      background: 'rgba(250,250,246,0.92)',
      border: '1.5px solid var(--ink)',
      borderRadius: 8,
      boxShadow: '2px 3px 0 rgba(0,0,0,0.12)',
      padding: 12,
      backdropFilter: 'blur(4px)',
      ...style,
    }}>{children}</div>
  );

  return (
    <div className="wf" style={{ position: 'relative' }}>
      {/* full-bleed brain */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BrainBlob size={680} electrodes={electrodes} stim={stim} units={260} />
      </div>

      {/* corner brand */}
      <div style={{ position: 'absolute', top: 16, left: 18, display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <Label size="lg" style={{ fontFamily: 'var(--hand-bold)' }}>CTRNN-Viewer</Label>
        <Mono>· spatial stim sandbox</Mono>
      </div>

      {/* top-right RNN selector */}
      <Panel style={{ top: 14, right: 14, padding: '6px 10px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <Mono>RNN</Mono>
        <Label size="sm">working-memory · 320u</Label>
        <Chip variant="active">▾</Chip>
        <span style={{ width: 1, height: 18, background: 'var(--ink)', opacity: 0.3 }} />
        <Chip>delayed-match</Chip>
        <Mono>acc 0.79</Mono>
      </Panel>

      {/* TOP-LEFT mode selector — radial-ish */}
      <Panel style={{ top: 70, left: 18, width: 170 }}>
        <Mono>stim mode</Mono>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
          {[
            { k: 'tDCS', sub: 'DC focal', on: false },
            { k: 'tACS', sub: '8 Hz', on: true },
            { k: 'TI', sub: 'Δf=20Hz', on: false },
          ].map(m => (
            <Box key={m.k} className="thin" style={{ padding: '4px 8px', background: m.on ? 'var(--ink)' : 'transparent', color: m.on ? 'var(--paper)' : 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.on ? 'var(--accent)' : 'var(--ink-faint)' }} />
              <Label size="sm">{m.k}</Label>
              <Mono style={{ marginLeft: 'auto', color: m.on ? 'var(--paper-2)' : 'var(--ink-soft)' }}>{m.sub}</Mono>
            </Box>
          ))}
        </div>
        <Divider dashed />
        <Slider value={0.55} label="intensity 1.5 mA" />
        <Slider value={0.2} label="freq 8 Hz" style={{ marginTop: 4 }} />
      </Panel>

      {/* electrode list — bottom-left */}
      <Panel style={{ bottom: 18, left: 18, width: 200 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <Mono>electrodes</Mono>
          <Mono style={{ marginLeft: 'auto', color: 'var(--accent)' }}>4 · click to add</Mono>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 6 }}>
          {electrodes.map(e => (
            <div key={e.label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 4px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-2)' }} />
              <Label size="sm">{e.label}</Label>
              <Mono style={{ marginLeft: 'auto' }}>±1.0 mA</Mono>
            </div>
          ))}
        </div>
      </Panel>

      {/* metric strip — bottom center */}
      <Panel style={{ bottom: 18, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 18, padding: '8px 16px' }}>
        <div><Mono>units stimmed</Mono><div><Label size="md">82<span style={{ color: 'var(--ink-faint)' }}>/320</span></Label></div></div>
        <div style={{ width: 1, background: 'var(--ink)', opacity: 0.2 }} />
        <div><Mono>peak |E|</Mono><div><Label size="md">0.74 <span style={{ color: 'var(--ink-faint)', fontSize: 12 }}>V/m</span></Label></div></div>
        <div style={{ width: 1, background: 'var(--ink)', opacity: 0.2 }} />
        <div><Mono>focality</Mono><div><Label size="md">0.41</Label></div></div>
        <div style={{ width: 1, background: 'var(--ink)', opacity: 0.2 }} />
        <div><Mono>task Δacc</Mono><div><Label size="md" style={{ color: 'var(--accent)' }}>+0.07 ↑</Label></div></div>
      </Panel>

      {/* RIGHT — protocol agent (collapsible-feel) */}
      <Panel style={{ top: 70, right: 14, width: 320, bottom: 90, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
          <Label size="md">protocol agent</Label>
          <Mono style={{ marginLeft: 'auto' }}>online</Mono>
        </div>

        <Box className="thin" style={{ padding: 8, background: 'var(--paper)' }}>
          <Mono style={{ display: 'block' }}>describe patient ↓</Mono>
          <Mono style={{ display: 'block', marginTop: 4, color: 'var(--ink)' }}>"58M, ADHD, working memory deficits, baseline n-back d' = 1.2"</Mono>
        </Box>

        <Btn size="sm" variant="accent" style={{ alignSelf: 'flex-end' }}>⚡ research + suggest</Btn>

        <Divider dashed />

        <Mono>last result · 4.2s · 11 papers</Mono>

        <Box className="thin" style={{ padding: 10, background: 'var(--paper)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Label size="md">θ-tACS DLPFC</Label>
            <Chip variant="accent" style={{ marginLeft: 'auto' }}>tACS</Chip>
          </div>
          <Mono>F3 anode · F4 cathode · 6Hz</Mono>
          <Mono>1.5 mA · 20 min · ×10 sessions</Mono>
          <Mono style={{ color: 'var(--ink-soft)' }}>"theta-band entrainment of fronto-parietal WM network (Reinhart '19, Vosskuhl '15)"</Mono>
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            <Btn size="sm" variant="primary">apply to brain →</Btn>
            <Btn size="sm">3 papers</Btn>
          </div>
        </Box>

        <Box className="thin" style={{ padding: 8, background: 'var(--paper-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Label size="sm">anodal tDCS DLPFC</Label>
            <Chip style={{ marginLeft: 'auto' }}>tDCS · 0.62</Chip>
          </div>
          <Mono>F3 / F4 · 2 mA · 20 min</Mono>
        </Box>

        <Box className="thin" style={{ padding: 8, background: 'var(--paper-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Label size="sm">TI focal hippocampus</Label>
            <Chip style={{ marginLeft: 'auto' }}>TI · 0.41</Chip>
          </div>
          <Mono>2 pairs · Δf 8Hz · exp.</Mono>
        </Box>
      </Panel>

      {/* annotation pointing to brain */}
      <div style={{ position: 'absolute', top: 280, left: 220, color: 'var(--accent)', fontFamily: 'var(--hand)', fontSize: 13, maxWidth: 130 }}>
        ↘ click anywhere on cortex<br/>to drop electrode (snaps to surface + normal)
      </div>
    </div>
  );
};

window.WireframeB = WireframeB;
