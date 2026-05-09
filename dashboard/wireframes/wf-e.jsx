// Wireframe E — refined D: agent on LEFT rail, real three.js brain in viewport.
// Brain rendering = simplified version of the production spec:
//   - ellipsoid cortex (placeholder for atlas mesh)
//   - matcap-ish material, Fresnel alpha for translucent rim
//   - click-to-place electrodes: raycast → snap to surface, lock to normal, +2mm offset
//   - stim volume: soft translucent sphere at active electrode (placeholder for raymarched volume)
//   - RNN units: instanced spheres inside cortex; units inside stim volume highlight

const { useEffect, useRef, useState } = React;

// ---------- 3D Brain Viewport ----------
const BrainViewport = ({ onElectrodesChange }) => {
  const mountRef = useRef(null);
  const stateRef = useRef({});
  const [hud, setHud] = useState({ stimmed: 0, total: 200, peakE: 0.61 });

  useEffect(() => {
    const THREE = window.THREE;
    const mount = mountRef.current;
    if (!mount || !THREE) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;

    // --- renderer / scene / camera ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.cursor = 'crosshair';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 200);
    camera.position.set(2.6, 1.4, 3.4);
    camera.up.set(0, 1, 0);

    scene.add(new THREE.HemisphereLight(0xfff1d9, 0x303a55, 1.05));
    scene.add(new THREE.AmbientLight(0xffffff, 0.18));

    // --- cortex ellipsoid (placeholder for atlas mesh) ---
    const cortexGeo = new THREE.SphereGeometry(1, 96, 64);
    cortexGeo.scale(1.0, 0.85, 1.15);
    const cortexMat = new THREE.MeshStandardMaterial({
      color: 0xeadcc4, roughness: 0.8, metalness: 0.0,
      transparent: true, depthWrite: false,
    });
    // Fresnel α injection (simplified version of view_a_stage.js:519 trick)
    cortexMat.onBeforeCompile = (shader) => {
      shader.uniforms.uOpacityCenter = { value: 0.55 };
      shader.uniforms.uOpacityEdge = { value: 0.10 };
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
          uniform float uOpacityCenter;
          uniform float uOpacityEdge;`)
        .replace('#include <opaque_fragment>', `
          float fres = 1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition)));
          float alpha = mix(uOpacityCenter, uOpacityEdge, fres);
          gl_FragColor = vec4(outgoingLight, diffuseColor.a * alpha);
        `);
      cortexMat.userData.shader = shader;
    };
    const cortex = new THREE.Mesh(cortexGeo, cortexMat);
    scene.add(cortex);

    // central sulcus hint
    const sulcusGeo = new THREE.TorusGeometry(0.95, 0.004, 4, 80, Math.PI * 2);
    const sulcusMat = new THREE.MeshBasicMaterial({ color: 0x6a5a3a, transparent: true, opacity: 0.5 });
    const sulcus = new THREE.Mesh(sulcusGeo, sulcusMat);
    sulcus.rotation.y = Math.PI / 2;
    sulcus.scale.set(1, 0.85, 1);
    scene.add(sulcus);

    // --- RNN units (instanced) ---
    const N_UNITS = 200;
    const unitGeo = new THREE.SphereGeometry(0.025, 8, 6);
    const unitMat = new THREE.MeshBasicMaterial({ color: 0x4a4a4a });
    const units = new THREE.InstancedMesh(unitGeo, unitMat, N_UNITS);
    const unitPositions = [];
    const dummy = new THREE.Object3D();
    let seed = 11;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < N_UNITS; i++) {
      let x, y, z;
      do {
        x = rnd() * 2 - 1; y = rnd() * 2 - 1; z = rnd() * 2 - 1;
      } while (x*x/1.0 + y*y/0.72 + z*z/1.32 > 0.85);
      unitPositions.push(new THREE.Vector3(x, y, z));
      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      units.setMatrixAt(i, dummy.matrix);
      units.setColorAt(i, new THREE.Color(0x4a4a4a));
    }
    units.instanceMatrix.needsUpdate = true;
    if (units.instanceColor) units.instanceColor.needsUpdate = true;
    scene.add(units);

    // --- electrodes group ---
    const electrodesGroup = new THREE.Group();
    scene.add(electrodesGroup);
    const electrodes = [];   // {pos, normal, mesh, stimMesh}

    const STIM_RADIUS = 0.55;
    const placeElectrode = (point, normal) => {
      const pos = point.clone().add(normal.clone().multiplyScalar(0.018));  // ~2mm offset
      // electrode disk
      const eGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.025, 24);
      const eMat = new THREE.MeshStandardMaterial({ color: 0x2b6cb0, metalness: 0.4, roughness: 0.5 });
      const eMesh = new THREE.Mesh(eGeo, eMat);
      eMesh.position.copy(pos);
      eMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      electrodesGroup.add(eMesh);

      // halo ring
      const ringGeo = new THREE.RingGeometry(0.08, 0.10, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x2b6cb0, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      electrodesGroup.add(ring);

      // stim volume (soft sphere; placeholder for raymarched cloud)
      const stimGeo = new THREE.SphereGeometry(STIM_RADIUS, 32, 24);
      const stimMat = new THREE.MeshBasicMaterial({
        color: 0xd94f3a, transparent: true, opacity: 0.14, depthWrite: false,
      });
      const stim = new THREE.Mesh(stimGeo, stimMat);
      stim.position.copy(point);  // centered on cortex surface, intersecting brain
      electrodesGroup.add(stim);

      // inner hot core
      const coreGeo = new THREE.SphereGeometry(STIM_RADIUS * 0.55, 24, 18);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xf2b04a, transparent: true, opacity: 0.20, depthWrite: false,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.copy(point);
      electrodesGroup.add(core);

      electrodes.push({ pos, normal, point, mesh: eMesh, stim, core });
      recomputeStimmedUnits();
    };

    const recomputeStimmedUnits = () => {
      let stimmed = 0;
      const colorRed = new THREE.Color(0xd94f3a);
      const colorIdle = new THREE.Color(0x4a4a4a);
      for (let i = 0; i < N_UNITS; i++) {
        const p = unitPositions[i];
        let inside = false;
        let strength = 0;
        for (const e of electrodes) {
          const d = p.distanceTo(e.point);
          if (d < STIM_RADIUS) {
            inside = true;
            strength = Math.max(strength, 1 - d / STIM_RADIUS);
          }
        }
        if (inside) {
          stimmed++;
          const c = colorRed.clone().lerp(new THREE.Color(0xf2b04a), strength * 0.5);
          units.setColorAt(i, c);
        } else {
          units.setColorAt(i, colorIdle);
        }
      }
      if (units.instanceColor) units.instanceColor.needsUpdate = true;
      setHud(h => ({ ...h, stimmed, peakE: 0.61 + electrodes.length * 0.05 }));
      onElectrodesChange?.(electrodes.length);
    };

    // --- seed default electrodes (left + right DLPFC-ish) ---
    const seedElectrode = (theta, phi) => {
      // theta = around y, phi = up/down
      const r = 1.0;
      const x = r * Math.cos(phi) * Math.sin(theta);
      const y = r * Math.sin(phi);
      const z = r * Math.cos(phi) * Math.cos(theta);
      // surface point on ellipsoid (approximate via raycast)
      const dir = new THREE.Vector3(x, y * 0.85, z * 1.15).normalize();
      const ray = new THREE.Raycaster(new THREE.Vector3(0,0,0), dir);
      const hits = ray.intersectObject(cortex);
      if (hits[0]) placeElectrode(hits[0].point, hits[0].face.normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(cortex.matrixWorld)).normalize());
    };
    seedElectrode(-0.45, 0.55);  // F3
    seedElectrode( 0.45, 0.55);  // F4

    // --- raycast click to place ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObject(cortex);
      if (!hits.length) return;
      const n = hits[0].face.normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(cortex.matrixWorld)).normalize();
      placeElectrode(hits[0].point, n);
    };
    renderer.domElement.addEventListener('click', onClick);

    // --- orbit controls ---
    let isDown = false, lastX = 0, lastY = 0;
    let theta = 0.7, phi = 0.4, dist = 4.2;
    const updateCam = () => {
      camera.position.x = dist * Math.cos(phi) * Math.sin(theta);
      camera.position.y = dist * Math.sin(phi);
      camera.position.z = dist * Math.cos(phi) * Math.cos(theta);
      camera.lookAt(0, 0, 0);
    };
    updateCam();
    renderer.domElement.addEventListener('mousedown', (e) => { isDown = true; lastX = e.clientX; lastY = e.clientY; });
    window.addEventListener('mouseup', () => { isDown = false; });
    renderer.domElement.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      theta -= (e.clientX - lastX) * 0.008;
      phi = Math.max(-1.3, Math.min(1.3, phi + (e.clientY - lastY) * 0.008));
      lastX = e.clientX; lastY = e.clientY;
      updateCam();
    });
    renderer.domElement.addEventListener('wheel', (e) => {
      dist = Math.max(2.4, Math.min(8, dist + e.deltaY * 0.003));
      updateCam();
      e.preventDefault();
    }, { passive: false });

    // gentle auto-rotate when idle
    let lastInteract = Date.now();
    renderer.domElement.addEventListener('mousedown', () => { lastInteract = Date.now(); });
    renderer.domElement.addEventListener('wheel', () => { lastInteract = Date.now(); });

    // pulse stim opacity for tACS feel
    let t0 = performance.now();
    const animate = () => {
      const now = performance.now();
      const dt = (now - t0) / 1000;
      // pulsing
      electrodes.forEach((e, i) => {
        const pulse = 0.14 + 0.06 * Math.sin(dt * 3.0 + i);
        e.stim.material.opacity = pulse;
        e.core.material.opacity = pulse * 1.4;
      });
      // idle auto-orbit
      if (Date.now() - lastInteract > 3500) {
        theta += 0.0015;
        updateCam();
      }
      renderer.render(scene, camera);
      stateRef.current.raf = requestAnimationFrame(animate);
    };
    animate();

    // resize
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    stateRef.current = { renderer, scene, camera, electrodes, ro };
    return () => {
      cancelAnimationFrame(stateRef.current.raf);
      ro.disconnect();
      renderer.domElement.removeEventListener('click', onClick);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      cortexGeo.dispose();
      unitGeo.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, #f6f2e6 0%, #ece6d4 100%)' }}>
      {/* HUD overlays positioned absolutely */}
      <div style={{ position: 'absolute', top: 10, left: 10, pointerEvents: 'none' }}>
        <div style={{ background: 'rgba(250,250,246,0.85)', border: '1.5px solid var(--ink)', borderRadius: 4, padding: '4px 8px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-soft)' }}>
          ⤿ click cortex to place electrode · drag to orbit · scroll to zoom
        </div>
      </div>
      <div style={{ position: 'absolute', top: 10, right: 10, pointerEvents: 'none' }}>
        <div style={{ background: 'rgba(250,250,246,0.85)', border: '1.5px solid var(--ink)', borderRadius: 4, padding: '4px 8px', fontFamily: 'var(--mono)', fontSize: 10 }}>
          x → R · y ↑ sup · z ← ant
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, pointerEvents: 'none', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ background: 'rgba(250,250,246,0.9)', border: '1.5px solid var(--ink)', borderRadius: 4, padding: '6px 10px', display: 'flex', gap: 14, fontFamily: 'var(--mono)', fontSize: 10 }}>
          <span>units stimmed: <b style={{ color: 'var(--accent)' }}>{hud.stimmed}/{hud.total}</b></span>
          <span>peak |E|: <b style={{ color: 'var(--ink)' }}>{hud.peakE.toFixed(2)} V/m</b></span>
          <span>focality: <b style={{ color: 'var(--ink)' }}>{(0.34 + hud.stimmed * 0.001).toFixed(2)}</b></span>
        </div>
      </div>
    </div>
  );
};

// ---------- Wireframe E layout ----------
const WireframeE = () => {
  const [eCount, setECount] = useState(2);

  return (
    <div className="wf" style={{ display: 'grid', gridTemplateRows: '46px 36px 1fr 88px', gridTemplateColumns: '320px 1fr 280px' }}>
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
          <Label size="sm">working-memory · 200u</Label>
          <Mono>▾</Mono>
        </Box>
        <span style={{ width: 1, height: 20, background: 'var(--ink)', opacity: 0.2, margin: '0 6px' }} />
        <Chip variant="active">3D</Chip>
        <Chip>top</Chip>
        <Chip>L</Chip>
        <Chip>R</Chip>
        <div style={{ flex: 1 }} />
        <Mono style={{ color: 'var(--accent)' }}>⏺ live · {eCount} electrodes</Mono>
      </div>

      {/* LEFT — AGENT RAIL */}
      <div style={{ borderRight: '1.5px solid var(--ink)', background: 'var(--paper-2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1.5px dashed var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
          <Label size="md">protocol agent</Label>
          <Mono style={{ marginLeft: 'auto' }}>haiku · 14 papers</Mono>
        </div>

        <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto' }}>
          {/* user msg */}
          <div style={{ alignSelf: 'flex-end', maxWidth: '92%' }}>
            <Box className="thin" style={{ padding: 8, background: 'var(--ink)', color: 'var(--paper)', borderRadius: '10px 10px 2px 10px' }}>
              <Mono style={{ color: 'var(--paper)', display: 'block', lineHeight: 1.5 }}>
                58M, ADHD, working-memory deficits.<br/>n-back d' = 1.2 baseline. non-invasive options?
              </Mono>
            </Box>
          </div>

          {/* agent reasoning */}
          <Box className="thin" style={{ padding: 8, background: 'var(--paper)', borderRadius: '10px 10px 10px 2px' }}>
            <Mono style={{ display: 'block', lineHeight: 1.5 }}>
              <b style={{ color: 'var(--accent)' }}>reasoning ▾</b><br/>
              · pubmed "tACS working memory ADHD"<br/>
              · 11 hits, 2 RCTs (Reinhart '19, Vosskuhl '15)<br/>
              · θ-tACS DLPFC = strongest evidence<br/>
              · suggesting 3 montages...
            </Mono>
          </Box>

          {/* recommended protocol card */}
          <Box className="thick" style={{ padding: 10, background: 'var(--paper)', borderColor: 'var(--accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Chip variant="accent">recommended</Chip>
              <Label size="sm">θ-tACS DLPFC</Label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', rowGap: 2, columnGap: 6, marginTop: 6 }}>
              <Mono>anode</Mono><Mono style={{ color: 'var(--ink)' }}>F3</Mono>
              <Mono>cath.</Mono><Mono style={{ color: 'var(--ink)' }}>F4</Mono>
              <Mono>freq</Mono><Mono style={{ color: 'var(--ink)' }}>6 Hz · θ</Mono>
              <Mono>amp</Mono><Mono style={{ color: 'var(--ink)' }}>1.5 mA</Mono>
              <Mono>dur</Mono><Mono style={{ color: 'var(--ink)' }}>20 min × 10</Mono>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
              <Btn size="sm" variant="accent">↗ apply</Btn>
              <Btn size="sm">3 papers</Btn>
            </div>
          </Box>

          <Mono>2 alternatives ▾</Mono>
          <Box className="thin" style={{ padding: '6px 8px', background: 'var(--paper)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Label size="sm">anodal tDCS DLPFC</Label>
            <Mono style={{ marginLeft: 'auto' }}>0.62</Mono>
          </Box>
          <Box className="thin" style={{ padding: '6px 8px', background: 'var(--paper)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Label size="sm">TI focal hippocampus</Label>
            <Chip>exp</Chip>
            <Mono style={{ marginLeft: 'auto' }}>0.39</Mono>
          </Box>
        </div>

        {/* composer */}
        <div style={{ padding: 10, borderTop: '1.5px solid var(--ink)', background: 'var(--paper)' }}>
          <Box className="thin" style={{ padding: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Mono style={{ color: 'var(--ink-faint)', flex: 1 }}>refine: "what about gamma instead?"</Mono>
            <Btn size="sm" variant="primary">↗</Btn>
          </Box>
        </div>
      </div>

      {/* CENTER — REAL 3D BRAIN */}
      <div style={{ position: 'relative', borderRight: '1.5px solid var(--ink)' }}>
        <BrainViewport onElectrodesChange={setECount} />
      </div>

      {/* RIGHT INSPECTOR */}
      <div style={{ background: 'var(--paper-2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1.5px solid var(--ink)' }}>
          {['Inspect', 'Layers'].map((t, i) => (
            <div key={t} style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRight: i < 1 ? '1.5px solid var(--ink)' : 'none', background: i === 0 ? 'var(--paper)' : 'transparent' }}>
              <Label size="sm">{t}</Label>
            </div>
          ))}
        </div>

        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
          <div>
            <Mono>selected · F3</Mono>
            <Box className="thin" style={{ padding: 8, background: 'var(--paper)', marginTop: 4 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', rowGap: 3, columnGap: 6 }}>
                <Mono>role</Mono><Mono style={{ color: 'var(--ink)' }}>anode (+)</Mono>
                <Mono>amp</Mono><Mono style={{ color: 'var(--ink)' }}>+1.0 mA</Mono>
                <Mono>radius</Mono><Mono style={{ color: 'var(--ink)' }}>5.0 mm</Mono>
                <Mono>offset</Mono><Mono style={{ color: 'var(--ink)' }}>2.0 mm n̂</Mono>
              </div>
              <Slider value={0.5} label="amp ±2 mA" style={{ marginTop: 6 }} />
              <Slider value={0.25} label="radius" style={{ marginTop: 4 }} />
            </Box>
          </div>

          <Divider dashed />

          <div>
            <Mono>stim field</Mono>
            <Box className="thin" style={{ padding: 8, background: 'var(--paper)', marginTop: 4 }}>
              <Slider value={0.55} label="opacity" />
              <Slider value={0.3} label="iso 0.3 V/m" style={{ marginTop: 4 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <Mono>cmap</Mono>
                <span style={{ flex: 1, height: 8, background: 'linear-gradient(90deg, #2b6cb0, #d4a017, #d94f3a)', borderRadius: 2, border: '1px solid var(--ink)' }} />
              </div>
            </Box>
          </div>

          <Divider dashed />

          <div>
            <Mono>RNN units</Mono>
            <Box className="thin" style={{ padding: 8, background: 'var(--paper)', marginTop: 4 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', rowGap: 3 }}>
                <Mono>total</Mono><Mono style={{ color: 'var(--ink)' }}>200</Mono>
                <Mono>in volume</Mono><Mono style={{ color: 'var(--accent)' }}>live</Mono>
                <Mono>peak act</Mono><Mono style={{ color: 'var(--ink)' }}>0.91</Mono>
              </div>
            </Box>
          </div>

          <Divider dashed />

          <div>
            <Mono>render notes</Mono>
            <Box className="thin" style={{ padding: 8, background: 'var(--paper-2)', marginTop: 4 }}>
              <Mono style={{ display: 'block', lineHeight: 1.5, fontSize: 9 }}>
                · ellipsoid → atlas OBJ later<br/>
                · matcap + Fresnel α (rim trick)<br/>
                · raycast snap + normal lock<br/>
                · stim = soft sphere placeholder<br/>
                  ↳ swap for raymarched 3D-tex<br/>
                · units = instanced spheres<br/>
                · color = distance-weighted falloff
              </Mono>
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
          <Mono>task: n-back</Mono>
          <Chip variant="accent">d' +0.31</Chip>
        </div>
        <div style={{ position: 'relative', height: 36, border: '1.5px solid var(--ink)', borderRadius: 4, background: 'var(--paper-2)' }}>
          <div style={{ position: 'absolute', left: '15%', width: '45%', top: 4, bottom: 4, background: 'var(--accent)', opacity: 0.3, border: '1px solid var(--accent)', borderRadius: 2 }} />
          <div style={{ position: 'absolute', left: '15%', top: -2, fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--accent)' }}>tACS · 1.5mA · 6Hz · 9 min</div>
          {[10, 25, 38, 52, 68, 80].map(p => (
            <div key={p} style={{ position: 'absolute', left: `${p}%`, top: 4, bottom: 4, width: 1, background: 'var(--ink)', opacity: 0.5 }} />
          ))}
          <div style={{ position: 'absolute', left: '21%', top: -4, bottom: -4, width: 2, background: 'var(--ink)' }} />
        </div>
      </div>
    </div>
  );
};

window.WireframeE = WireframeE;
