/**
 * The Secret of Stubitone™ — 6 Bespoke Per-Scene 60 FPS Living Graphic-Novel Engines
 *
 * ZERO repeated copy-paste effects across scenes — each diorama has its own unique,
 * historically & artistically tailored moving atmosphere:
 *
 *  1. `cover` (LucasArts Splash):
 *     - Jagged forked storm-cloud lightning bolts + glowing golden cutlass-quill stardust trail
 *       + Viking dragon-prow tidal wake ripples. (Zero flies!)
 *  2. `swamp` (Bennet Luvet in Gosport Salt-Marsh — THE exclusive home of grotty muck!):
 *     - Buzzing figure-eight turnip dung-flies + wriggling pink turnip worm + rising green
 *       marsh-gas bubbles ("bloop... pop!") + driving sideways coastal squall + blinking/snapping seagull!
 *  3. `fareham_mills` (Reeve Odo on Fareham Creek & Wallington River):
 *     - Flowing S-curve silver river current streaks + rotating timber millwheel paddles & white-water spray
 *       + nervous blue cartoon sweat-drops dripping down Odo's temples + sacred golden pulse on
 *       St Swithin's bone casket + snorting pig breath & rustling oak leaves + sneaky wiggling turnip tuft!
 *  4. `assize` (Torch-Lit Winchester / Hampshire Royal Assize Hall):
 *     - Slanted arched-window moonbeams + floating parchment dust-motes + twinkling silver coin glints
 *       on Sheriff Hugh's stack + twin stone-wall sconce flames & sparks. (Zero rain, zero flies!)
 *  5. `stubbington_hut` (Inside Edith's Stubbington Cottage #3):
 *     - Bubbling cauldron pottage stew + soup droplet dripping off Edith's ladle + crackling floor hearth
 *       & spiralling grey woodsmoke + bobbing rafter hens + outdoor roof-thatch rain drips & sneaky turnip tuft!
 *  6. `servi_plough` (Dignified Dawn Plough-Team in Fareham):
 *     - Fanning pale-gold sunrise rays + slow-rolling valley mist + rhythmic 4-second oxen nostril breath
 *       plumes + peaceful dawn rooks gliding across the upper sky.
 */

