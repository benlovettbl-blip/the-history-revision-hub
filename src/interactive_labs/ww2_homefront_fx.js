/**
 * The Suitcase on Platform Four — 6 Bespoke Per-Scene 60 FPS Storybook Canvas Engines (`ww2_homefront_fx.js`)
 *
 * Frame-rate independent (`dt60`), gated on `img.complete`, auto-paused on `visibilitychange` + `IntersectionObserver`,
 * and respectful of `prefers-reduced-motion: reduce`.
 *
 *  1. `cover`: Sweeping twin twilight searchlight cones + billowing green locomotive steam + warm platform lamp glow.
 *  2. `station`: Horizontal carriage undercarriage steam jets + glinting brass guard's whistle sparks + floating soot motes.
 *  3. `countryside`: Tumbling golden-red autumn orchard leaves + slanted afternoon sunbeams + curling cottage chimney smoke + swallows.
 *  4. `blitz_shelter`: Night searchlights + cosy flickering hurricane lamp inside the Anderson shelter + blackout curtain chink (turns off when shut!).
 *  5. `kitchen_ration`: Rising fragrant Woolton-pie steam curls + warm pulsing Bakelite wireless dial + sunbeam flour motes.
 *  6. `bletchley_veday`: Blinking amber cipher-rotor lamps on the Wren's desk + fluttering VE Day courtyard confetti & sunlit breeze.
 */

