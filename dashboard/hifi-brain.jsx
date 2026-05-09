// Hi-fi 3D brain viewport — polished version of the wf-e prototype.
// - cortex ellipsoid, matcap-style + Fresnel rim alpha
// - normal-locked electrodes via downward raycast
// - soft stim-volume sphere (placeholder for raymarched 3D-tex)
// - 200 instanced RNN units; units inside volume colored by falloff
// - subtle pulse, idle auto-orbit, drag/scroll camera
// Exports BrainViewport and live HUD callback.

const { useEffect, useRef, useState, useImperativeHandle, forwardRef } = React;

const HifiBrainViewport = forwardRef(({ onHud, accent = '#e85a3c', accent2 = '#f2b04a', electrodeColor = '#5ba3ff' }, ref) => {
  const mountRef = useRef(null);
  const apiRef = useRef({});

  useEffect(() => {
    const THREE = window.THREE;
    const mount = mountRef.current;
    if (!mount || !THREE) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.cursor = 'crosshair';
    renderer.domElement.style.display = 'block';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 200);
    camera.up.set(0, 1, 0);

    // dramatic studio lighting
    scene.add(new THREE.HemisphereLight(0xfff1d9, 0x1a1d28, 0.65));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(3, 4, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff9a72, 0.6);
    rim.position.set(-4, 1, -3);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x9ec3ff, 0.35);
    fill.position.set(2, -2, -2);
    scene.add(fill);

    // --- cortex (real brain mesh, async-loaded from assets/brain.json) ---
    const cortexMat = new THREE.MeshPhysicalMaterial({
      color: 0xb6927a,
      roughness: 0.55,
      metalness: 0.0,
      sheen: 0.5,
      sheenColor: 0xffaa88,
      sheenRoughness: 0.6,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
    });
    let cortexUniforms = null;
    cortexMat.onBeforeCompile = (shader) => {
      shader.uniforms.uOpacityCenter = { value: 0.62 };
      shader.uniforms.uOpacityEdge = { value: 0.05 };
      cortexUniforms = shader.uniforms;
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
          uniform float uOpacityCenter;
          uniform float uOpacityEdge;`)
        .replace('#include <opaque_fragment>', `
          float fres = 1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition)));
          fres = pow(fres, 1.4);
          float alpha = mix(uOpacityCenter, uOpacityEdge, fres);
          gl_FragColor = vec4(outgoingLight, diffuseColor.a * alpha);
        `);
    };
    // placeholder shown for ~100-300ms while brain.json fetches
    const placeholderGeo = new THREE.SphereGeometry(0.6, 32, 24);
    const cortex = new THREE.Mesh(placeholderGeo, cortexMat);
    scene.add(cortex);

    const cortexBack = new THREE.Mesh(
      placeholderGeo.clone(),
      new THREE.MeshBasicMaterial({ color: 0x2a1f1a, transparent: true, opacity: 0.18, side: THREE.BackSide, depthWrite: false })
    );
    scene.add(cortexBack);

    // central sulcus
    const sulcusMat = new THREE.LineBasicMaterial({ color: 0x6a4a3a, transparent: true, opacity: 0.45 });
    const sulcusPts = [];
    for (let i = 0; i <= 64; i++) {
      const t = (i / 64) * Math.PI;
      sulcusPts.push(new THREE.Vector3(0, Math.cos(t) * 0.85, Math.sin(t) * 1.18));
    }
    const sulcus = new THREE.Line(new THREE.BufferGeometry().setFromPoints(sulcusPts), sulcusMat);
    scene.add(sulcus);

    // --- RNN units = 68 aparc region centroids, in MNI mm * MNI_SCALE ---
    // The brain mesh ships in MNI152 mm coords (BrainMesh_ICBM152). At load time
    // the JS computes a single uniform MNI_SCALE = TARGET_EXTENT / max_extent_mm
    // and applies it to BOTH the mesh vertices AND the aparc centroids. One
    // affine, no axis swap, identity rotation. MNI right-handed: +X right,
    // +Y anterior, +Z superior. Three.js scene reads it the same way.
    let MNI_SCALE = 1 / 87;  // initial guess (87 mm ≈ half of 174 mm AP extent);
                              // gets re-set when brain.json finishes loading.
    const TARGET_EXTENT = 2.0;  // mesh longest axis in dashboard units after scale
    const aparc = (typeof window !== 'undefined' && window.APARC_CENTROIDS) || [];
    if (aparc.length !== 68) {
      console.warn('[brain] expected 68 aparc centroids, got', aparc.length);
    }
    const N_UNITS = aparc.length || 1;
    const unitGeo = new THREE.SphereGeometry(0.028, 12, 10);
    const unitMat = new THREE.MeshBasicMaterial({ color: 0x6a6e76 });
    const units = new THREE.InstancedMesh(unitGeo, unitMat, N_UNITS);
    const unitPositions = [];
    const unitLabels = [];
    const dummy = new THREE.Object3D();
    const placeUnits = () => {
      for (let i = 0; i < N_UNITS; i++) {
        const r = aparc[i] || { label: `R${i}`, mni: [0, 0, 0] };
        const [mx, my, mz] = r.mni;
        const p = new THREE.Vector3(mx * MNI_SCALE, mz * MNI_SCALE, my * MNI_SCALE);
        unitPositions[i] = p;
        unitLabels[i] = r.label;
        dummy.position.copy(p);
        dummy.scale.setScalar(1.0);
        dummy.updateMatrix();
        units.setMatrixAt(i, dummy.matrix);
        units.setColorAt(i, new THREE.Color(0x5a5e66));
      }
      units.instanceMatrix.needsUpdate = true;
      if (units.instanceColor) units.instanceColor.needsUpdate = true;
    };
    placeUnits();
    scene.add(units);
    // sanity probe — visual cortex (pericalcarine) should sit at the back of the
    // brain (-Y in MNI, so -Y in mesh); frontal pole at the front (+Y).
    const logProbes = () => {
      const probe = ['L_pericalcarine', 'L_frontalpole', 'L_precentral'];
      probe.forEach((name) => {
        const idx = unitLabels.indexOf(name);
        if (idx >= 0) {
          const p = unitPositions[idx];
          console.log(`[aparc] ${name} mesh=(${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)})`);
        }
      });
    };
    if (aparc.length) {
      logProbes();
    }

    // --- electrodes ---
    const electrodesGroup = new THREE.Group();
    scene.add(electrodesGroup);
    const electrodes = [];
    const STIM_RADIUS = 0.55;

    const accentCol = new THREE.Color(accent);
    const accent2Col = new THREE.Color(accent2);
    const electrodeCol = new THREE.Color(electrodeColor);
    const idleCol = new THREE.Color(0x5a5e66);

    const placeElectrode = (point, normal, label) => {
      const offset = normal.clone().multiplyScalar(0.022);
      const pos = point.clone().add(offset);

      // electrode body (low cylinder)
      const eGeo = new THREE.CylinderGeometry(0.075, 0.085, 0.03, 32);
      const eMat = new THREE.MeshStandardMaterial({
        color: electrodeCol, metalness: 0.6, roughness: 0.3,
        emissive: electrodeCol, emissiveIntensity: 0.15,
      });
      const eMesh = new THREE.Mesh(eGeo, eMat);
      eMesh.position.copy(pos);
      eMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      electrodesGroup.add(eMesh);

      // stem post above
      const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.10, 12);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x1a1c20, metalness: 0.7, roughness: 0.4 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.copy(pos.clone().add(normal.clone().multiplyScalar(0.06)));
      stem.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      electrodesGroup.add(stem);

      // halo ring on surface
      const ringGeo = new THREE.RingGeometry(0.085, 0.105, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: electrodeCol, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      electrodesGroup.add(ring);

      // stim volume — outer falloff
      const stimGeo = new THREE.SphereGeometry(STIM_RADIUS, 48, 36);
      const stimMat = new THREE.MeshBasicMaterial({
        color: accentCol, transparent: true, opacity: 0.10, depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const stim = new THREE.Mesh(stimGeo, stimMat);
      stim.position.copy(point);
      electrodesGroup.add(stim);

      // mid shell
      const midGeo = new THREE.SphereGeometry(STIM_RADIUS * 0.7, 36, 28);
      const midMat = new THREE.MeshBasicMaterial({
        color: accentCol, transparent: true, opacity: 0.16, depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mid = new THREE.Mesh(midGeo, midMat);
      mid.position.copy(point);
      electrodesGroup.add(mid);

      // hot core
      const coreGeo = new THREE.SphereGeometry(STIM_RADIUS * 0.4, 24, 20);
      const coreMat = new THREE.MeshBasicMaterial({
        color: accent2Col, transparent: true, opacity: 0.28, depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.copy(point);
      electrodesGroup.add(core);

      electrodes.push({ pos, normal, point, mesh: eMesh, ring, stim, mid, core, label });
      recompute();
      return electrodes.length - 1;
    };

    const recompute = () => {
      let stimmed = 0;
      let totalStrength = 0;
      for (let i = 0; i < N_UNITS; i++) {
        const p = unitPositions[i];
        let strength = 0;
        for (const e of electrodes) {
          const d = p.distanceTo(e.point);
          if (d < STIM_RADIUS) {
            const s = 1 - d / STIM_RADIUS;
            strength = Math.max(strength, s);
          }
        }
        if (strength > 0.05) {
          stimmed++;
          totalStrength += strength;
          const c = new THREE.Color(0x5a5e66).lerp(accentCol, Math.min(1, 0.4 + strength * 0.7));
          if (strength > 0.5) c.lerp(accent2Col, (strength - 0.5) * 1.2);
          units.setColorAt(i, c);
          // grow stimmed units slightly
          units.getMatrixAt(i, dummy.matrix);
          dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
          // skip rescaling here; one-shot at place time would compound
        } else {
          units.setColorAt(i, idleCol);
        }
      }
      if (units.instanceColor) units.instanceColor.needsUpdate = true;
      onHud?.({
        stimmed, total: N_UNITS,
        peakE: 0.0 + electrodes.length * 0.32 + Math.random() * 0.05,
        focality: electrodes.length === 0 ? 0 : Math.min(1, totalStrength / (electrodes.length * N_UNITS * 0.15)),
        electrodes: electrodes.length,
      });
    };

    // seed default electrodes (F3 + F4)
    const seed1 = (theta, phi, label) => {
      const dir = new THREE.Vector3(
        Math.cos(phi) * Math.sin(theta),
        Math.sin(phi) * 0.85,
        Math.cos(phi) * Math.cos(theta) * 1.18,
      ).normalize();
      // cast from outside inward so FrontSide intersect actually hits
      const start = dir.clone().multiplyScalar(3);
      const ray = new THREE.Raycaster(start, dir.clone().negate());
      const hits = ray.intersectObject(cortex);
      if (hits[0]) {
        const n = hits[0].face.normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(cortex.matrixWorld)).normalize();
        placeElectrode(hits[0].point, n, label);
      }
    };
    // load real cortex async; seed defaults once it's in. Until then the
    // placeholder sphere is the raycast target.
    let disposed = false;
    fetch('assets/brain.json')
      .then((r) => {
        if (!r.ok) throw new Error(`brain.json HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (disposed) return;
        // brain.json ships in MNI152 mm: +X right, +Y anterior, +Z superior.
        // Three.js scene is Y-up. Two transforms applied identically to the
        // mesh and to all aparc centroids:
        //   1. Y<->Z swap so MNI_z (IS) ends up as three.js +y (up) and
        //      MNI_y (AP) ends up as three.js +z (depth).
        //   2. Uniform MNI_SCALE so the longest axis fills TARGET_EXTENT.
        // The swap is a reflection (det = -1), so face winding is reversed
        // to keep outward normals outward.
        const src = data.positions;
        let xMin = +Infinity, xMax = -Infinity;
        let yMin = +Infinity, yMax = -Infinity;
        let zMin = +Infinity, zMax = -Infinity;
        for (let i = 0; i < src.length; i += 3) {
          const x = src[i], y = src[i+1], z = src[i+2];
          if (x < xMin) xMin = x; if (x > xMax) xMax = x;
          if (y < yMin) yMin = y; if (y > yMax) yMax = y;
          if (z < zMin) zMin = z; if (z > zMax) zMax = z;
        }
        const longestExtent = Math.max(xMax - xMin, yMax - yMin, zMax - zMin);
        MNI_SCALE = TARGET_EXTENT / longestExtent;
        console.log(`[brain] MNI bbox mm: x=[${xMin.toFixed(1)},${xMax.toFixed(1)}] y=[${yMin.toFixed(1)},${yMax.toFixed(1)}] z=[${zMin.toFixed(1)},${zMax.toFixed(1)}]`);
        console.log(`[brain] MNI_SCALE = ${MNI_SCALE.toFixed(5)} (longest extent ${longestExtent.toFixed(1)} mm -> ${TARGET_EXTENT.toFixed(2)} units)`);

        const positions = new Float32Array(src.length);
        const normSrc = data.normals;
        const normals = new Float32Array(normSrc.length);
        for (let i = 0; i < src.length; i += 3) {
          // (x, y, z) -> (x, z, y) * MNI_SCALE
          positions[i]   = src[i]   * MNI_SCALE;
          positions[i+1] = src[i+2] * MNI_SCALE;
          positions[i+2] = src[i+1] * MNI_SCALE;
          // same swap for normals; magnitudes preserved
          normals[i]   = normSrc[i];
          normals[i+1] = normSrc[i+2];
          normals[i+2] = normSrc[i+1];
        }
        // reverse face winding to compensate for the reflection
        const idxSrc = data.indices;
        const indices = new Uint32Array(idxSrc.length);
        for (let i = 0; i < idxSrc.length; i += 3) {
          indices[i]   = idxSrc[i];
          indices[i+1] = idxSrc[i+2];
          indices[i+2] = idxSrc[i+1];
        }

        const realGeo = new THREE.BufferGeometry();
        realGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        realGeo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        realGeo.setIndex(new THREE.BufferAttribute(indices, 1));
        realGeo.computeBoundingBox();
        realGeo.computeBoundingSphere();

        cortex.geometry.dispose();
        cortex.geometry = realGeo;
        cortexBack.geometry.dispose();
        cortexBack.geometry = realGeo.clone();

        // re-place aparc units now that MNI_SCALE is locked in
        placeUnits();
        logProbes();

        seed1(-0.55, 0.55, 'F3');
        seed1( 0.55, 0.55, 'F4');
      })
      .catch((err) => {
        console.warn('[brain] mesh load failed; staying on placeholder:', err);
        if (disposed) return;
        seed1(-0.55, 0.55, 'F3');
        seed1( 0.55, 0.55, 'F4');
      });

    // expose API
    apiRef.current = {
      addProtocol() {
        // clear and apply a 4-electrode bilateral set
        while (electrodesGroup.children.length) {
          const c = electrodesGroup.children[0];
          electrodesGroup.remove(c);
          if (c.geometry) c.geometry.dispose();
          if (c.material) c.material.dispose();
        }
        electrodes.length = 0;
        seed1(-0.55, 0.55, 'F3');
        seed1( 0.55, 0.55, 'F4');
        seed1(-0.85, 0.05, 'T7');
        seed1( 0.85, 0.05, 'T8');
      },
      setCortexOpacity(v) {
        v = Math.max(0, Math.min(1, v));
        if (cortexUniforms && cortexUniforms.uOpacityCenter) {
          cortexUniforms.uOpacityCenter.value = v;
          cortexUniforms.uOpacityEdge.value = Math.max(0, v - 0.45);
        }
        const opaque = v >= 0.999;
        if (cortexMat.transparent === opaque) {
          cortexMat.transparent = !opaque;
          cortexMat.depthWrite = opaque;
          cortexMat.needsUpdate = true;
        }
      },
      getStimJson(task, mode, ampMA, freqHz) {
        const T = 200, dt_ms = 20;
        const N = unitPositions.length;
        const eps = 0.05;  // mesh units, ~5 mm equivalent at this scale
        const k = 1.0;     // placeholder coupling; the V/m scale is symbolic for now
        const baseField = new Array(N).fill(0);
        for (let i = 0; i < N; i++) {
          const p = unitPositions[i];
          let f = 0;
          for (const e of electrodes) {
            const dx = p.x - e.point.x, dy = p.y - e.point.y, dz = p.z - e.point.z;
            const d2 = Math.max(dx*dx + dy*dy + dz*dz, eps*eps);
            f += (ampMA * k) / d2;
          }
          baseField[i] = f;
        }
        const field_per_region = new Array(T);
        for (let t = 0; t < T; t++) {
          const tSec = (t * dt_ms) / 1000;
          const mod = mode === 'tACS' ? Math.sin(2 * Math.PI * freqHz * tSec) : 1.0;
          const row = new Array(N);
          for (let i = 0; i < N; i++) row[i] = baseField[i] * mod;
          field_per_region[t] = row;
        }
        return {
          task,
          modality: mode,
          freq_Hz: mode === 'tACS' ? freqHz : null,
          dt_ms,
          T,
          n_regions: N,
          region_labels: unitLabels.slice(),
          field_per_region,
        };
      },
      reset() {
        while (electrodesGroup.children.length) {
          const c = electrodesGroup.children[0];
          electrodesGroup.remove(c);
          if (c.geometry) c.geometry.dispose();
          if (c.material) c.material.dispose();
        }
        electrodes.length = 0;
        recompute();
      },
    };
    if (ref) {
      if (typeof ref === 'function') ref(apiRef.current);
      else ref.current = apiRef.current;
    }

    // raycast click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let mouseDownPos = null;
    renderer.domElement.addEventListener('mousedown', (e) => {
      mouseDownPos = { x: e.clientX, y: e.clientY };
    });
    renderer.domElement.addEventListener('mouseup', (e) => {
      if (!mouseDownPos) return;
      const dx = e.clientX - mouseDownPos.x, dy = e.clientY - mouseDownPos.y;
      mouseDownPos = null;
      if (Math.hypot(dx, dy) > 4) return; // drag, not click
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObject(cortex);
      if (!hits.length) return;
      const n = hits[0].face.normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(cortex.matrixWorld)).normalize();
      placeElectrode(hits[0].point, n, `E${electrodes.length + 1}`);
      lastInteract = Date.now();
    });

    // orbit
    let isDown = false, lastX = 0, lastY = 0;
    let theta = 0.65, phi = 0.25, dist = 4.4;
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
      dist = Math.max(2.6, Math.min(8, dist + e.deltaY * 0.003));
      updateCam();
      e.preventDefault();
    }, { passive: false });

    let lastInteract = Date.now();
    renderer.domElement.addEventListener('mousedown', () => { lastInteract = Date.now(); });
    renderer.domElement.addEventListener('wheel', () => { lastInteract = Date.now(); });

    // animate
    let raf;
    const t0 = performance.now();
    const animate = () => {
      const now = performance.now();
      const dt = (now - t0) / 1000;
      electrodes.forEach((e, i) => {
        const pulse = 0.10 + 0.04 * Math.sin(dt * 3.5 + i * 0.7);
        e.stim.material.opacity = pulse;
        e.mid.material.opacity = pulse * 1.6;
        e.core.material.opacity = 0.20 + 0.10 * Math.sin(dt * 3.5 + i * 0.7);
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth, h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      cortex.geometry.dispose();
      cortexBack.geometry.dispose();
      unitGeo.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />;
});

window.HifiBrainViewport = HifiBrainViewport;
