// Shared sketchy primitives for all wireframes
// Loaded after React; exports to window.

const Box = ({ children, className = '', style = {}, ...rest }) => (
  <div className={`box ${className}`} style={style} {...rest}>{children}</div>
);

const Label = ({ children, size = 'md', className = '', style = {} }) => (
  <span className={`label label-${size} ${className}`} style={style}>{children}</span>
);

const Mono = ({ children, style = {}, className = '' }) => (
  <span className={`mono ${className}`} style={style}>{children}</span>
);

const Btn = ({ children, variant = '', size = '', style = {} }) => (
  <span className={`btn ${variant} ${size}`} style={style}>{children}</span>
);

const Chip = ({ children, variant = '', style = {} }) => (
  <span className={`chip ${variant}`} style={style}>{children}</span>
);

const Divider = ({ dashed = false, style = {} }) => (
  <div className={`divider ${dashed ? 'dashed' : ''}`} style={style} />
);

const Slider = ({ value = 0.4, label, style = {} }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, ...style }}>
    {label && <Mono>{label}</Mono>}
    <div className="slider">
      <div className="track" />
      <div className="knob" style={{ left: `calc(${value * 100}% - 7px)` }} />
    </div>
  </div>
);

// A scribbly brain top-down silhouette
const BrainBlob = ({ size = 280, electrodes = [], stim = null, units = 80, showUnits = true, showStim = true, accentHue = 'accent' }) => {
  const accentColor = accentHue === 'accent' ? 'var(--accent)' : accentHue === 'accent-2' ? 'var(--accent-2)' : 'var(--accent-3)';
  // pseudo-random unit positions inside the blob
  const unitDots = React.useMemo(() => {
    const pts = [];
    let seed = 7;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < units; i++) {
      // ellipse rejection sample
      let x, y, r;
      do {
        x = rnd() * 2 - 1;
        y = rnd() * 2 - 1;
        r = (x * x) / 0.85 + (y * y) / 1.0;
      } while (r > 0.85);
      // jitter into "lobed" zones
      pts.push({ x: 50 + x * 38, y: 50 + y * 42, stim: stim ? Math.hypot(x - stim.x, y - stim.y) < stim.r : false });
    }
    return pts;
  }, [units, stim?.x, stim?.y, stim?.r]);

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id="rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="0.6" />
        </filter>
      </defs>
      {/* brain outline — two hemispheres */}
      <g filter="url(#rough)" fill="none" stroke="var(--ink)" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 50 8
                 C 28 8, 12 22, 12 45
                 C 12 68, 26 88, 50 92
                 C 74 88, 88 68, 88 45
                 C 88 22, 72 8, 50 8 Z" fill="var(--paper-2)" fillOpacity="0.5" />
        {/* central sulcus */}
        <path d="M 50 10 L 50 92" strokeDasharray="1.5 1.5" opacity="0.6" />
        {/* squiggly gyri lines */}
        <path d="M 22 30 q 6 -4 12 0 q 6 4 12 0" opacity="0.4" />
        <path d="M 22 50 q 6 -4 12 0 q 6 4 12 0" opacity="0.4" />
        <path d="M 22 70 q 6 -4 12 0 q 6 4 12 0" opacity="0.4" />
        <path d="M 54 30 q 6 -4 12 0 q 6 4 12 0" opacity="0.4" />
        <path d="M 54 50 q 6 -4 12 0 q 6 4 12 0" opacity="0.4" />
        <path d="M 54 70 q 6 -4 12 0 q 6 4 12 0" opacity="0.4" />
      </g>

      {/* RNN units */}
      {showUnits && unitDots.map((p, i) => (
        <circle
          key={i}
          cx={p.x} cy={p.y}
          r={p.stim ? 1.0 : 0.6}
          fill={p.stim ? accentColor : 'var(--ink-soft)'}
          opacity={p.stim ? 1 : 0.5}
        />
      ))}

      {/* stim volume */}
      {showStim && stim && (
        <>
          <circle
            cx={50 + stim.x * 38}
            cy={50 + stim.y * 42}
            r={stim.r * 38}
            fill={accentColor}
            opacity="0.18"
          />
          <circle
            cx={50 + stim.x * 38}
            cy={50 + stim.y * 42}
            r={stim.r * 38}
            fill="none"
            stroke={accentColor}
            strokeWidth="0.4"
            strokeDasharray="1 1"
          />
          <circle
            cx={50 + stim.x * 38}
            cy={50 + stim.y * 42}
            r={stim.r * 24}
            fill={accentColor}
            opacity="0.22"
          />
        </>
      )}

      {/* electrodes */}
      {electrodes.map((e, i) => (
        <g key={i}>
          <circle cx={50 + e.x * 38} cy={50 + e.y * 42} r="2.2" fill="var(--accent-2)" stroke="var(--ink)" strokeWidth="0.4" />
          <circle cx={50 + e.x * 38} cy={50 + e.y * 42} r="3.5" fill="none" stroke="var(--accent-2)" strokeWidth="0.3" opacity="0.5" />
          {e.label && (
            <text x={50 + e.x * 38} y={50 + e.y * 42 - 4} fontSize="3" fontFamily="JetBrains Mono" textAnchor="middle" fill="var(--ink)">{e.label}</text>
          )}
        </g>
      ))}
    </svg>
  );
};

// Annotation arrow pointing to something
const Annotation = ({ text, style = {}, arrow = 'right' }) => (
  <div className="annotation" style={style}>
    <span style={{ fontFamily: 'var(--hand)' }}>{text}</span>
  </div>
);

// Sketchy arrow SVG
const Arrow = ({ from, to, curve = 0.3, color = 'var(--accent)', dashed = false }) => {
  const mx = (from.x + to.x) / 2 + (to.y - from.y) * curve;
  const my = (from.y + to.y) / 2 - (to.x - from.x) * curve;
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <path
        d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={dashed ? '4 3' : 'none'}
        markerEnd="url(#arr)"
      />
    </svg>
  );
};

Object.assign(window, { Box, Label, Mono, Btn, Chip, Divider, Slider, BrainBlob, Annotation, Arrow });
