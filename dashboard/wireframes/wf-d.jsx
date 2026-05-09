// Wireframe D — Figma/CAD-style: top toolbar + right inspector + bottom timeline
// Tool-belt heavy. Made for power use.

const WireframeD = () => {
  const electrodes = [
    { x: -0.4, y: -0.55, label: 'F3' },
    { x: 0.4, y: -0.55, label: 'F4' },
    { x: -0.55, y: -0.1, label: 'T7' },
    { x: 0.55, y: -0.1, label: 'T8' },
  ];
  const stim = { x: 0, y: -0.4, r: 0.5 };

  return (
    <div className="wf" style={{ display: 'grid', gridTemplateRows: '46px 36px 1fr 88px', gridTemplateColumns: '1fr 300px' }}>
      {/* TITLE BAR */}
      <div style={{ gridColumn: '1 / -1', borderBottom: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 14, background: 'var(--paper-2)' }}>
        <Label size="lg" style={{ fontFamily: 'var(--hand-bold)' }}>CTRNN-Viewer</Label>
        <Mono>untitled-montage.json *</Mono>
        <div style={{ flex: 1 }} />
        <Mono>2 collaborators</Mono>
        <Btn size="sm">share</Btn>
        <Btn size="sm" variant="primary">▶ simulate</Btn>
      </div>

      {/* TOOLBAR */}
      <div style={{ gridColumn: '1 / -1', borderBottom: '1.5px dashed var(--ink)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 6, background: 'var(--paper)' }}>
        <Chip variant="active">↘ select</Chip>
        <Chip>● place electrode</Chip>
        <Chip>⌖ measure</Chip>
        <Chip>✎ annotate</Chip>
        <span style={{ width: 1, height: 20, background: 'var(--ink)', opacity: 0.2, margin: '0 6px' }} />
        <Mono>mode</Mono>
        <Box className="thin" style={{ display: 'flex', padding: 0, overflow: 'hidden' }}>
          <span style={{ padding: '2px 10px', background: 'var(--ink)', color: 'var(--paper)', fontFamily: 'var(--hand-bold)', fontSize: 13 }}>tDCS</span>
          <span style={{ padding: '2px 10px', borderLeft: '1.5px solid var(--ink)', fontFamily: 'var(--hand-bold)', fontSize: 13 }}>tACS</span>
          <span style={{ padding: '2px 10px', borderLeft: '1.5px solid var(--ink)', fontFamily: 'var(--hand-bold)', fontSize: 13 }}>TI</span>
        </Box>
        <span style={{ width: 1, height: 20, background: 'var(--ink)', opacity: 0.2, margin: '0 6px' }} />
        <Mono>RNN</Mono>
        <Box className="thin" style={{ padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Label size="sm">reaction-time-180u</Label>
          <Mono>▾</Mono>
        </Box>
        <span style={{ width: 1, height: 20, background: 'var(--ink)', opacity: 0.2, margin: '0 6px' }} />
        <Mono>view</Mono>
        <Chip variant="active">3D</Chip>
        <Chip>top</Chip>
        <Chip>L</Chip>
        <Chip>R</Chip>
        <div style={{ flex: 1 }} />
        <Mono style={{ color: 'var(--accent)' }}>⏺ recording — 00:42</Mono>
      </div>

      {/* CENTER VIEWPORT */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1.5px solid var(--ink)', background: 'var(--paper)' }}>
        <BrainBlob size={520} electrodes={electrodes} stim={stim} units={240} />

        {/* floating "agent" pill bottom-left */}
        <Box className="thick" style={{ position: 'absolute', bottom: 14, left: 14, padding: '8px 12px', background: 'var(--paper)', display: 'flex', alignItems: 'center', gap: 8, maxWidth: 320 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }} />
          <div>
            <Label size="sm">agent suggested 4-electrode bilateral montage</Label>
            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
              <Btn size="sm" variant="accent">accept</Btn>
              <Btn size="sm">show reasoning</Btn>
              <Btn size="sm">×</Btn>
            </div>
          </div>
        </Box>

        {/* zoom controls */}
        <Box className="thin" style={{ position: 'absolute', top: 14, right: 14, padding: 4, display: 'flex', flexDirection: 'column', gap: 2, background: 'var(--paper)' }}>
          <Mono style={{ padding: '2px 6px' }}>+</Mono>
          <Divider style={{ margin: 0 }} />
          <Mono style={{ padding: '2px 6px' }}>−</Mono>
          <Divider style={{ margin: 0 }} />
          <Mono style={{ padding: '2px 6px' }}>⛶</Mono>
        </Box>

        {/* coordinate readout */}
        <Box className="thin" style={{ position: 'absolute', top: 14, left: 14, padding: '4px 8px', background: 'var(--paper)' }}>
          <Mono>x: -38.2  y: 24.6  z: 41.0  mm  (MNI)</Mono>
        </Box>
      </div>

      {/* RIGHT INSPECTOR */}
      <div style={{ background: 'var(--paper-2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* tabs */}
        <div style={{ display: 'flex', borderBottom: '1.5px solid var(--ink)' }}>
          {['Inspect', 'Agent', 'Layers'].map((t, i) => (
            <div key={t} style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRight: i < 2 ? '1.5px solid var(--ink)' : 'none', background: i === 0 ? 'var(--paper)' : 'transparent' }}>
              <Label size="sm">{t}</Label>
            </div>
          ))}
        </div>

        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
          {/* selected electrode */}
          <div>
            <Mono>selected · electrode F3</Mono>
            <Box className="thin" style={{ padding: 10, background: 'var(--paper)', marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', rowGap: 3, columnGap: 8 }}>
                <Mono>label</Mono><Mono style={{ color: 'var(--ink)' }}>F3</Mono>
                <Mono>role</Mono><Mono style={{ color: 'var(--ink)' }}>anode (+)</Mono>
                <Mono>current</Mono><Mono style={{ color: 'var(--ink)' }}>+1.0 mA</Mono>
                <Mono>radius</Mono><Mono style={{ color: 'var(--ink)' }}>5.0 mm</Mono>
                <Mono>offset</Mono><Mono style={{ color: 'var(--ink)' }}>2.0 mm normal</Mono>
                <Mono>MNI</Mono><Mono style={{ color: 'var(--ink)' }}>-38, 24, 41</Mono>
              </div>
              <Slider value={0.5} label="current ±2 mA" />
              <Slider value={0.25} label="radius (mm)" />
              <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                <Btn size="sm">duplicate</Btn>
                <Btn size="sm">delete</Btn>
              </div>
            </Box>
          </div>

          <Divider dashed />

          <div>
            <Mono>stim field</Mono>
            <Box className="thin" style={{ padding: 10, background: 'var(--paper)', marginTop: 4 }}>
              <Slider value={0.7} label="opacity 0.6" />
              <Slider value={0.3} label="iso-threshold 0.3 V/m" style={{ marginTop: 4 }} />
              <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                <Mono>colormap</Mono>
                <span style={{ flex: 1, height: 8, background: 'linear-gradient(90deg, #2b6cb0, #d4a017, #d94f3a)', borderRadius: 2, border: '1px solid var(--ink)' }} />
              </div>
            </Box>
          </div>

          <Divider dashed />

          <div>
            <Mono>RNN units</Mono>
            <Box className="thin" style={{ padding: 10, background: 'var(--paper)', marginTop: 4 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', rowGap: 3 }}>
                <Mono>total</Mono><Mono style={{ color: 'var(--ink)' }}>180</Mono>
                <Mono>in volume</Mono><Mono style={{ color: 'var(--accent)' }}>54 (30%)</Mono>
                <Mono>peak act</Mono><Mono style={{ color: 'var(--ink)' }}>0.91</Mono>
              </div>
            </Box>
          </div>
        </div>
      </div>

      {/* BOTTOM TIMELINE */}
      <div style={{ gridColumn: '1 / -1', borderTop: '1.5px solid var(--ink)', background: 'var(--paper)', display: 'flex', flexDirection: 'column', padding: '8px 14px', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Btn size="sm">⏮</Btn>
          <Btn size="sm" variant="primary">▶</Btn>
          <Btn size="sm">⏭</Btn>
          <Mono>t = 4.20 s / 20.00 s</Mono>
          <div style={{ flex: 1 }} />
          <Mono>task: simple-RT</Mono>
          <Chip variant="accent">RT −38 ms</Chip>
        </div>
        {/* timeline track */}
        <div style={{ position: 'relative', height: 36, border: '1.5px solid var(--ink)', borderRadius: 4, background: 'var(--paper-2)' }}>
          {/* stim block */}
          <div style={{ position: 'absolute', left: '15%', width: '45%', top: 4, bottom: 4, background: 'var(--accent)', opacity: 0.3, border: '1px solid var(--accent)', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: '15%', top: -2, fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--accent)' }}>tDCS · 2mA · 9 min</div>
          {/* task events */}
          {[10, 25, 38, 52, 68, 80].map(p => (
            <div key={p} style={{ position: 'absolute', left: `${p}%`, top: 4, bottom: 4, width: 1, background: 'var(--ink)', opacity: 0.5 }} />
          ))}
          {/* playhead */}
          <div style={{ position: 'absolute', left: '21%', top: -4, bottom: -4, width: 2, background: 'var(--ink)' }} />
          <div style={{ position: 'absolute', left: 'calc(21% - 5px)', top: -10, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid var(--ink)' }} />
        </div>
      </div>
    </div>
  );
};

window.WireframeD = WireframeD;
