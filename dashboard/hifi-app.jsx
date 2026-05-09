// Hi-fi app shell — title bar / toolbar / agent left / inspector right / timeline
const { useState, useRef, useEffect } = React;

// ---------- shared bits ----------
const Btn = ({ children, variant, size, onClick, style }) => (
  <button className={`btn ${variant ? 'btn-' + variant : ''} ${size ? 'btn-' + size : ''}`} onClick={onClick} style={style}>{children}</button>
);
const Chip = ({ children, on, accent, style }) => (
  <span className={`chip ${on ? 'chip-on' : ''} ${accent ? 'chip-accent' : ''}`} style={style}>{children}</span>
);
const Mono = ({ children, soft, mute, style, className = '' }) => (
  <span className={`t-mono ${soft ? 't-soft' : ''} ${mute ? 't-mute' : ''} ${className}`} style={style}>{children}</span>
);
const Slider = ({ value, label, unit, onChange }) => {
  const trackRef = useRef(null);
  const onDown = (e) => {
    const move = (ev) => {
      const r = trackRef.current.getBoundingClientRect();
      const v = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width));
      onChange?.(v);
    };
    move(e);
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  return (
    <div className="slider">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="t-mono t-xs t-soft">{label}</span>
        <span className="t-mono t-xs">{unit}</span>
      </div>
      <div ref={trackRef} className="slider-track" onMouseDown={onDown} style={{ cursor: 'pointer' }}>
        <div className="slider-fill" style={{ width: `${value * 100}%` }} />
        <div className="slider-knob" style={{ left: `${value * 100}%` }} />
      </div>
    </div>
  );
};

// ---------- title bar ----------
const TitleBar = ({ onSimulate, simState, simError }) => {
  const dotClass = simState === 'error' ? 'dot' : 'dot dot-live';
  const dotStyle = simState === 'error' ? { background: '#ff6b6b', boxShadow: '0 0 8px #ff6b6b' } : {};
  const statusText = simState === 'error'
    ? (simError || 'backend error')
    : simState === 'running'
    ? 'simulating…'
    : simState === 'done'
    ? 'sim ready'
    : '2 collaborators';
  const btnLabel = simState === 'running' ? '⋯ running' : '▶ Simulate';
  return (
    <div className="bar" style={{ gridColumn: '1 / -1' }}>
      <span className="logo">C</span>
      <span className="t-md t-bold">CTRNN-Viewer</span>
      <span className="t-mono t-xs t-mute">/ untitled-montage.json</span>
      <span className="t-mono t-xs" style={{ color: 'var(--accent-2)' }}>●</span>
      <div style={{ flex: 1 }} />
      <Mono className="t-xs" mute>⌘K · cmd palette</Mono>
      <span className="vdiv" />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <span className={dotClass} style={dotStyle} />
        <Mono soft className="t-xs" style={simState === 'error' ? { color: '#ff8e8e' } : {}}>{statusText}</Mono>
      </span>
      <Btn size="sm">Share</Btn>
      <Btn
        size="sm"
        variant="primary"
        onClick={simState === 'running' ? undefined : onSimulate}
        style={simState === 'running' ? { opacity: 0.6, cursor: 'wait' } : {}}
      >{btnLabel}</Btn>
    </div>
  );
};

// neurogym task slots — match README integration contract
const TASK_OPTIONS = [
  { id: 'perceptual_decision', label: 'Attention — PerceptualDecisionMaking-v0' },
  { id: 'working_memory',      label: 'Working memory — DelayedMatchSample-v0' },
  { id: 'reaction_time',       label: 'Reaction time — ReadySetGo-v0' },
];