export function mountLivingDioramaFX(containerEl, presetKey = 'cover') {
  if (!containerEl || typeof window === 'undefined') {
    return { burst() {}, triggerHintShimmer() {}, destroy() {} };
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'domesday-fx-canvas';
  canvas.style.cssText =
    'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3;';
  containerEl.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = 640;
  let height = 360;
  let rafId = 0;
  let lastTs = 0;
  let destroyed = false;
  let isOffscreen = false;
  let wheelBoost = 0;
  let gullSquawkTimer = 0;
  let cachedQuillGlow = null;
  let cachedAssizeBeam = null;

  const reducedMotionQuery =
    typeof window !== 'undefined' ? window.matchMedia?.('(prefers-reduced-motion: reduce)') : null;

  // Scene-specific state pools
  let lightningBolt = null;
  let nextBoltAt = performance.now() + 2400;

  const quillSparks = Array.from({ length: 18 }, () => ({
    prog: Math.random(),
    ang: Math.random() * Math.PI * 2,
    dist: 6 + Math.random() * 28,
    r: 1 + Math.random() * 2.2,
  }));

  const squallDrops = Array.from({ length: presetKey === 'swamp' ? 75 : 0 }, () => ({
    x: Math.random(),
    y: Math.random(),
    len: 12 + Math.random() * 15,
    spd: 0.018 + Math.random() * 0.012,
  }));

  const marshBubbles = Array.from({ length: presetKey === 'swamp' ? 9 : 0 }, () => ({
    rx: 0.28 + Math.random() * 0.48,
    ry: 0.8 + Math.random() * 0.16,
    prog: Math.random(),
    spd: 0.005 + Math.random() * 0.005,
    maxR: 4 + Math.random() * 6,
  }));

  const riverCurrents = Array.from({ length: presetKey === 'fareham_mills' ? 16 : 0 }, (_, i) => ({
    prog: i / 16,
    lane: (Math.random() - 0.5) * 0.06,
    spd: 0.0032 + Math.random() * 0.0018,
  }));

  const hallMotes = Array.from({ length: presetKey === 'assize' ? 32 : 0 }, () => ({
    x: 0.55 + Math.random() * 0.42,
    y: 0.12 + Math.random() * 0.72,
    vx: -0.0003 - Math.random() * 0.0004,
    vy: 0.0002 + Math.random() * 0.0004,
    r: 1 + Math.random() * 1.8,
  }));

  const coinGlints = [
    { x: 75.5, y: 50.8, phase: 0.2 },
    { x: 79.2, y: 51.4, phase: 1.9 },
    { x: 81.8, y: 52.0, phase: 3.7 },
    { x: 71.2, y: 50.2, phase: 5.1 },
  ];

  const smokePuffs = Array.from({ length: presetKey === 'stubbington_hut' ? 16 : 0 }, (_, i) => ({
    prog: i / 16,
    sway: Math.random() * Math.PI * 2,
  }));

  const eavesDrips = Array.from({ length: presetKey === 'stubbington_hut' ? 14 : 0 }, () => ({
    x: 0.84 + Math.random() * 0.15,
    y: Math.random(),
    spd: 0.016 + Math.random() * 0.01,
  }));

  const dawnBirds = Array.from({ length: presetKey === 'servi_plough' ? 5 : 0 }, (_, i) => ({
    x: 0.08 + i * 0.14,
    y: 0.11 + (i % 3) * 0.035,
    spd: 0.00045 + (i % 2) * 0.00018,
    phase: i * 1.3,
  }));

  const bursts = [];

  function rebuildCachedGradients() {
    if (presetKey === 'cover') {
      const qx = 0.662 * width;
      const qy = 0.245 * height;
      const g = ctx.createRadialGradient(qx, qy, 2, qx, qy, width * 0.09);
      g.addColorStop(0, 'rgba(254, 240, 138, 0.42)');
      g.addColorStop(1, 'rgba(254, 240, 138, 0)');
      cachedQuillGlow = g;
    } else if (presetKey === 'assize') {
      const bg = ctx.createLinearGradient(width * 0.9, height * 0.12, width * 0.58, height * 0.72);
      bg.addColorStop(0, 'rgba(186, 230, 253, 0.16)');
      bg.addColorStop(1, 'rgba(186, 230, 253, 0)');
      cachedAssizeBeam = bg;
    }
  }

  function syncSize() {
    if (!containerEl.isConnected) return;
    const rect = containerEl.getBoundingClientRect();
    if (rect.width > 20 && rect.height > 20) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuildCachedGradients();
    }
  }

  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncSize) : null;
  ro?.observe(containerEl);
  syncSize();

  const imgEl = containerEl.querySelector('.domesday-diorama-img');
  const onPointerMove = (e) => {
    if (!imgEl || reducedMotionQuery?.matches) return;
    const rect = containerEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    imgEl.style.transform = `scale(1.024) translate(${(-nx * 6).toFixed(1)}px, ${(-ny * 4).toFixed(1)}px)`;
  };
  containerEl.addEventListener('pointermove', onPointerMove, { passive: true });

  function drawTorchFlame(txPct, tyPct, scale, t, seed = 0) {
    const tx = (txPct / 100) * width;
    const ty = (tyPct / 100) * height;
    const flick = 0.88 + Math.sin(t * 12 + seed) * 0.1 + Math.cos(t * 19 + seed) * 0.05;
    const haloR = Math.max(36, width * 0.1 * scale) * flick;
    const g = ctx.createRadialGradient(tx, ty, 2, tx, ty, haloR);
    g.addColorStop(0, 'rgba(251, 191, 36, 0.38)');
    g.addColorStop(0.5, 'rgba(234, 88, 12, 0.14)');
    g.addColorStop(1, 'rgba(234, 88, 12, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(tx, ty, haloR, 0, Math.PI * 2);
    ctx.fill();

    for (let k = 0; k < 3; k++) {
      const sway = Math.sin(t * (8 + k * 3) + k + seed) * 4.5 * scale;
      const fh = (15 + k * 5) * scale * flick;
      const fw = (8 - k * 1.8) * scale;
      ctx.fillStyle =
        k === 2 ? 'rgba(254, 249, 195, 0.8)' : k === 1 ? 'rgba(251, 191, 36, 0.62)' : 'rgba(234, 88, 12, 0.45)';
      ctx.beginPath();
      ctx.moveTo(tx - fw, ty + 3);
      ctx.quadraticCurveTo(tx + sway, ty - fh, tx + fw, ty + 3);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawSneakyBennetTurnipTuft(xPct, yPct, t) {
    // Subtle cheeky wiggling green turnip-leaf tuft for keen-eyed Year 7 cameo hunters!
    const bx = (xPct / 100) * width;
    const by = (yPct / 100) * height;
    const wiggle = Math.sin(t * 3.2) * 0.18 + (Math.sin(t * 0.9) > 0.85 ? Math.sin(t * 22) * 0.25 : 0);
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(wiggle);
    [-0.38, 0, 0.38].forEach((a, i) => {
      ctx.save();
      ctx.rotate(a);
      ctx.fillStyle = i === 1 ? '#65a30d' : '#4d7c0f';
      ctx.strokeStyle = '#1c1917';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-5, -11, 0, -17 - (i === 1 ? 3 : 0));
      ctx.quadraticCurveTo(5, -11, 0, 0);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
    ctx.restore();
  }

  // =========================================================================
  // 1. COVER: FORKED STORM LIGHTNING + QUILL STARDUST + DRAGON WAKE
  // =========================================================================
  function renderCoverScene(ts, t, dt60) {
    if (ts > nextBoltAt) {
      const startX = (0.28 + Math.random() * 0.26) * width;
      const pts = [{ x: startX, y: 0 }];
      let cx = startX;
      let cy = 0;
      for (let s = 0; s < 6; s++) {
        cx += (Math.random() - 0.48) * 38;
        cy += height * 0.055;
        pts.push({ x: cx, y: cy });
      }
      lightningBolt = { pts, alpha: 0.92 };
      nextBoltAt = ts + 3200 + Math.random() * 3800;
    }

    if (lightningBolt && lightningBolt.alpha > 0.02) {
      ctx.fillStyle = `rgba(165, 243, 252, ${(lightningBolt.alpha * 0.16).toFixed(3)})`;
      ctx.fillRect(0, 0, width, height * 0.45);
      ctx.save();
      ctx.strokeStyle = `rgba(224, 242, 254, ${lightningBolt.alpha.toFixed(2)})`;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      lightningBolt.pts.forEach((p, idx) => (idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
      ctx.restore();
      lightningBolt.alpha *= Math.pow(0.84, dt60);
    }

    const qx = 0.662 * width;
    const qy = 0.245 * height;
    if (!cachedQuillGlow) rebuildCachedGradients();
    if (cachedQuillGlow) {
      ctx.fillStyle = cachedQuillGlow;
      ctx.beginPath();
      ctx.arc(qx, qy, width * 0.09, 0, Math.PI * 2);
      ctx.fill();
    }

    quillSparks.forEach((sp, i) => {
      sp.prog = (sp.prog + 0.008 * dt60) % 1;
      const sx = qx + Math.cos(sp.ang + t * 0.8) * (sp.dist + sp.prog * 22);
      const sy = qy + Math.sin(sp.ang + t * 0.8) * (sp.dist * 0.6) + sp.prog * 18;
      const a = Math.sin(sp.prog * Math.PI);
      ctx.fillStyle = i % 2 ? `rgba(254, 249, 195, ${a.toFixed(2)})` : `rgba(251, 191, 36, ${a.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(sx, sy, sp.r, 0, Math.PI * 2);
      ctx.fill();
    });

    drawTorchFlame(11.8, 40.5, 1.05, t, 1);
    const vx = 0.39 * width;
    const vy = 0.59 * height;
    const rw = 12 + ((t * 16) % 24);
    ctx.strokeStyle = `rgba(186, 230, 253, ${(0.4 * (1 - ((t * 16) % 24) / 24)).toFixed(2)})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(vx, vy, rw, rw * 0.26, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // =========================================================================
  // 2. SWAMP: BUZZING TURNIP FLIES + WRIGGLING WORM + MARSH GAS + SEAGULL
  // =========================================================================
  function renderSwampScene(t, dt60) {
    marshBubbles.forEach((b) => {
      b.prog += b.spd * dt60;
      if (b.prog >= 1) {
        b.prog = 0;
        b.rx = 0.28 + Math.random() * 0.48;
      }
      const bx = b.rx * width;
      const by = (b.ry - b.prog * 0.06) * height;
      if (b.prog < 0.82) {
        const rad = b.maxR * (b.prog / 0.82);
        ctx.fillStyle = 'rgba(163, 230, 53, 0.28)';
        ctx.strokeStyle = 'rgba(217, 249, 157, 0.58)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(bx, by, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        const popP = (b.prog - 0.82) / 0.18;
        ctx.strokeStyle = `rgba(217, 249, 157, ${(0.55 * (1 - popP)).toFixed(2)})`;
        ctx.beginPath();
        ctx.ellipse(bx, by, b.maxR + popP * 12, (b.maxR + popP * 12) * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    const wx = 0.662 * width;
    const wy = 0.438 * height;
    ctx.save();
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + Math.sin(t * 7) * 5, wy - 6, wx + Math.cos(t * 6) * 6, wy - 11);
    ctx.stroke();
    ctx.restore();

    const fcx = 0.635 * width;
    const fcy = 0.295 * height;
    const spread = width * 0.048;
    for (let f = 0; f < 5; f++) {
      const ang = t * (3.5 + f * 0.45) + f * 1.9;
      const fx = fcx + Math.sin(ang) * spread;
      const fy = fcy + Math.sin(ang * 2) * (spread * 0.46);
      const wing = Math.abs(Math.sin(t * 40 + f)) * 3;
      ctx.fillStyle = 'rgba(224, 242, 254, 0.82)';
      ctx.beginPath();
      ctx.ellipse(fx - 1.8, fy - 1.8, 2.4, 1 + wing * 0.4, -0.4, 0, Math.PI * 2);
      ctx.ellipse(fx + 1.8, fy - 1.8, 2.4, 1 + wing * 0.4, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(fx, fy, 2.0, 0, Math.PI * 2);
      ctx.fill();
    }

    drawTorchFlame(77.8, 46.2, 1.15, t, 2);
    const gx = 0.808 * width;
    const gy = 0.122 * height;
    if ((t % 3.1) < 0.16) {
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(gx, gy, 3.4, 0, Math.PI * 2);
      ctx.fill();
    }
    if (gullSquawkTimer > 0) {
      for (let k = 0; k < 2; k++) {
        const r = (1 - gullSquawkTimer) * 32 + 8 + k * 9;
        ctx.strokeStyle = `rgba(254, 240, 138, ${(gullSquawkTimer * (1 - k * 0.35)).toFixed(2)})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(gx - 8, gy + 2, r, Math.PI - 0.65, Math.PI + 0.65);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = 'rgba(186, 230, 253, 0.28)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    squallDrops.forEach((d) => {
      d.y += d.spd * dt60;
      d.x -= d.spd * 0.22 * dt60;
      if (d.y > 1.04) {
        d.y = -0.04;
        d.x = Math.random();
      }
      if (d.x < -0.04) d.x = 1.02;
      const px = d.x * width;
      const py = d.y * height;
      ctx.moveTo(px, py);
      ctx.lineTo(px - d.len * 0.45, py + d.len);
    });
    ctx.stroke();
  }

  // =========================================================================
  // 3. FAREHAM MILLS: FLOWING RIVER CURRENTS + ROTATING MILL PADDLES + ODO SWEAT
  // =========================================================================
  function renderFarehamMillsScene(t, dt60) {
    ctx.save();
    ctx.lineCap = 'round';
    riverCurrents.forEach((rc) => {
      rc.prog = (rc.prog + rc.spd * (1 + wheelBoost * 1.5) * dt60) % 1;
      const p = rc.prog;
      const x1 = (0.5 + p * 0.34 + Math.sin(p * Math.PI * 1.6) * 0.04 + rc.lane) * width;
      const y1 = (0.46 + p * 0.48) * height;
      const alpha = Math.sin(p * Math.PI) * 0.38;
      ctx.strokeStyle = `rgba(224, 242, 254, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 1.5 + p * 1.4;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + 10 + p * 14, y1 + 7 + p * 9);
      ctx.stroke();
    });
    ctx.restore();

    // Rotating timber waterwheel spokes & waterfall spray
    const spin = 2.1 + wheelBoost * 7.0;
    [
      { x: 49.3, y: 41.6, rx: 1.9, ry: 3.8, wfx: 49.5, wfy: 44.2 },
      { x: 68.8, y: 44.6, rx: 3.2, ry: 6.6, wfx: 70.5, wfy: 48.0 },
    ].forEach((w, idx) => {
      const cx = (w.x / 100) * width;
      const cy = (w.y / 100) * height;
      const rx = (w.rx / 100) * width;
      const ry = (w.ry / 100) * height;
      ctx.strokeStyle = 'rgba(254, 243, 199, 0.36)';
      ctx.lineWidth = 1.8;
      for (let s = 0; s < 8; s++) {
        const ang = t * spin + idx + (s * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ang) * rx, cy + Math.sin(ang) * ry);
        ctx.stroke();
      }
      // White-water churn drops
      for (let k = 0; k < 6; k++) {
        const pr = (t * (2.2 + wheelBoost * 2) + k * 0.17) % 1;
        const sx = (w.wfx / 100) * width + Math.sin(k * 3 + t * 5) * 6;
        const sy = (w.wfy / 100) * height + pr * height * 0.065;
        ctx.fillStyle = `rgba(240, 249, 255, ${(0.55 * (1 - pr)).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 2 + (1 - pr) * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Nervous cartoon blue sweat-drops dripping off guilty Reeve Odo's temples (x=16.5%, y=35%)
    [0, 0.5].forEach((off, idx) => {
      const sp = (t * 0.95 + off) % 1;
      const ox = (idx === 0 ? 0.165 : 0.208) * width + (idx === 0 ? -4 : 4);
      const oy = 0.345 * height + sp * 22;
      ctx.fillStyle = `rgba(56, 189, 248, ${(0.9 * (1 - sp)).toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(ox, oy, 2.8 * (1 - sp * 0.3), 0, Math.PI * 2);
      ctx.fill();
    });

    // Sacred golden breathing aura on St Swithin's bone casket + Torch flame
    const rx = 0.355 * width;
    const ry = 0.575 * height;
    const rr = width * 0.055 * (0.88 + Math.sin(t * 3.2) * 0.14);
    const rg = ctx.createRadialGradient(rx, ry, 2, rx, ry, rr);
    rg.addColorStop(0, 'rgba(253, 224, 71, 0.38)');
    rg.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(rx, ry, rr, 0, Math.PI * 2);
    ctx.fill();

    drawTorchFlame(43.3, 22.8, 1.25, t, 3);

    // Snorting pig breath puffs in the oak woods (x=83%, y=52% & x=87.5%, y=55%)
    [
      { x: 82.2, y: 52.5, ph: 0 },
      { x: 87.2, y: 55.2, ph: 0.5 },
    ].forEach((pg) => {
      const pr = (t * 0.85 + pg.ph) % 1;
      const px = (pg.x / 100) * width - pr * 12;
      const py = (pg.y / 100) * height - pr * 8;
      ctx.fillStyle = `rgba(241, 245, 249, ${(0.38 * Math.sin(pr * Math.PI)).toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(px, py, 3 + pr * 7, 0, Math.PI * 2);
      ctx.fill();
    });

    // Sneaky wiggling turnip tuft for Bennet Cameo #2 behind mossy riverbank stones (x=8%, y=86%)
    drawSneakyBennetTurnipTuft(8.5, 86, t);
  }

  // =========================================================================
  // 4. ROYAL ASSIZE: SLANTED WINDOW MOONBEAMS + SILVER COIN GLINTS + TORCHES
  // =========================================================================
  function renderAssizeScene(t, dt60) {
    if (!cachedAssizeBeam) rebuildCachedGradients();
    if (cachedAssizeBeam) {
      ctx.save();
      ctx.fillStyle = cachedAssizeBeam;
      ctx.beginPath();
      ctx.moveTo(width * 0.86, height * 0.08);
      ctx.lineTo(width * 0.92, height * 0.24);
      ctx.lineTo(width * 0.66, height * 0.78);
      ctx.lineTo(width * 0.52, height * 0.68);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = 'rgba(254, 243, 199, 0.42)';
    hallMotes.forEach((m) => {
      m.x += m.vx * dt60;
      m.y += m.vy * dt60;
      if (m.x < 0.45 || m.y > 0.88) {
        m.x = 0.82 + Math.random() * 0.12;
        m.y = 0.12 + Math.random() * 0.25;
      }
      ctx.beginPath();
      ctx.arc(m.x * width, m.y * height, m.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Twinkling 4-point star sparkles on Sheriff Hugh's stacked silver pennies!
    coinGlints.forEach((cg) => {
      const pulse = Math.max(0, Math.sin(t * 3.2 + cg.phase));
      if (pulse > 0.35) {
        const cx = (cg.x / 100) * width;
        const cy = (cg.y / 100) * height;
        const len = (pulse - 0.35) * 14;
        ctx.strokeStyle = `rgba(254, 249, 195, ${pulse.toFixed(2)})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(cx - len, cy);
        ctx.lineTo(cx + len, cy);
        ctx.moveTo(cx, cy - len);
        ctx.lineTo(cx, cy + len);
        ctx.stroke();
      }
    });

    // Twin wall-sconce flames
    drawTorchFlame(21.6, 16.5, 0.92, t, 4);
    drawTorchFlame(95.0, 12.6, 1.0, t, 7);
  }

  // =========================================================================
  // 5. STUBBINGTON HUT: BUBBLING CAULDRON + LADLE DRIP + HEARTH SMOKE + EAVES DRIPS
  // =========================================================================
  function renderStubbingtonHutScene(t, dt60) {
    drawTorchFlame(44.2, 68.5, 1.05, t, 5);

    for (let b = 0; b < 5; b++) {
      const pr = (t * 1.4 + b * 0.2) % 1;
      const bx = (0.425 + b * 0.0085) * width;
      const by = (0.605 - pr * 0.018) * height;
      ctx.fillStyle = `rgba(253, 224, 71, ${(0.75 * (1 - pr)).toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(bx, by, 1.6 + (1 - pr) * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    const dripProg = (t * 0.75) % 1;
    if (dripProg < 0.7) {
      const p = dripProg / 0.7;
      const dx = 0.254 * width;
      const dy = (0.675 + p * p * 0.14) * height;
      ctx.fillStyle = `rgba(217, 119, 6, ${(0.9 * (1 - p * 0.4)).toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const sx0 = 0.438 * width;
    const sy0 = 0.56 * height;
    smokePuffs.forEach((p) => {
      p.prog = (p.prog + 0.0042 * dt60) % 1;
      const px = sx0 + Math.sin(t * 1.5 + p.sway + p.prog * 4.5) * (14 * p.prog);
      const py = sy0 - p.prog * height * 0.44;
      const rad = 6 + p.prog * 22;
      ctx.fillStyle = `rgba(226, 232, 240, ${(0.17 * (1 - p.prog)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(px, py, rad, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = 'rgba(186, 230, 253, 0.34)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    eavesDrips.forEach((d) => {
      d.y = (d.y + d.spd * dt60) % 1;
      const px = d.x * width;
      const py = (0.18 + d.y * 0.74) * height;
      ctx.moveTo(px, py);
      ctx.lineTo(px - 1.5, py + 11);
    });
    ctx.stroke();

    drawSneakyBennetTurnipTuft(92.0, 76.5, t);
  }

  // =========================================================================
  // 6. SERVI PLOUGH: GOLDEN SUNRISE RAYS + VALLEY MIST + OXEN BREATH + DAWN ROOKS
  // =========================================================================
  function renderServiPloughScene(t, dt60) {
    // Fanning golden dawn rays from upper-left horizon
    ctx.save();
    const sx = 0.12 * width;
    const sy = 0.05 * height;
    for (let r = 0; r < 4; r++) {
      const ang = 0.22 + r * 0.16 + Math.sin(t * 0.4 + r) * 0.02;
      const grad = ctx.createLinearGradient(sx, sy, sx + Math.cos(ang) * width * 0.65, sy + Math.sin(ang) * height * 0.7);
      grad.addColorStop(0, 'rgba(254, 243, 199, 0.16)');
      grad.addColorStop(1, 'rgba(254, 243, 199, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(ang - 0.05) * width * 0.7, sy + Math.sin(ang - 0.05) * height * 0.75);
      ctx.lineTo(sx + Math.cos(ang + 0.05) * width * 0.7, sy + Math.sin(ang + 0.05) * height * 0.75);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Slow-drifting valley mist ribbons over Fareham Creek
    for (let i = 0; i < 6; i++) {
      const mx = (((i * 0.22 + t * 0.014) % 1.3) - 0.15) * width;
      const my = (0.42 + (i % 3) * 0.07) * height;
      const mr = width * 0.19;
      const mg = ctx.createRadialGradient(mx, my, 4, mx, my, mr);
      mg.addColorStop(0, 'rgba(241, 245, 249, 0.18)');
      mg.addColorStop(1, 'rgba(241, 245, 249, 0)');
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rhythmic slow warm breath plumes from the two oxen's nostrils
    [
      { x: 87.5, y: 48.5, ph: 0 },
      { x: 95.8, y: 47.5, ph: 0.35 },
    ].forEach((ox) => {
      const cycle = (t * 0.32 + ox.ph) % 1;
      if (cycle < 0.65) {
        const p = cycle / 0.65;
        const bx = (ox.x / 100) * width + p * 16;
        const by = (ox.y / 100) * height + p * 6;
        ctx.fillStyle = `rgba(248, 250, 252, ${(0.34 * Math.sin(p * Math.PI)).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(bx, by, 4 + p * 11, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Peaceful dawn rooks gliding across the pale morning sky
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.55)';
    ctx.lineWidth = 1.4;
    dawnBirds.forEach((b) => {
      b.x = (b.x + b.spd * dt60) % 1.08;
      const bx = (b.x - 0.04) * width;
      const by = b.y * height + Math.sin(t * 2 + b.phase) * 3;
      const flap = Math.sin(t * 6.5 + b.phase) * 3.5;
      ctx.beginPath();
      ctx.moveTo(bx - 5, by - flap);
      ctx.quadraticCurveTo(bx - 2, by - 2, bx, by);
      ctx.quadraticCurveTo(bx + 2, by - 2, bx + 5, by - flap);
      ctx.stroke();
    });
  }

  function ensureLoopRunning() {
    if (destroyed || rafId) return;
    if ((typeof document !== 'undefined' && document.hidden) || isOffscreen) return;
    lastTs = 0;
    rafId = requestAnimationFrame(drawFrame);
  }

  function pauseLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    lastTs = 0;
  }

  const onVisChange = () => {
    if (typeof document !== 'undefined' && document.hidden) pauseLoop();
    else ensureLoopRunning();
  };
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', onVisChange);
  }

  const io =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (!entry) return;
            isOffscreen = !entry.isIntersecting;
            if (isOffscreen) pauseLoop();
            else ensureLoopRunning();
          },
          { threshold: 0.01 },
        )
      : null;
  io?.observe(containerEl);

  function drawFrame(ts) {
    if (destroyed) return;
    if ((typeof document !== 'undefined' && document.hidden) || isOffscreen) {
      rafId = 0;
      lastTs = 0;
      return;
    }

    // Wait until underlying .webp diorama has decoded so FX never float over an unloaded black frame!
    if (imgEl && (!imgEl.complete || imgEl.naturalWidth === 0)) {
      rafId = requestAnimationFrame(drawFrame);
      return;
    }

    const dt60 = lastTs ? Math.min(2.5, Math.max(0.2, ((ts - lastTs) / 1000) * 60)) : 1;
    lastTs = ts;

    const t = ts * 0.001;
    ctx.clearRect(0, 0, width, height);

    wheelBoost = Math.max(0, wheelBoost * Math.pow(0.96, dt60));
    gullSquawkTimer = Math.max(0, gullSquawkTimer - 0.025 * dt60);

    if (!reducedMotionQuery?.matches) {
      if (presetKey === 'cover') renderCoverScene(ts, t, dt60);
      else if (presetKey === 'swamp') renderSwampScene(t, dt60);
      else if (presetKey === 'fareham_mills') renderFarehamMillsScene(t, dt60);
      else if (presetKey === 'assize') renderAssizeScene(t, dt60);
      else if (presetKey === 'stubbington_hut') renderStubbingtonHutScene(t, dt60);
      else if (presetKey === 'servi_plough') renderServiPloughScene(t, dt60);
    }

    // Interactive Tap-Burst Particles (dt60 frame-rate normalized)
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.life -= 0.036 * dt60;
      if (b.life <= 0) {
        bursts.splice(i, 1);
        continue;
      }
      b.x += b.vx * dt60;
      b.y += b.vy * dt60;
      b.vy += 0.2 * dt60;
      ctx.fillStyle = b.color;
      ctx.globalAlpha = Math.max(0, b.life);
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    rafId = requestAnimationFrame(drawFrame);
  }

  ensureLoopRunning();

  return {
    burst(xPct, yPct, kind = 'gold') {
      const bx = (xPct / 100) * width;
      const by = (yPct / 100) * height;
      if (kind === 'wheel') wheelBoost = 1.25;
      if (kind === 'seagull') gullSquawkTimer = 1.0;
      const palette =
        kind === 'mud'
          ? ['#78350f', '#451a03', '#a16207']
          : kind === 'seagull'
            ? ['#f8fafc', '#cbd5e1', '#fde047']
            : ['#fde047', '#f59e0b', '#fef08a'];
      for (let i = 0; i < 14; i++) {
        const ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.3;
        const spd = 1.7 + Math.random() * 3.6;
        bursts.push({
          x: bx,
          y: by,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 1.6,
          r: 2.0 + Math.random() * 2.4,
          color: palette[i % palette.length],
          life: 1.0,
        });
      }
    },
    destroy() {
      destroyed = true;
      pauseLoop();
      ro?.disconnect();
      io?.disconnect();
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisChange);
      }
      containerEl.removeEventListener('pointermove', onPointerMove);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    },
  };
}