export function mountWw2HomeFrontFX(containerEl, presetKey = 'cover', getExtraState = () => ({})) {
  if (!containerEl || typeof window === 'undefined') {
    return { burst() {}, destroy() {} };
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'ww2-hf-fx-canvas';
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

  const reducedMotionQuery =
    typeof window !== 'undefined' ? window.matchMedia?.('(prefers-reduced-motion: reduce)') : null;

  const steamPuffs = Array.from({ length: 18 }, (_, i) => ({
    prog: i / 18,
    jitter: (Math.random() - 0.5) * 0.04,
    size: 8 + Math.random() * 18,
  }));

  const leaves = Array.from({ length: presetKey === 'countryside' ? 18 : 0 }, () => ({
    x: Math.random(),
    y: Math.random(),
    spdY: 0.0022 + Math.random() * 0.0018,
    spdX: -0.0018 - Math.random() * 0.0015,
    rot: Math.random() * Math.PI * 2,
    hue: Math.random() > 0.45 ? '#d97706' : '#dc2626',
  }));

  const motes = Array.from({ length: 24 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0006,
    vy: -0.0005 - Math.random() * 0.0006,
    r: 1 + Math.random() * 1.8,
  }));

  const confetti = Array.from(
    { length: presetKey === 'bletchley_veday' || presetKey === 'veday_banner' ? 26 : 0 },
    () => ({
      x: presetKey === 'veday_banner' ? Math.random() : 0.66 + Math.random() * 0.32,
      y: Math.random(),
      spd: 0.003 + Math.random() * 0.0025,
      col: ['#ef4444', '#f8fafc', '#3b82f6', '#fde047'][Math.floor(Math.random() * 4)],
      sway: Math.random() * Math.PI * 2,
    }),
  );

  const bursts = [];

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
    }
  }

  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncSize) : null;
  ro?.observe(containerEl);
  syncSize();

  const imgEl = containerEl.querySelector('.ww2-diorama-img');
  const onPointerMove = (e) => {
    if (!imgEl || reducedMotionQuery?.matches) return;
    const rect = containerEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    imgEl.style.transform = `scale(1.02) translate(${(-nx * 5).toFixed(1)}px, ${(-ny * 3.5).toFixed(1)}px)`;
  };
  containerEl.addEventListener('pointermove', onPointerMove, { passive: true });

  function drawSearchlightCone(baseXPct, baseYPct, angleRad, coneAlpha) {
    const bx = (baseXPct / 100) * width;
    const by = (baseYPct / 100) * height;
    const len = height * 0.92;
    const ex = bx + Math.sin(angleRad) * len;
    const ey = by - Math.cos(angleRad) * len;
    const halfSpread = width * 0.055;

    const g = ctx.createLinearGradient(bx, by, ex, ey);
    g.addColorStop(0, `rgba(224, 242, 254, ${coneAlpha.toFixed(3)})`);
    g.addColorStop(1, 'rgba(224, 242, 254, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(bx - 4, by);
    ctx.lineTo(ex - halfSpread, ey);
    ctx.lineTo(ex + halfSpread, ey);
    ctx.lineTo(bx + 4, by);
    ctx.closePath();
    ctx.fill();
  }

  function drawWarmGlow(xPct, yPct, radiusPct, alpha, t, speed = 4) {
    const cx = (xPct / 100) * width;
    const cy = (yPct / 100) * height;
    const r = (radiusPct / 100) * width * (0.92 + Math.sin(t * speed) * 0.08);
    const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
    g.addColorStop(0, `rgba(253, 224, 71, ${alpha.toFixed(3)})`);
    g.addColorStop(0.55, `rgba(245, 158, 11, ${(alpha * 0.35).toFixed(3)})`);
    g.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function renderCover(t, dt60) {
    // Twin twilight searchlights sweeping gently across sky archway (x: 48..70%)
    drawSearchlightCone(48, 46, Math.sin(t * 0.48) * 0.34 + 0.16, 0.14);
    drawSearchlightCone(70, 46, Math.cos(t * 0.39 + 1.2) * 0.34 - 0.18, 0.14);

    // Billowing green-locomotive funnel steam drifting upward (funnel at x: 10%, y: 24%)
    steamPuffs.forEach((p) => {
      p.prog = (p.prog + 0.0048 * dt60) % 1;
      const px = (0.105 + p.prog * 0.09 + p.jitter) * width;
      const py = (0.23 - p.prog * 0.21) * height;
      const rad = p.size * (0.5 + p.prog * 1.45);
      ctx.fillStyle = `rgba(241, 245, 249, ${(0.25 * Math.sin(p.prog * Math.PI)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(px, py, rad, 0, Math.PI * 2);
      ctx.fill();
    });

    // Glowing amber station lantern above ARP Warden (x: 85%, y: 18%)
    drawWarmGlow(85, 18, 10.5, 0.32, t, 3.2);
  }

  function renderStation(t, dt60) {
    // Undercarriage horizontal steam clouds along platform edge (x: 24..48%, y: 72%)
    steamPuffs.forEach((p) => {
      p.prog = (p.prog + 0.0065 * dt60) % 1;
      const px = (0.24 + p.prog * 0.24) * width;
      const py = (0.71 - p.prog * 0.06 + p.jitter) * height;
      const rad = p.size * (0.55 + p.prog * 1.25);
      ctx.fillStyle = `rgba(248, 250, 252, ${(0.21 * (1 - p.prog)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(px, py, rad, 0, Math.PI * 2);
      ctx.fill();
    });

    // Sunbeam dust motes under Victorian glass canopy + guard's brass whistle twinkle (x: 18%, y: 46%)
    ctx.fillStyle = 'rgba(254, 243, 199, 0.45)';
    motes.forEach((m) => {
      m.x = (m.x + m.vx * dt60 + 1) % 1;
      m.y = (m.y + m.vy * dt60 + 1) % 1;
      ctx.beginPath();
      ctx.arc(m.x * width, m.y * height * 0.58, m.r, 0, Math.PI * 2);
      ctx.fill();
    });
    drawWarmGlow(18, 46, 4.8, 0.34, t, 6);
  }

  function renderCountryside(t, dt60) {
    // Golden September afternoon sunbeams from upper-left orchard sky (x: 28%, y: 10%)
    drawWarmGlow(28, 10, 26, 0.2, t, 1.5);

    // Farmhouse chimney wisps (x: 52%, y: 14%)
    steamPuffs.slice(0, 10).forEach((p) => {
      p.prog = (p.prog + 0.0036 * dt60) % 1;
      const px = (0.52 + Math.sin(t + p.prog * 4) * 0.018) * width;
      const py = (0.15 - p.prog * 0.14) * height;
      ctx.fillStyle = `rgba(241, 245, 249, ${(0.18 * (1 - p.prog)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(px, py, 6 + p.prog * 14, 0, Math.PI * 2);
      ctx.fill();
    });

    // Tumbling autumn apple-orchard leaves
    leaves.forEach((lf) => {
      lf.x += lf.spdX * dt60 + Math.sin(t * 2 + lf.rot) * 0.0005;
      lf.y += lf.spdY * dt60;
      lf.rot += 0.03 * dt60;
      if (lf.y > 1.04 || lf.x < -0.04) {
        lf.x = 0.25 + Math.random() * 0.72;
        lf.y = -0.03;
      }
      ctx.save();
      ctx.translate(lf.x * width, lf.y * height);
      ctx.rotate(lf.rot);
      ctx.fillStyle = lf.hue;
      ctx.globalAlpha = 0.78;
      ctx.beginPath();
      ctx.ellipse(0, 0, 4.2, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function renderBlitzShelter(t, _dt60) {
    const extra = getExtraState() || {};
    // Sky searchlight cones behind rooftops (x: 50..65%, y: 30%)
    drawSearchlightCone(51, 31, Math.sin(t * 0.55) * 0.34 + 0.18, 0.14);
    drawSearchlightCone(65, 28, Math.cos(t * 0.42) * 0.32 - 0.2, 0.13);

    // Cosy golden hurricane lantern hanging inside the Anderson shelter (x: 71.8%, y: 45.5%)
    drawWarmGlow(71.8, 45.5, 15, 0.34, t, 7.5);

    // Leaking blackout curtain chink on left house window (x: 15.2%, y: 48.5%)
    if (!extra.blackoutShut) {
      drawWarmGlow(15.2, 48.5, 7.2, 0.52, t, 9);
    } else {
      // Physically draw the pulled-shut heavy blackout curtain seam over the entire golden gap!
      ctx.save();
      ctx.fillStyle = '#282a32';
      ctx.fillRect(width * 0.126, height * 0.381, width * 0.052, height * 0.203);
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(width * 0.152, height * 0.381);
      ctx.lineTo(width * 0.152, height * 0.584);
      ctx.stroke();
      ctx.restore();
    }
  }

  function renderKitchenRation(t, dt60) {
    // Rising fragrant steam curls above golden vegetable Woolton Pie (x: 87.8%, y: 76%)
    for (let i = 0; i < 8; i++) {
      const pr = (t * 0.45 + i * 0.125) % 1;
      const sx = (0.878 + Math.sin(t * 2.2 + i) * 0.012) * width;
      const sy = (0.75 - pr * 0.17) * height;
      ctx.fillStyle = `rgba(248, 250, 252, ${(0.26 * Math.sin(pr * Math.PI)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 4 + pr * 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glowing amber 1940s Bakelite wireless dial on right shelf (x: 90%, y: 40%)
    drawWarmGlow(90, 40, 6.2, 0.32, t, 3.8);

    // Sunlit shop-window flour motes (x: 12..45%)
    ctx.fillStyle = 'rgba(254, 249, 195, 0.44)';
    motes.slice(0, 14).forEach((m) => {
      m.x = (m.x + m.vx * dt60 + 1) % 1;
      m.y = (m.y + m.vy * dt60 + 1) % 1;
      ctx.beginPath();
      ctx.arc((0.12 + m.x * 0.36) * width, m.y * height * 0.65, m.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function renderBletchleyVeDay(t, dt60) {
    // Blinking amber cipher machine indicator bulbs on Miss Bennett's desk (exact x: 52.5%, 54.7%, 57.0%, y: 67.2%)
    [
      { x: 52.5, y: 67.2, ph: 0 },
      { x: 54.7, y: 67.3, ph: 1.4 },
      { x: 57.0, y: 67.5, ph: 2.8 },
    ].forEach((lamp) => {
      const on = Math.sin(t * 4.5 + lamp.ph) > 0.1;
      if (on) {
        drawWarmGlow(lamp.x, lamp.y, 2.8, 0.56, t, 2);
      }
    });

    // Sunlit VE Day red-white-blue celebration confetti drifting outside open courtyard doors (x: 68..95%)
    confetti.forEach((c) => {
      c.y = (c.y + c.spd * dt60) % 1;
      const cx = (c.x + Math.sin(t * 2.4 + c.sway) * 0.014) * width;
      const cy = c.y * height;
      ctx.fillStyle = c.col;
      ctx.globalAlpha = 0.82;
      ctx.fillRect(cx, cy, 4, 2.8);
      ctx.globalAlpha = 1;
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
    if (imgEl && (!imgEl.complete || imgEl.naturalWidth === 0)) {
      rafId = requestAnimationFrame(drawFrame);
      return;
    }

    const dt60 = lastTs ? Math.min(2.5, Math.max(0.2, ((ts - lastTs) / 1000) * 60)) : 1;
    lastTs = ts;
    const t = ts * 0.001;

    ctx.clearRect(0, 0, width, height);

    if (!reducedMotionQuery?.matches) {
      if (presetKey === 'cover') renderCover(t, dt60);
      else if (presetKey === 'station') renderStation(t, dt60);
      else if (presetKey === 'countryside') renderCountryside(t, dt60);
      else if (presetKey === 'blitz_shelter') renderBlitzShelter(t, dt60);
      else if (presetKey === 'kitchen_ration') renderKitchenRation(t, dt60);
      else if (presetKey === 'bletchley_veday') renderBletchleyVeDay(t, dt60);
      else if (presetKey === 'veday_banner') {
        drawWarmGlow(50, 18, 32, 0.18, t, 1.8);
        confetti.forEach((c) => {
          c.y = (c.y + c.spd * dt60) % 1;
          const cx = (c.x + Math.sin(t * 2.4 + c.sway) * 0.015) * width;
          const cy = c.y * height;
          ctx.fillStyle = c.col;
          ctx.globalAlpha = 0.85;
          ctx.fillRect(cx, cy, 4.5, 3);
          ctx.globalAlpha = 1;
        });
      }
    }

    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.life -= 0.038 * dt60;
      if (b.life <= 0) {
        bursts.splice(i, 1);
        continue;
      }
      b.x += b.vx * dt60;
      b.y += b.vy * dt60;
      b.vy += 0.18 * dt60;
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
      const palette =
        kind === 'veday'
          ? ['#ef4444', '#ffffff', '#3b82f6']
          : kind === 'green'
            ? ['#86efac', '#22c55e', '#fef08a']
            : ['#fde047', '#f59e0b', '#fef9c3'];
      for (let i = 0; i < 14; i++) {
        const ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.3;
        const spd = 1.6 + Math.random() * 3.2;
        bursts.push({
          x: bx,
          y: by,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 1.5,
          r: 2 + Math.random() * 2.2,
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