// ---------- toolbar ----------
const Toolbar = ({ tool, setTool, mode, setMode, task, setTask, view, setView }) => (
  <div className="bar" style={{ gridColumn: '1 / -1', height: 38 }}>
    <div className="seg">
      {['Select', 'Place'].map(t => (
        <div key={t} className={tool === t ? 'on' : ''} onClick={() => setTool(t)}>
          {t === 'Select' ? '↘ Select' : '● Place'}
        </div>
      ))}
    </div>
    <span className="vdiv" />
    <Mono soft className="t-xs t-up">Mode</Mono>
    <div className="seg">
      {['tDCS', 'tACS'].map(m => (
        <div key={m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>{m}</div>
      ))}
    </div>
    <span className="vdiv" />
    <Mono soft className="t-xs t-up">RNN</Mono>
    <select
      value={task}
      onChange={e => setTask(e.target.value)}
      className="task-select"
    >
      {TASK_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
    </select>
    <span className="vdiv" />
    <Mono soft className="t-xs t-up">View</Mono>
    <div className="seg">
      {['3D', 'Top', 'L', 'R', 'Back'].map(v => (
        <div key={v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>{v}</div>
      ))}
    </div>
    <div style={{ flex: 1 }} />
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span className="dot dot-stim" />
      <Mono className="t-xs" style={{ color: 'var(--accent)' }}>LIVE · simulating</Mono>
    </span>
  </div>
);

// ---------- agent rail ----------
const AgentRail = ({ ailment, setAilment, onSubmit, onApply, agentState, agentResult, agentError }) => {
  const onKey = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
  };
  const result = agentResult;
  return (
    <div className="panel" style={{ borderRight: '1px solid var(--line)' }}>
      <div className="panel-h">
        <span className={`dot ${agentState === 'thinking' ? 'dot-stim' : agentState === 'done' ? 'dot-live' : ''}`} />
        <span className="t-bold">Protocol Agent</span>
        <span style={{ flex: 1 }} />
        <Mono soft className="t-xs">claude · web search</Mono>
      </div>

      <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* patient/ailment input */}
        <div className="card" style={{ padding: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Mono soft className="t-xs t-up">Patient ailment</Mono>
            <span style={{ flex: 1 }} />
            <Mono mute className="t-xs">⌘↵ submit</Mono>
          </div>
          <textarea
            value={ailment}
            onChange={e => setAilment(e.target.value)}
            onKeyDown={onKey}
            placeholder="e.g. treatment-resistant depression, ADHD with WM deficits, focal motor seizures..."
            rows={3}
            style={{
              width: '100%', resize: 'vertical', minHeight: 60,
              background: 'var(--panel)', color: 'var(--ink)',
              border: '1px solid var(--line)', borderRadius: 6,
              padding: 8, fontFamily: 'var(--sans)', fontSize: 12, lineHeight: 1.45,
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <Btn
              size="sm"
              variant="primary"
              onClick={agentState === 'thinking' ? undefined : onSubmit}
              style={agentState === 'thinking' ? { opacity: 0.6, cursor: 'wait' } : {}}
            >{agentState === 'thinking' ? '⋯ thinking' : '↗ Recommend protocol'}</Btn>
            {agentState === 'error' && (
              <Mono className="t-xs" style={{ color: '#ff8e8e', alignSelf: 'center' }}>{agentError}</Mono>
            )}
          </div>
        </div>

        {/* live reasoning when thinking */}
        {agentState === 'thinking' && (
          <div className="msg-agent">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Mono soft className="t-xs t-up">Reasoning</Mono>
              <span className="prog" style={{ flex: 1, height: 2 }}><span className="prog-fill" style={{ width: '60%' }} /></span>
              <Mono mute className="t-xs">~10s</Mono>
            </div>
            <div className="agent-think">
              <b>›</b> querying claude with web search…<br/>
              <b>›</b> evaluating recent RCTs and clinical guidelines<br/>
              <b>›</b> selecting modality and target regions in MNI space<br/>
              <b>›</b> validating DOIs against pubmed
            </div>
          </div>
        )}

        {/* returned protocol */}
        {result && (
          <div className="card card-accent">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Chip accent>RECOMMENDED</Chip>
              <span className="t-bold t-md">{result.modality || 'protocol'}</span>
            </div>
            <div className="kv" style={{ marginBottom: 10 }}>
              <span className="k">modality</span><span className="v">{result.modality || '—'}</span>
              <span className="k">electrodes</span><span className="v">{Array.isArray(result.electrodes) ? result.electrodes.length : 0}</span>
              {Array.isArray(result.electrodes) && result.electrodes.map((e, i) => (
                <React.Fragment key={i}>
                  <span className="k">e{i + 1}</span>
                  <span className="v">
                    [{(e.pos || []).map(v => Number(v).toFixed(0)).join(', ')}] · {Number(e.current_mA || 0).toFixed(1)} mA{e.freq_Hz ? ` · ${e.freq_Hz} Hz` : ''}
                  </span>
                </React.Fragment>
              ))}
            </div>
            {result.rationale && (
              <div className="t-mono t-xs t-soft" style={{ marginBottom: 10, lineHeight: 1.5 }}>
                {result.rationale}
              </div>
            )}
            {Array.isArray(result.papers) && result.papers.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <Mono soft className="t-xs t-up" style={{ display: 'block', marginBottom: 4 }}>papers</Mono>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {result.papers.map((p, i) => (
                    <a key={i} href={p} target="_blank" rel="noreferrer"
                       className="t-mono t-xs"
                       style={{ color: 'var(--accent-3)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 6 }}>
              <Btn size="sm" variant="accent" onClick={() => onApply(result.electrodes)}>↗ Apply to brain</Btn>
              <Btn size="sm" onClick={() => navigator.clipboard?.writeText(JSON.stringify(result, null, 2))}>copy JSON</Btn>
            </div>
          </div>
        )}

        {!result && agentState !== 'thinking' && (
          <Mono mute className="t-xs">
            Type an ailment above and click "Recommend protocol" to query the agent.
          </Mono>
        )}
      </div>
    </div>
  );
};

// ---------- dose-response plot ----------
const DoseResponsePlot = ({ amp }) => {
  // gaussian-ish dose response peaking at 1.7mA, falling off at high doses
  const W = 260, H = 110, padL = 28, padR = 8, padT = 8, padB = 18;
  const f = (mA) => 0.6 + 4 * mA * Math.exp(-Math.pow((mA - 1.7) / 1.1, 2));
  const xs = [];
  for (let i = 0; i <= 60; i++) xs.push((i / 60) * 4);
  const yMax = 5.0;
  const xToPx = (x) => padL + (x / 4) * (W - padL - padR);
  const yToPx = (y) => H - padB - (y / yMax) * (H - padT - padB);
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${xToPx(x).toFixed(1)} ${yToPx(f(x)).toFixed(1)}`).join(' ');
  const area = `${path} L ${xToPx(4).toFixed(1)} ${(H - padB).toFixed(1)} L ${padL} ${(H - padB).toFixed(1)} Z`;
  const currentX = amp * 4;
  const optimalX = 1.70;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="doseGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f2b04a" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#f2b04a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* y grid */}
      {[1, 2, 3, 4].map(y => (
        <g key={y}>
          <line x1={padL} x2={W - padR} y1={yToPx(y)} y2={yToPx(y)} stroke="rgba(255,255,255,0.05)" />
          <text x={padL - 4} y={yToPx(y) + 3} fontSize="8" fontFamily="JetBrains Mono" fill="#5b6068" textAnchor="end">{y}</text>
        </g>
      ))}
      {/* x axis labels */}
      {[0, 1, 2, 3, 4].map(x => (
        <text key={x} x={xToPx(x)} y={H - 4} fontSize="8" fontFamily="JetBrains Mono" fill="#5b6068" textAnchor="middle">{x}mA</text>
      ))}
      {/* y axis label */}
      <text x={4} y={padT + 6} fontSize="8" fontFamily="JetBrains Mono" fill="#5b6068">d′</text>
      {/* curve area */}
      <path d={area} fill="url(#doseGrad)" />
      <path d={path} fill="none" stroke="#f2b04a" strokeWidth="1.2" />
      {/* optimal marker */}
      <line x1={xToPx(optimalX)} x2={xToPx(optimalX)} y1={padT} y2={H - padB} stroke="#f2b04a" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
      <circle cx={xToPx(optimalX)} cy={yToPx(f(optimalX))} r="3.5" fill="#f2b04a" stroke="#0a0b0d" strokeWidth="1" />
      <text x={xToPx(optimalX) + 6} y={yToPx(f(optimalX)) - 4} fontSize="8" fontFamily="JetBrains Mono" fill="#f2b04a">optimal</text>
      {/* current marker */}
      <line x1={xToPx(currentX)} x2={xToPx(currentX)} y1={padT} y2={H - padB} stroke="#e85a3c" strokeWidth="0.8" />
      <circle cx={xToPx(currentX)} cy={yToPx(f(currentX))} r="4" fill="#e85a3c" stroke="#0a0b0d" strokeWidth="1.2" />
      <text x={xToPx(currentX) + 6} y={yToPx(f(currentX)) + 10} fontSize="8" fontFamily="JetBrains Mono" fill="#e85a3c">now</text>
    </svg>
  );
};

// freq slider mapping: 0..1 -> 1..150 Hz (linear, snapped to integer Hz)
const sliderToHz = (v) => Math.max(1, Math.round(1 + v * 149));
const hzToSlider = (hz) => Math.max(0, Math.min(1, (hz - 1) / 149));

// ---------- inspector ----------
const Inspector = ({ hud, mode, amp, setAmp, freqHz, setFreqHz, cortexOpacity, setCortexOpacity, onViewStimJson }) => {
  const [radius, setRadius] = useState(0.25);
  const [opacity, setOpacity] = useState(0.55);
  const [iso, setIso] = useState(0.3);
  return (
    <div className="panel" style={{ borderLeft: '1px solid var(--line)' }}>
      <div className="panel-h">
        <span className="t-bold">Inspector</span>
        <span style={{ flex: 1 }} />
        <Mono soft className="t-xs">F3 · anode</Mono>
      </div>

      <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* selected electrode */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
            <Mono soft className="t-xs t-up">Selected</Mono>
            <span className="epin"><span className="swatch" />F3</span>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="kv">
              <span className="k">role</span><span className="v">anode (+)</span>
              <span className="k">amp</span><span className="v">+{(amp * 4).toFixed(1)} mA</span>
              <span className="k">freq</span><span className="v">{mode === 'tDCS' ? '— (DC)' : `${freqHz.toFixed(1)} Hz`}</span>
              <span className="k">radius</span><span className="v">5.0 mm</span>
              <span className="k">offset</span><span className="v">2.0 mm n̂</span>
              <span className="k">MNI</span><span className="v">−38, 24, 41</span>
            </div>
            <Slider value={amp} label="amplitude" unit={`±${(amp * 4).toFixed(1)} mA`} onChange={setAmp} />
            <Slider value={radius} label="radius" unit={`${(radius * 20).toFixed(1)} mm`} onChange={setRadius} />
            <div style={{ display: 'flex', gap: 4 }}>
              <Btn size="sm">duplicate</Btn>
              <Btn size="sm">flip polarity</Btn>
              <Btn size="sm">delete</Btn>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* brain mesh controls */}
        <div>
          <Mono soft className="t-xs t-up" style={{ marginBottom: 6, display: 'block' }}>Brain</Mono>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Slider
              value={cortexOpacity}
              label="cortex opacity"
              unit={cortexOpacity >= 0.999 ? 'opaque' : cortexOpacity.toFixed(2)}
              onChange={setCortexOpacity}
            />
          </div>
        </div>

        <div className="divider" />

        {/* stim field */}
        <div>
          <Mono soft className="t-xs t-up" style={{ marginBottom: 6, display: 'block' }}>Stim Field</Mono>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mode === 'tACS' && (
              <Slider
                value={hzToSlider(freqHz)}
                label="carrier freq"
                unit={`${sliderToHz(hzToSlider(freqHz))} Hz`}
                onChange={(v) => setFreqHz(sliderToHz(v))}
              />
            )}
            <Slider value={opacity} label="opacity" unit={opacity.toFixed(2)} onChange={setOpacity} />
            <Slider value={iso} label="iso threshold" unit={`${(iso).toFixed(2)} V/m`} onChange={setIso} />
            <div>
              <Mono soft className="t-xs">colormap</Mono>
              <div style={{ marginTop: 4, height: 10, borderRadius: 2, background: 'linear-gradient(90deg, #1a3a8a, #5ba3ff, #f2b04a, #e85a3c)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <Mono mute className="t-xs">0</Mono>
                <Mono mute className="t-xs">peak</Mono>
              </div>
            </div>
            <Btn size="sm" variant="primary" onClick={onViewStimJson}>view stim JSON</Btn>
          </div>
        </div>

        <div className="divider" />

        {/* dose-response plot */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
            <Mono soft className="t-xs t-up">Dose response</Mono>
            <span style={{ flex: 1 }} />
            <Mono mute className="t-xs">d′ vs amplitude</Mono>
          </div>
          <div className="card" style={{ padding: 10 }}>
            <DoseResponsePlot amp={amp} />
            <div className="kv" style={{ marginTop: 10 }}>
              <span className="k">current</span><span className="v">{(amp * 4).toFixed(2)} mA → d′ {(0.6 + 4*amp*Math.exp(-Math.pow((4*amp - 1.7)/1.1, 2))).toFixed(2)}</span>
              <span className="k">optimal</span><span className="v" style={{ color: 'var(--accent-2)' }}>1.70 mA → d′ 4.62</span>
              <span className="k">headroom</span><span className="v" style={{ color: 'var(--accent-4)' }}>+{(4.62 - (0.6 + 4*amp*Math.exp(-Math.pow((4*amp - 1.7)/1.1, 2)))).toFixed(2)} d′</span>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
              <Btn size="sm" variant="accent">→ jump to optimal</Btn>
              <Btn size="sm">resweep</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- timeline ----------
const Timeline = ({ mode, onTick }) => {
  const [t, setT] = useState(0.21);
  useEffect(() => {
    const id = setInterval(() => setT(v => {
      const nv = (v + 0.0008) % 1;
      onTick?.(nv);
      return nv;
    }), 32);
    return () => clearInterval(id);
  }, [onTick]);
  return (
    <div style={{
      gridColumn: '1 / -1', borderTop: '1px solid var(--line)', background: 'var(--panel)',
      padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Btn size="sm" variant="ghost">⏮</Btn>
        <Btn size="sm" variant="primary">▶</Btn>
        <Btn size="sm" variant="ghost">⏭</Btn>
        <Mono soft className="t-xs">t = {(t * 20).toFixed(2)} s / 20.00 s</Mono>
        <span className="vdiv" />
        <Mono soft className="t-xs t-up">Task</Mono>
        <Chip>n-back · 2-back</Chip>
        <Chip accent>d′ Δ +0.31</Chip>
        <span style={{ flex: 1 }} />
        <Mono soft className="t-xs">accuracy</Mono>
        <Mono className="t-xs" style={{ color: 'var(--accent-4)' }}>0.79 ↑</Mono>
        <Mono soft className="t-xs">RT</Mono>
        <Mono className="t-xs" style={{ color: 'var(--accent-4)' }}>−38ms</Mono>
      </div>

      <div style={{ position: 'relative', height: 36, background: 'var(--panel-2)', border: '1px solid var(--line)', borderRadius: 6, overflow: 'hidden' }}>
        {/* stim window */}
        <div style={{ position: 'absolute', left: '15%', width: '45%', top: 0, bottom: 0,
          background: 'linear-gradient(180deg, rgba(232,90,60,0.18), rgba(232,90,60,0.06))',
          borderLeft: '1px solid var(--accent)', borderRight: '1px solid var(--accent)' }} />
        <div style={{ position: 'absolute', left: '15.5%', top: 4, fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--accent)' }}>
          {mode} · 1.5mA · {mode === 'tDCS' ? 'DC' : '6Hz'} · 9min
        </div>
        {/* task event ticks */}
        {[10, 22, 28, 35, 42, 48, 55, 64, 72, 80, 88].map((p, i) => (
          <div key={p} style={{ position: 'absolute', left: `${p}%`, top: 22, bottom: 4, width: 1, background: 'var(--ink-4)', opacity: 0.6 }} />
        ))}
        {/* sparkline performance */}
        <svg style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 16, width: '100%', height: 'calc(100% - 16px)' }} preserveAspectRatio="none" viewBox="0 0 100 20">
          <path d={`M 0 14 ${[...Array(50)].map((_,i) => {
            const x = (i + 1) * 2;
            const stim = x > 15 && x < 60;
            const y = 14 - (stim ? 4 + Math.sin(i * 0.4) * 2 : Math.sin(i * 0.4) * 1.5);
            return `L ${x} ${y}`;
          }).join(' ')}`} fill="none" stroke="var(--accent-4)" strokeWidth="0.6" opacity="0.7" />
        </svg>
        {/* playhead */}
        <div style={{ position: 'absolute', left: `${t * 100}%`, top: 0, bottom: 0, width: 1, background: 'var(--ink)', boxShadow: '0 0 6px var(--ink)' }} />
        <div style={{ position: 'absolute', left: `${t * 100}%`, top: -2, transform: 'translateX(-4px)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '6px solid var(--ink)' }} />
      </div>
    </div>
  );
};

// ---------- viewport overlay ----------
const ViewportOverlay = ({ hud, electrodes }) => (
  <>
    {/* top-left help */}
    <div style={{ position: 'absolute', top: 12, left: 12, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ background: 'rgba(13,14,16,0.78)', backdropFilter: 'blur(6px)', border: '1px solid var(--line)', padding: '6px 10px', borderRadius: 6 }}>
        <Mono soft className="t-xs">click cortex · place electrode · drag · orbit · scroll · zoom</Mono>
      </div>
    </div>
    {/* top-right axis */}
    <div style={{ position: 'absolute', top: 12, right: 12, pointerEvents: 'none' }}>
      <div style={{ background: 'rgba(13,14,16,0.78)', backdropFilter: 'blur(6px)', border: '1px solid var(--line)', padding: '6px 10px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Mono className="t-xs"><span style={{ color: '#ff6b6b' }}>X</span> <span style={{ color: 'var(--ink-3)' }}>R</span></Mono>
        <Mono className="t-xs"><span style={{ color: '#7dd87d' }}>Y</span> <span style={{ color: 'var(--ink-3)' }}>↑</span></Mono>
        <Mono className="t-xs"><span style={{ color: '#6ba3ff' }}>Z</span> <span style={{ color: 'var(--ink-3)' }}>A</span></Mono>
      </div>
    </div>

    {/* bottom HUD */}
    <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, pointerEvents: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div style={{ background: 'rgba(13,14,16,0.78)', backdropFilter: 'blur(6px)', border: '1px solid var(--line)', padding: '8px 14px', borderRadius: 8, display: 'flex', gap: 18 }}>
        <div>
          <Mono mute className="t-xs t-up">stimmed</Mono>
          <div className="t-mono t-bold" style={{ fontSize: 18, color: 'var(--accent)' }}>{hud.stimmed}<span style={{ color: 'var(--ink-4)', fontSize: 12, fontWeight: 400 }}>/{hud.total}</span></div>
        </div>
        <div className="vdiv" style={{ height: 30 }} />
        <div>
          <Mono mute className="t-xs t-up">peak |E|</Mono>
          <div className="t-mono t-bold" style={{ fontSize: 18 }}>{hud.peakE.toFixed(2)}<span style={{ color: 'var(--ink-4)', fontSize: 11, fontWeight: 400 }}> V/m</span></div>
        </div>
        <div className="vdiv" style={{ height: 30 }} />
        <div>
          <Mono mute className="t-xs t-up">focality</Mono>
          <div className="t-mono t-bold" style={{ fontSize: 18 }}>{hud.focality.toFixed(2)}</div>
        </div>
        <div className="vdiv" style={{ height: 30 }} />
        <div>
          <Mono mute className="t-xs t-up">predicted Δ</Mono>
          <div className="t-mono t-bold" style={{ fontSize: 18, color: 'var(--accent-4)' }}>+0.31<span style={{ color: 'var(--ink-4)', fontSize: 11, fontWeight: 400 }}> d′</span></div>
        </div>
      </div>

      <div style={{ background: 'rgba(13,14,16,0.78)', backdropFilter: 'blur(6px)', border: '1px solid var(--line)', padding: 4, borderRadius: 8, display: 'flex', gap: 2 }}>
        <Btn size="sm" variant="ghost">⟳</Btn>
        <Btn size="sm" variant="ghost">⛶</Btn>
        <Btn size="sm" variant="ghost">⤓</Btn>
      </div>
    </div>
  </>
);

// ---------- stim json modal ----------
const StimJsonModal = ({ json, onClose }) => {
  if (!json) return null;
  // build a redacted preview so a 200x68 array doesn't drown the eye
  const head = {
    task: json.task,
    modality: json.modality,
    freq_Hz: json.freq_Hz,
    dt_ms: json.dt_ms,
    T: json.T,
    n_regions: json.n_regions,
    region_labels: json.region_labels,
    field_per_region_preview: `[${json.T} timesteps × ${json.n_regions} regions] — first 3 timesteps shown below`,
    field_per_region_first3: json.field_per_region.slice(0, 3),
  };
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--panel)', border: '1px solid var(--line-strong)', borderRadius: 8,
        padding: 16, width: '70vw', maxWidth: 900, maxHeight: '80vh',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="t-bold">Stim JSON · POST /infer payload</span>
          <Mono mute className="t-xs">{json.T}×{json.n_regions} field array</Mono>
          <span style={{ flex: 1 }} />
          <Btn size="sm" onClick={() => navigator.clipboard?.writeText(JSON.stringify(json))}>copy full</Btn>
          <Btn size="sm" onClick={onClose}>close</Btn>
        </div>
        <pre style={{
          flex: 1, overflow: 'auto', margin: 0,
          background: 'var(--panel-2)', border: '1px solid var(--line)',
          padding: 12, borderRadius: 6,
          fontFamily: 'var(--mono)', fontSize: 11, lineHeight: 1.5, color: 'var(--ink-2)',
        }}>
          {JSON.stringify(head, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// ---------- main app ----------
const HifiApp = () => {
  const [tool, setTool] = useState('Place');
  const [mode, setMode] = useState('tACS');
  const [task, setTask] = useState('working_memory');
  const [view, setView] = useState('3D');
  const [amp, setAmp] = useState(0.5);          // 0..1, displayed as 0..4 mA
  const [freqHz, setFreqHz] = useState(6);       // tACS carrier
  const [cortexOpacity, setCortexOpacityState] = useState(0.62);
  const [stimJson, setStimJson] = useState(null);
  const [simState, setSimState] = useState('idle');     // idle | running | done | error
  const [simError, setSimError] = useState(null);
  const [ailment, setAilment] = useState('');
  const [agentState, setAgentState] = useState('idle'); // idle | thinking | done | error
  const [agentError, setAgentError] = useState(null);
  const [agentResult, setAgentResult] = useState(null);
  const [hud, setHud] = useState({ stimmed: 0, total: 68, peakE: 0, focality: 0, electrodes: 0 });
  const brainRef = useRef(null);

  const setCortexOpacity = (v) => {
    setCortexOpacityState(v);
    brainRef.current?.setCortexOpacity(v);
  };

  const handleViewStimJson = () => {
    const j = brainRef.current?.getStimJson(task, mode, amp * 4, freqHz);
    if (j) {
      console.log('[stim-json]', j);
      setStimJson(j);
    }
  };

  const handleSimulate = async () => {
    if (simState === 'running') return;
    const api = window.synapsterApi;
    if (!api) {
      setSimError('api wrapper missing');
      setSimState('error');
      return;
    }
    const payload = brainRef.current?.getStimJson(task, mode, amp * 4, freqHz);
    if (!payload) {
      setSimError('no stim payload');
      setSimState('error');
      return;
    }
    // Backend's /infer accepts `task` + `field_per_region`. Trim metadata
    // fields the server ignores anyway.
    const body = { task: payload.task, field_per_region: payload.field_per_region };
    setSimState('running');
    setSimError(null);
    try {
      const resp = await api.infer(body);
      brainRef.current?.setActivations(resp.activations);
      console.log('[infer] ok', { T: resp.activations?.length, dt_ms: resp.dt_ms });
      setSimState('done');
    } catch (e) {
      const msg = String(e?.message || e);
      const friendly = /401/.test(msg)
        ? 'auth failed'
        : /Failed to fetch|NetworkError|CORS/i.test(msg)
        ? 'backend offline'
        : msg.length > 80 ? msg.slice(0, 77) + '…' : msg;
      console.warn('[infer] error:', msg);
      setSimError(friendly);
      setSimState('error');
    }
  };

  const handleTimelineTick = (t) => {
    brainRef.current?.setPlaybackT(t);
  };

  const handleAgentSubmit = async () => {
    const text = (ailment || '').trim();
    if (!text || agentState === 'thinking') return;
    const api = window.synapsterApi;
    if (!api) {
      setAgentError('api wrapper missing');
      setAgentState('error');
      return;
    }
    setAgentState('thinking');
    setAgentError(null);
    try {
      const result = await api.protocol(text);
      console.log('[protocol]', result);
      setAgentResult(result);
      setAgentState('done');
    } catch (e) {
      const msg = String(e?.message || e);
      const friendly = /401/.test(msg) ? 'auth failed'
        : /503/.test(msg) ? 'agent not configured'
        : /502/.test(msg) ? 'anthropic error'
        : /Failed to fetch|NetworkError|CORS/i.test(msg) ? 'backend offline'
        : msg.length > 80 ? msg.slice(0, 77) + '…' : msg;
      console.warn('[protocol] error:', msg);
      setAgentError(friendly);
      setAgentState('error');
    }
  };

  const handleApplyProtocol = (electrodes) => {
    if (Array.isArray(electrodes) && electrodes.length) {
      brainRef.current?.applyProtocol(electrodes);
    }
  };

  return (
    <div className="hf">
      <TitleBar onSimulate={handleSimulate} simState={simState} simError={simError} />
      <Toolbar tool={tool} setTool={setTool} mode={mode} setMode={setMode} task={task} setTask={setTask} view={view} setView={setView} />
      <AgentRail
        ailment={ailment} setAilment={setAilment}
        onSubmit={handleAgentSubmit}
        onApply={handleApplyProtocol}
        agentState={agentState}
        agentResult={agentResult}
        agentError={agentError}
      />
      <div style={{ position: 'relative', background: 'radial-gradient(ellipse at 30% 30%, #1a1c22 0%, #0a0b0d 70%)' }}>
        <HifiBrainViewport ref={brainRef} onHud={setHud} />
        <ViewportOverlay hud={hud} />
      </div>
      <Inspector
        hud={hud} mode={mode}
        amp={amp} setAmp={setAmp}
        freqHz={freqHz} setFreqHz={setFreqHz}
        cortexOpacity={cortexOpacity} setCortexOpacity={setCortexOpacity}
        onViewStimJson={handleViewStimJson}
      />
      <Timeline mode={mode} onTick={handleTimelineTick} />
      <StimJsonModal json={stimJson} onClose={() => setStimJson(null)} />
    </div>
  );
};

window.HifiApp = HifiApp;
