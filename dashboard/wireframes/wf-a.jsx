// Wireframe A — Classic 3-pane DAW layout
// Top bar | Left tools | Center 3D | Right LLM

const WireframeA = () => {
  const electrodes = [
    { x: -0.4, y: -0.5, label: 'F3' },
    { x: 0.4, y: -0.5, label: 'F4' },
    { x: 0.0, y: 0.6, label: 'Oz' },
  ];
  const stim = { x: -0.2, y: -0.3, r: 0.45 };

  return (
    <div className="wf" style={{ display: 'grid', gridTemplateRows: '52px 1fr', gridTemplateColumns: '240px 1fr 360px' }}>
      {/* TOP BAR — spans all cols */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1.5px solid var(--ink)', gap: 16, background: 'var(--paper)' }}>
        <Label size="lg" style={{ fontFamily: 'var(--hand-bold)' }}>CTRNN-Viewer</Label>
        <Mono>v0.1 · london hack</Mono>
        <div style={{ flex: 1 }} />
        <Box className="thin" style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Mono>RNN ▾</Mono>
          <Label size="sm">attention-200u</Label>
        </Box>
        <Chip variant="active">task: flanker</Chip>
        <Chip>acc 0.82 ↑</Chip>
        <Btn size="sm">share</Btn>
        <Btn size="sm" variant="primary">▶ run</Btn>
      </div>

      {/* LEFT RAIL */}
      <div style={{ borderRight: '1.5px solid var(--ink)', padding: 14, display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--paper-2)' }}>
        <div>
          <Label size="md">stim mode</Label>
          <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
            <Box className="thin" style={{ padding: '4px 8px', background: 'var(--ink)', color: 'var(--paper)' }}><Label size="sm">tDCS</Label></Box>
            <Box className="thin" style={{ padding: '4px 8px' }}><Label size="sm">tACS</Label></Box>
            <Box className="thin" style={{ padding: '4px 8px' }}><Label size="sm">TI</Label></Box>
          </div>
        </div>

        <div>
          <Slider value={0.6} label="intensity (mA)  1.8" />
          <Slider value={0.0} label="freq (Hz)  —  [DC]" style={{ opacity: 0.4, marginTop: 6 }} />
          <Slider value={0.3} label="duration (min)  20" style={{ marginTop: 6 }} />
        </div>

        <Divider dashed />

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Label size="md">electrodes</Label>
            <Mono>3 placed</Mono>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
            {[
              { id: 'F3', t: 'anode', c: '+1.0mA' },
              { id: 'F4', t: 'cathode', c: '-1.0mA' },
              { id: 'Oz', t: 'return', c: '0' },
            ].map(e => (
              <Box key={e.id} className="thin" style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-2)' }} />
                <Label size="sm">{e.id}</Label>
                <Mono style={{ marginLeft: 'auto' }}>{e.t} {e.c}</Mono>
              </Box>
            ))}
            <Box className="thin dashed" style={{ padding: '4px 8px', textAlign: 'center', color: 'var(--ink-faint)' }}>
              <Mono>+ click brain to add</Mono>
            </Box>
          </div>
        </div>

        <Divider dashed />

        <div>
          <Label size="md">layers</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 6 }}>
            <Mono>☑ brain mesh (40%)</Mono>
            <Mono>☑ RNN units (200)</Mono>
            <Mono>☐ RNN edges</Mono>
            <Mono>☑ stim volume</Mono>
            <Mono>☑ unit highlights</Mono>
          </div>
        </div>
      </div>

      {/* CENTER — 3D viewport */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}>
        {/* gizmo / view chips top-left */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
          <Chip variant="active">3D</Chip>
          <Chip>top</Chip>
          <Chip>side</Chip>
          <Chip>back</Chip>
        </div>
        {/* axis gizmo top-right */}
        <Box className="thin" style={{ position: 'absolute', top: 12, right: 12, padding: 6, width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mono>x/y/z</Mono>
        </Box>

        <BrainBlob size={460} electrodes={electrodes} stim={stim} units={180} />

        {/* annotations pointing to features */}
        <div style={{ position: 'absolute', top: 90, left: '50%', transform: 'translateX(-280px)', maxWidth: 140 }}>
          <Mono style={{ color: 'var(--accent)' }}>↘ stim volume<br/>(point-source falloff)</Mono>
        </div>
        <div style={{ position: 'absolute', top: 200, right: '50%', transform: 'translateX(310px)', maxWidth: 140 }}>
          <Mono style={{ color: 'var(--accent-2)' }}>← electrode<br/>(surface + normal lock)</Mono>
        </div>
        <div style={{ position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-260px)', maxWidth: 160 }}>
          <Mono style={{ color: 'var(--ink-soft)' }}>↗ RNN units, red = inside stim volume</Mono>
        </div>

        {/* bottom HUD */}
        <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Box className="thin" style={{ padding: '6px 10px', display: 'flex', gap: 12 }}>
            <Mono>units stimmed: 47/200</Mono>
            <Mono>peak |E|: 0.61 V/m</Mono>
            <Mono>focality: 0.34</Mono>
          </Box>
          <div style={{ flex: 1 }} />
          <Btn size="sm">⟳ reset cam</Btn>
          <Btn size="sm">⛶ snapshot</Btn>
        </div>
      </div>

      {/* RIGHT RAIL — LLM */}
      <div style={{ borderLeft: '1.5px solid var(--ink)', display: 'flex', flexDirection: 'column', background: 'var(--paper-2)' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1.5px dashed var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
          <Label size="md">protocol agent</Label>
          <Mono style={{ marginLeft: 'auto' }}>haiku · 14 papers</Mono>
        </div>

        {/* patient input */}
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Mono>patient ailment</Mono>
          <Box className="thin" style={{ padding: 8, minHeight: 60, background: 'var(--paper)' }}>
            <Mono style={{ color: 'var(--ink)' }}>"34F, post-stroke aphasia, broca's area, 4mo. Wants to improve naming fluency."</Mono>
          </Box>
          <div style={{ display: 'flex', gap: 6 }}>
            <Btn size="sm" variant="accent">↗ suggest protocol</Btn>
            <Btn size="sm">+ context</Btn>
          </div>
        </div>

        <Divider dashed style={{ margin: '0 14px' }} />

        {/* reasoning log */}
        <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Mono>reasoning ▾</Mono>
          <Box className="thin" style={{ padding: 8, background: 'var(--paper)' }}>
            <Mono style={{ color: 'var(--ink-soft)', display: 'block', lineHeight: 1.5 }}>
              · searching pubmed "tdcs broca aphasia"<br/>
              · 14 hits, 3 RCTs (Marangolo'13, Fiori'18...)<br/>
              · mode: anodal tDCS, target IFG<br/>
              · 1.5–2.0 mA, 20min, daily ×10<br/>
              · suggesting 3 montages...
            </Mono>
          </Box>
        </div>

        <Divider dashed style={{ margin: '0 14px' }} />

        {/* protocol cards */}
        <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
          <Mono>suggested protocols (3)</Mono>
          {[
            { name: 'A · classic anodal IFG', mode: 'tDCS', target: 'F5 anode / Fp2 cathode', dose: '2.0mA · 20min', conf: 0.86 },
            { name: 'B · HD-tDCS 4×1', mode: 'tDCS', target: 'center F5 + 4 returns', dose: '1.5mA · 20min', conf: 0.71 },
            { name: 'C · gamma tACS', mode: 'tACS', target: 'F5 / F6, 40Hz', dose: '1.5mA · 20min', conf: 0.58 },
          ].map((p, i) => (
            <Box key={i} className="thin" style={{ padding: 8, background: 'var(--paper)', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Label size="sm">{p.name}</Label>
                <Chip variant={i === 0 ? 'accent' : ''} style={{ marginLeft: 'auto' }}>{p.mode}</Chip>
              </div>
              <Mono>{p.target}</Mono>
              <Mono>{p.dose} · conf {p.conf}</Mono>
              <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                <Btn size="sm" variant={i === 0 ? 'primary' : ''}>apply →</Btn>
                <Btn size="sm">cite</Btn>
              </div>
            </Box>
          ))}
        </div>
      </div>
    </div>
  );
};

window.WireframeA = WireframeA;
