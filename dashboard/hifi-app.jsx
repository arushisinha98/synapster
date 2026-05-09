// Hi-fi app shell — title bar / toolbar / agent left / inspector right / timeline
const { useState, useRef, useEffect } = React;

// ---------- shared bits ----------
const Btn = ({ children, variant, size, onClick, style, disabled, title }) => (
  <button
    type="button"
    className={`btn ${variant ? 'btn-' + variant : ''} ${size ? 'btn-' + size : ''} ${disabled ? 'btn-disabled' : ''}`}
    onClick={disabled ? undefined : onClick}
    disabled={!!disabled}
    title={title}
    style={style}
  >{children}</button>
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
    : 'ready';
  const btnLabel = simState === 'running' ? '⋯ running' : '▶ Simulate';
  return (
    <div className="bar" style={{ gridColumn: '1 / -1' }}>
      <span className="logo">S</span>
      <span className="t-md t-bold">Synapster</span>
      <span className="t-mono t-xs t-mute">/ demo-protocol.json</span>
      <span className="t-mono t-xs" style={{ color: 'var(--accent-2)' }}>●</span>
      <div style={{ flex: 1 }} />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <span className={dotClass} style={dotStyle} />
        <Mono soft className="t-xs" style={simState === 'error' ? { color: '#ff8e8e' } : {}}>{statusText}</Mono>
      </span>
      <Btn size="sm" disabled title="not implemented">Share</Btn>
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
const Toolbar = ({ mode, setMode, task, setTask, simState }) => (
  <div className="bar" style={{ gridColumn: '1 / -1', height: 38 }}>
    <Mono soft className="t-xs t-up">Mode</Mono>
    <div className="seg">
      {['tDCS', 'tACS'].map(m => (
        <div key={m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>{m}</div>
      ))}
    </div>
    <span className="vdiv" />
    <Mono soft className="t-xs t-up">RNN task</Mono>
    <select
      value={task}
      onChange={e => setTask(e.target.value)}
      className="task-select"
    >
      {TASK_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
    </select>
    <div style={{ flex: 1 }} />
    {simState === 'running' && (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span className="dot dot-stim" />
        <Mono className="t-xs" style={{ color: 'var(--accent)' }}>LIVE · simulating</Mono>
      </span>
    )}
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

// freq slider mapping: 0..1 -> 1..150 Hz (linear, snapped to integer Hz)
const sliderToHz = (v) => Math.max(1, Math.round(1 + v * 149));
const hzToSlider = (hz) => Math.max(0, Math.min(1, (hz - 1) / 149));

// ---------- hero performance card ----------
const HeroCard = ({ simState, simError, perfDelta, perfDuration, taskLabel }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (simState !== 'running') {
      setProgress(0);
      return;
    }
    setProgress(0);
    const id = setInterval(() => {
      setProgress(p => Math.min(0.95, p + 0.04 + Math.random() * 0.02));
    }, 80);
    return () => clearInterval(id);
  }, [simState]);

  const isRunning = simState === 'running';
  const isError = simState === 'error';
  const isDone = simState === 'done' && perfDelta;
  const isIdle = !isRunning && !isError && !isDone;
  const sign = (n) => (n >= 0 ? '+' : '');

  return (
    <div className="hero-card" data-hero-state={simState}>
      <div className="hero-head">
        <Mono soft className="t-xs t-up">Performance</Mono>
        <span style={{ flex: 1 }} />
        {isRunning && <Mono className="t-xs" style={{ color: 'var(--accent)' }}>⟳ sim…</Mono>}
        {isDone && perfDuration != null && <Mono mute className="t-xs">{perfDuration}ms</Mono>}
        {isError && <Mono className="t-xs" style={{ color: '#ff8e8e' }}>{simError || 'error'}</Mono>}
      </div>
      <div className="hero-body">
        {isIdle && (
          <>
            <div className="hero-big hero-big-idle">— · —</div>
            <div className="hero-sub">RUN TO SEE Δ</div>
            <div className="hero-help">place electrodes · click ▶ Simulate</div>
          </>
        )}
        {isRunning && (
          <>
            <div className="hero-big hero-big-pulse">· · ·</div>
            <div className="hero-sub">computing…</div>
            <div className="hero-bar"><div className="hero-bar-fill" style={{ width: (progress * 100).toFixed(0) + '%' }} /></div>
          </>
        )}
        {isError && (
          <>
            <div className="hero-big hero-big-err">!</div>
            <div className="hero-sub">simulation failed</div>
            <div className="hero-help">{simError || 'try again'}</div>
          </>
        )}
        {isDone && (
          <>
            <div className={`hero-big hero-big-done ${perfDelta.deltaPct >= 0 ? 'pos' : 'neg'}`}>
              {sign(perfDelta.deltaPct)}{perfDelta.deltaPct.toFixed(1)}%
            </div>
            <div className="hero-sub">{taskLabel || 'task score'} {perfDelta.deltaPct >= 0 ? '↑' : '↓'}</div>
            <div className="hero-meta">
              <span><span className="t-mute">base</span> {perfDelta.base.toFixed(2)}</span>
              <span><span className="t-mute">stim</span> {perfDelta.stim.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ---------- inspector ----------
const Inspector = ({
  selectedElectrode, electrodeCount, maxElectrodes,
  mode, amp, setAmp, freqHz, setFreqHz,
  cortexOpacity, setCortexOpacity,
  onViewStimJson, onDelete, onFlipPolarity,
  simState, simError, perfDelta, perfDuration, taskLabel,
}) => {
  const sel = selectedElectrode;
  const headerLabel = sel
    ? `${sel.label} · ${sel.polarity === '+' ? 'anode' : 'cathode'}`
    : `${electrodeCount}/${maxElectrodes} placed`;
  return (
    <div className="panel" style={{ borderLeft: '1px solid var(--line)' }}>
      <div className="panel-h">
        <span className="t-bold">Inspector</span>
        <span style={{ flex: 1 }} />
        <Mono soft className="t-xs">{headerLabel}</Mono>
      </div>

      <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* hero performance card */}
        <HeroCard
          simState={simState}
          simError={simError}
          perfDelta={perfDelta}
          perfDuration={perfDuration}
          taskLabel={taskLabel}
        />

        <div className="divider" />

        {/* selected electrode */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
            <Mono soft className="t-xs t-up">Electrode</Mono>
            <span style={{ flex: 1 }} />
            {sel && (
              <span className={`epin ${sel.polarity === '-' ? 'cathode' : ''}`}>
                <span className="swatch" />{sel.label}
              </span>
            )}
          </div>
          {!sel ? (
            <div className="card hero-empty">
              <Mono mute className="t-xs">click an electrode on the brain to inspect.</Mono>
              <Mono mute className="t-xs" style={{ display: 'block', marginTop: 4 }}>
                {electrodeCount} of {maxElectrodes} placed.
              </Mono>
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="kv">
                <span className="k">role</span><span className="v">{sel.polarity === '+' ? 'anode (+)' : 'cathode (−)'}</span>
                <span className="k">amp</span><span className="v">±{(amp * 4).toFixed(1)} mA</span>
                <span className="k">freq</span><span className="v">{mode === 'tDCS' ? '— (DC)' : `${freqHz.toFixed(1)} Hz`}</span>
                <span className="k">MNI</span><span className="v">{sel.mni.map(v => Math.round(v)).join(', ')}</span>
              </div>
              <Slider value={amp} label="amplitude" unit={`±${(amp * 4).toFixed(1)} mA`} onChange={setAmp} />
              <div style={{ display: 'flex', gap: 4 }}>
                <Btn size="sm" disabled title="not in scope">duplicate</Btn>
                <Btn size="sm" onClick={onFlipPolarity} disabled={electrodeCount === 0}>flip polarity</Btn>
                <Btn size="sm" onClick={onDelete}>× delete</Btn>
              </div>
            </div>
          )}
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
      </div>
    </div>
  );
};

// ---------- timeline ----------
const Timeline = ({ mode, amp, freqHz, onTick, taskLabel, perfDelta }) => {
  const [t, setT] = useState(0.21);
  useEffect(() => {
    const id = setInterval(() => setT(v => {
      const nv = (v + 0.0008) % 1;
      onTick?.(nv);
      return nv;
    }), 32);
    return () => clearInterval(id);
  }, [onTick]);
  const ampMA = (amp * 4).toFixed(1);
  const freqLabel = mode === 'tDCS' ? 'DC' : `${freqHz.toFixed(1)}Hz`;
  return (
    <div style={{
      gridColumn: '1 / -1', borderTop: '1px solid var(--line)', background: 'var(--panel)',
      padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Btn size="sm" variant="ghost" disabled title="not in scope">⏮</Btn>
        <Btn size="sm" variant="primary" disabled title="auto-playback">▶</Btn>
        <Btn size="sm" variant="ghost" disabled title="not in scope">⏭</Btn>
        <Mono soft className="t-xs">t = {(t * 20).toFixed(2)} s / 20.00 s</Mono>
        <span className="vdiv" />
        <Mono soft className="t-xs t-up">Task</Mono>
        <Chip>{taskLabel || '—'}</Chip>
        {perfDelta && (
          <Chip accent>
            Δ {perfDelta.deltaPct >= 0 ? '+' : ''}{perfDelta.deltaPct.toFixed(1)}%
          </Chip>
        )}
        <span style={{ flex: 1 }} />
        <Mono soft className="t-xs">stim</Mono>
        <Mono className="t-xs" style={{ color: 'var(--accent)' }}>{mode} · {ampMA}mA · {freqLabel}</Mono>
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
const ViewportOverlay = ({ hud, perfDelta, warn }) => (
  <>
    {/* top-left help */}
    <div style={{ position: 'absolute', top: 12, left: 12, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ background: 'rgba(13,14,16,0.78)', backdropFilter: 'blur(6px)', border: '1px solid var(--line)', padding: '6px 10px', borderRadius: 6 }}>
        <Mono soft className="t-xs">click cortex to place · click electrode to select · ▶ Simulate</Mono>
      </div>
      {warn && (
        <div style={{ background: 'rgba(232,90,60,0.18)', border: '1px solid var(--accent)', padding: '6px 10px', borderRadius: 6 }}>
          <Mono className="t-xs" style={{ color: 'var(--accent)' }}>{warn}</Mono>
        </div>
      )}
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
          <Mono mute className="t-xs t-up">measured Δ</Mono>
          {perfDelta ? (
            <div className="t-mono t-bold" style={{ fontSize: 18, color: perfDelta.deltaPct >= 0 ? 'var(--accent-4)' : '#ff8e8e' }}>
              {perfDelta.deltaPct >= 0 ? '+' : ''}{perfDelta.deltaPct.toFixed(1)}<span style={{ color: 'var(--ink-4)', fontSize: 11, fontWeight: 400 }}> %</span>
            </div>
          ) : (
            <div className="t-mono t-bold" style={{ fontSize: 18, color: 'var(--ink-4)' }}>—</div>
          )}
        </div>
      </div>

      <div style={{ background: 'rgba(13,14,16,0.78)', backdropFilter: 'blur(6px)', border: '1px solid var(--line)', padding: 4, borderRadius: 8, display: 'flex', gap: 2 }}>
        <Btn size="sm" variant="ghost" disabled title="reset view (not implemented)">⟳</Btn>
        <Btn size="sm" variant="ghost" disabled title="fullscreen (not implemented)">⛶</Btn>
        <Btn size="sm" variant="ghost" disabled title="export (not implemented)">⤓</Btn>
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
const TASK_LABELS = {
  perceptual_decision: 'attention',
  working_memory: 'working memory',
  reaction_time: 'reaction time',
};

// Score = mean of |activations| across time and units. Higher = more network
// response. Symbolic scalar; the magnitude isn't a clinical metric, but Δ
// between baseline (zero field) and stim runs is a real, reactive signal.
function scoreOf(activations) {
  if (!Array.isArray(activations) || !activations.length) return 0;
  let sum = 0, count = 0;
  for (let t = 0; t < activations.length; t++) {
    const row = activations[t];
    if (!row) continue;
    for (let i = 0; i < row.length; i++) {
      sum += Math.abs(row[i]);
      count++;
    }
  }
  return count > 0 ? sum / count : 0;
}

function makeZeroField(T, N) {
  const out = new Array(T);
  for (let t = 0; t < T; t++) {
    const row = new Array(N);
    for (let i = 0; i < N; i++) row[i] = 0;
    out[t] = row;
  }
  return out;
}

const HifiApp = () => {
  const [mode, setMode] = useState('tACS');
  const [task, setTask] = useState('working_memory');
  const [amp, setAmp] = useState(0.5);          // 0..1, displayed as 0..4 mA
  const [freqHz, setFreqHz] = useState(6);       // tACS carrier
  const [cortexOpacity, setCortexOpacityState] = useState(0.62);
  const [stimJson, setStimJson] = useState(null);
  const [simState, setSimState] = useState('idle');     // idle | running | done | error
  const [simError, setSimError] = useState(null);
  const [perfDelta, setPerfDelta] = useState(null);     // {base, stim, deltaPct}
  const [perfDuration, setPerfDuration] = useState(null);
  const [ailment, setAilment] = useState('');
  const [agentState, setAgentState] = useState('idle'); // idle | thinking | done | error
  const [agentError, setAgentError] = useState(null);
  const [agentResult, setAgentResult] = useState(null);
  const [hud, setHud] = useState({ stimmed: 0, total: 68, peakE: 0, focality: 0, electrodes: 0 });
  const [hudWarn, setHudWarn] = useState(null);
  const [selectedElectrode, setSelectedElectrode] = useState(null);
  const brainRef = useRef(null);
  const warnTimerRef = useRef(null);
  // best-effort: not all backends ship maxElectrodes; fall back to 2.
  const maxElectrodes = brainRef.current?.maxElectrodes || 2;

  const taskLabel = TASK_LABELS[task] || task;

  // probe backend tasks once (silent on failure — gate is local-friendly).
  useEffect(() => {
    const api = window.synapsterApi;
    if (!api) return;
    api.tasks()
      .then((t) => console.log('[tasks] available:', t))
      .catch((e) => console.warn('[tasks] probe failed (ok if backend offline):', e.message));
  }, []);

  // task change → perfDelta becomes stale (different RNN), reset to idle look.
  useEffect(() => {
    setPerfDelta(null);
    setPerfDuration(null);
    setSimError(null);
    setSimState((s) => (s === 'running' ? s : 'idle'));
    brainRef.current?.clearActivations?.();
  }, [task]);

  const handleHud = (h) => {
    if (h.warn) {
      setHudWarn(h.warn);
      if (warnTimerRef.current) clearTimeout(warnTimerRef.current);
      warnTimerRef.current = setTimeout(() => setHudWarn(null), 1500);
      // don't overwrite hud values when this is just a warn ping
      return;
    }
    setHud({ stimmed: h.stimmed, total: h.total, peakE: h.peakE, focality: h.focality, electrodes: h.electrodes });
  };

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

  const handleDeleteSelected = () => {
    brainRef.current?.removeSelected?.();
  };
  const handleFlipPolarity = () => {
    brainRef.current?.flipPolarities?.();
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
    const T = payload.field_per_region.length;
    const N = payload.n_regions;
    const stimBody = { task: payload.task, field_per_region: payload.field_per_region };
    const baseBody = { task: payload.task, field_per_region: makeZeroField(T, N) };

    setSimState('running');
    setSimError(null);
    setPerfDelta(null);
    setPerfDuration(null);
    const t0 = performance.now();

    try {
      const [baseResp, stimResp] = await Promise.all([
        api.infer(baseBody),
        api.infer(stimBody),
      ]);
      const dur = Math.round(performance.now() - t0);
      const base = scoreOf(baseResp.activations);
      const stim = scoreOf(stimResp.activations);
      const deltaPct = base > 1e-9 ? ((stim - base) / base) * 100 : 0;
      setPerfDelta({ base, stim, deltaPct });
      setPerfDuration(dur);
      brainRef.current?.setActivations(stimResp.activations);
      console.log('[infer] ok', { T: stimResp.activations?.length, dt_ms: stimResp.dt_ms, base: base.toFixed(3), stim: stim.toFixed(3), deltaPct: deltaPct.toFixed(2) });
      setSimState('done');
    } catch (e) {
      const msg = String(e?.message || e);
      const friendly = /401/.test(msg) ? 'auth failed'
        : /Failed to fetch|NetworkError|CORS/i.test(msg) ? 'backend offline'
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

  // Apply protocol from agent: clears existing electrodes first (handled by
  // brainRef.applyProtocol), then places the agent's suggestion. Hero card
  // resets so user can re-Simulate against the new montage.
  const handleApplyProtocol = (electrodes) => {
    if (!Array.isArray(electrodes) || !electrodes.length) return;
    brainRef.current?.applyProtocol(electrodes);
    setPerfDelta(null);
    setPerfDuration(null);
    setSimState('idle');
    setSimError(null);
    brainRef.current?.clearActivations?.();
  };

  return (
    <div className="hf">
      <TitleBar onSimulate={handleSimulate} simState={simState} simError={simError} />
      <Toolbar mode={mode} setMode={setMode} task={task} setTask={setTask} simState={simState} />
      <AgentRail
        ailment={ailment} setAilment={setAilment}
        onSubmit={handleAgentSubmit}
        onApply={handleApplyProtocol}
        agentState={agentState}
        agentResult={agentResult}
        agentError={agentError}
      />
      <div style={{ position: 'relative', background: 'radial-gradient(ellipse at 30% 30%, #1a1c22 0%, #0a0b0d 70%)' }}>
        <HifiBrainViewport
          ref={brainRef}
          onHud={handleHud}
          onSelectionChange={setSelectedElectrode}
        />
        <ViewportOverlay hud={hud} perfDelta={perfDelta} warn={hudWarn} />
      </div>
      <Inspector
        selectedElectrode={selectedElectrode}
        electrodeCount={hud.electrodes}
        maxElectrodes={maxElectrodes}
        mode={mode}
        amp={amp} setAmp={setAmp}
        freqHz={freqHz} setFreqHz={setFreqHz}
        cortexOpacity={cortexOpacity} setCortexOpacity={setCortexOpacity}
        onViewStimJson={handleViewStimJson}
        onDelete={handleDeleteSelected}
        onFlipPolarity={handleFlipPolarity}
        simState={simState}
        simError={simError}
        perfDelta={perfDelta}
        perfDuration={perfDuration}
        taskLabel={taskLabel}
      />
      <Timeline
        mode={mode}
        amp={amp}
        freqHz={freqHz}
        onTick={handleTimelineTick}
        taskLabel={taskLabel}
        perfDelta={perfDelta}
      />
      <StimJsonModal json={stimJson} onClose={() => setStimJson(null)} />
    </div>
  );
};

window.HifiApp = HifiApp;
