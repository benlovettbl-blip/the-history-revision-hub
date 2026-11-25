/**
 * The Secret of Stubitone™ — 60 FPS Living Graphic-Novel Canvas FX Engine
 *
 * Brings every 16:9 1086 diorama & the LucasArts box-art cover to life at 60 FPS (`0 MB` video lag):
 *  - Procedural flickering 1086 pitch-torch & cauldron hearth flames + rising embers
 *  - Slanted Hampshire rain + expanding mud-puddle ripples + tap-to-splash bursts
 *  - Rotating waterwheel spoke overlays & white-water waterfall foam spray
 *  - Orbiting figure-eight turnip/sweat dung-flies with fluttering wings
 *  - Living grumpy seagull blink, feather-ruffle & angry squawk shockwave rings
 *  - Rising hearth smoke & misty dawn plough-oxen breath
 *  - Touch/pointer 2.5D depth parallax
 */

export const DOMESDAY_SCENE_PRESETS = {
  cover: {
    rain: { count: 58, slant: -0.14, alpha: 0.22 },
    lightning: true,
    torches: [{ x: 11.8, y: 40.5, scale: 1.15 }],
    quillGlow: { x: 66.2, y: 24.5, r: 11 },
    waterfalls: [
      { x: 52.8, y: 58.2, w: 3.6, h: 6.8 },
      { x: 74.2, y: 65.5, w: 4.2, h: 7.5 },
    ],
    wheels: [
      { x: 52.3, y: 55.2, rx: 2.3, ry: 4.4 },
      { x: 73.1, y: 62.6, rx: 2.5, ry: 4.8 },
    ],
    ripples: { x: 18, y: 80, w: 62, h: 16, count: 6 },
    flies: [
      { x: 26.8, y: 58.5, count: 4, spread: 3.4 },
      { x: 59.5, y: 51.0, count: 2, spread: 2.4 },
    ],
    seagull: { x: 9.8, y: 21.6 },
  },
  swamp: {
    rain: { count: 72, slant: -0.16, alpha: 0.28 },
    torches: [{ x: 77.8, y: 46.2, scale: 1.25 }],
    waterfalls: [{ x: 15.8, y: 50.8, w: 4.5, h: 6.2 }],
    wheels: [{ x: 14.3, y: 45.6, rx: 3.6, ry: 6.4 }],
    ripples: { x: 28, y: 78, w: 54, h: 18, count: 7 },
    flies: [{ x: 63.5, y: 31.0, count: 5, spread: 4.8 }],
    seagull: { x: 81.2, y: 12.2 },
  },
  fareham_mills: {
    rain: { count: 54, slant: -0.15, alpha: 0.22 },
    torches: [{ x: 43.3, y: 22.8, scale: 1.3 }],
    relicGlow: { x: 35.5, y: 57.5, r: 6.5 },
    waterfalls: [
      { x: 49.5, y: 44.2, w: 2.6, h: 4.8 },
      { x: 70.5, y: 48.0, w: 3.8, h: 7.4 },
    ],
    wheels: [
      { x: 49.3, y: 41.6, rx: 1.9, ry: 3.8 },
      { x: 68.8, y: 44.6, rx: 3.2, ry: 6.6 },
    ],
    ripples: { x: 44, y: 55, w: 46, h: 36, count: 6 },
    flies: [{ x: 18.8, y: 34.0, count: 3, spread: 2.8 }],
    steam: [
      { x: 82.0, y: 52.5 },
      { x: 87.2, y: 55.2 },
    ],
  },
  assize: {
    torches: [
      { x: 21.6, y: 16.5, scale: 0.95 },
      { x: 95.0, y: 12.6, scale: 1.05 },
    ],
    motes: 28,
    flies: [{ x: 33.0, y: 42.0, count: 2, spread: 2.6 }],
  },
  stubbington_hut: {
    rain: { count: 34, slant: -0.14, alpha: 0.26, clip: { x: 81, y: 0, w: 19, h: 96 } },
    torches: [{ x: 44.2, y: 68.5, scale: 1.1 }],
    smoke: { x: 43.8, y: 56.0, count: 14 },
    motes: 20,
  },
  servi_plough: {
    sunbeam: { x: 14, y: 6, r: 28 },
    mist: { yMin: 38, yMax: 66, count: 7 },
    steam: [
      { x: 87.5, y: 48.5 },
      { x: 95.8, y: 47.5 },
    ],
    wheels: [{ x: 30.8, y: 39.8, rx: 1.7, ry: 3.1 }],
  },
};

export function mountLivingDioramaFX(containerEl, presetKey = 'cover') {
  if (!containerEl || typeof window === 'undefined') return { burst() {}, destroy() {} };

  const preset = DOMESDAY_SCENE_PRESETS[presetKey] || DOMESDAY_SCENE_PRESETS.cover;
  const canvas = document.createElement('canvas');
  canvas.className = 'domesday-fx-canvas';
  canvas.style.cssText =
    'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3;';
  containerEl.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = 640;
  let height = 360;
  let rafId = 0;
  let destroyed = false;
  let wheelBoost = 0;
  let gullSquawkTimer = 0;
  let lightningAlpha = 0;
  let nextLightningAt = performance.now() + 3400;

  // Particle pools
  const rainDrops = Array.from({ length: preset.rain?.count || 0 }, () => ({
    x: Math.random(),
    y: Math.random(),
    len: 10 + Math.random() * 14,
    speed: 0.015 + Math.random() * 0.012,
  }));

  const embers = Array.from({ length: (preset.torches?.length || 0) * 11 }, (_, i) => ({
    torchIdx: i % Math.max(1, preset.torches?.length || 1),
    phase: Math.random() * Math.PI * 2,
    yOff: Math.random(),
    drift: (Math.random() - 0.5) * 2.2,
    size: 1.2 + Math.random() * 2.0,
  }));

  const ripples = Array.from({ length: preset.ripples?.count || 0 }, () => ({
    rx: Math.random(),
    ry: Math.random(),
    prog: Math.random(),
    speed: 0.006 + Math.random() * 0.006,
  }));

  const smokePuffs = Array.from({ length: preset.smoke?.count || 0 }, (_, i) => ({
    prog: i / Math.max(1, preset.smoke?.count || 1),
    sway: Math.random() * Math.PI * 2,
  }));

  const motes = Array.from({ length: preset.motes || 0 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0006,
    vy: -0.0004 - Math.random() * 0.0005,
    r: 1 + Math.random() * 1.8,
  }));

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

  // Gentle 2.5D pointer parallax on underlying diorama image
  const imgEl = containerEl.querySelector('.domesday-diorama-img');
  const onPointerMove = (e) => {
    if (!imgEl) return;
    const rect = containerEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    imgEl.style.transform = `scale(1.028) translate(${(-nx * 7).toFixed(1)}px, ${(-ny * 5).toFixed(1)}px)`;
  };
  containerEl.addEventListener('pointermove', onPointerMove, { passive: true });

  function drawFrame(ts) {
    if (destroyed) return;
    const t = ts * 0.001;
    ctx.clearRect(0, 0, width, height);

    wheelBoost = Math.max(0, wheelBoost * 0.96);
    gullSquawkTimer = Math.max(0, gullSquawkTimer - 0.025);

    // 1. Storm-sky lightning shimmer on cover
    if (preset.lightning) {
      if (ts > nextLightningAt) {
        lightningAlpha = 0.24;
        nextLightningAt = ts + 4200 + Math.random() * 4800;
      }
      if (lightningAlpha > 0.005) {
        ctx.fillStyle = `rgba(186, 230, 253, ${lightningAlpha.toFixed(3)})`;
        ctx.fillRect(0, 0, width, height * 0.48);
        lightningAlpha *= 0.86;
      }
    }

    // 2. Dawn sunbeam & drifting creek mist (Gyrth scene)
    if (preset.sunbeam) {
      const sx = (preset.sunbeam.x / 100) * width;
      const sy = (preset.sunbeam.y / 100) * height;
      const sr = (preset.sunbeam.r / 100) * width * (0.96 + Math.sin(t * 0.8) * 0.05);
      const g = ctx.createRadialGradient(sx, sy, 4, sx, sy, sr);
      g.addColorStop(0, 'rgba(254, 243, 199, 0.28)');
      g.addColorStop(1, 'rgba(254, 243, 199, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    }

    if (preset.mist) {
      for (let i = 0; i < preset.mist.count; i++) {
        const mx = (((i * 0.19 + t * 0.018 * (i % 2 ? 1 : 0.7)) % 1.3) - 0.15) * width;
        const my = ((preset.mist.yMin + (i / preset.mist.count) * (preset.mist.yMax - preset.mist.yMin)) / 100) * height;
        const mr = width * 0.18;
        const mg = ctx.createRadialGradient(mx, my, 4, mx, my, mr);
        mg.addColorStop(0, 'rgba(241, 245, 249, 0.16)');
        mg.addColorStop(1, 'rgba(241, 245, 249, 0)');
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(mx, my, mr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Rotating Waterwheel Spokes & White-Water Spray
    if (preset.wheels) {
      const spinSpeed = 1.9 + wheelBoost * 6.5;
      preset.wheels.forEach((w, idx) => {
        const cx = (w.x / 100) * width;
        const cy = (w.y / 100) * height;
        const rx = (w.rx / 100) * width;
        const ry = (w.ry / 100) * height;
        ctx.save();
        ctx.strokeStyle = 'rgba(254, 243, 199, 0.28)';
        ctx.lineWidth = 1.6;
        for (let s = 0; s < 6; s++) {
          const ang = t * spinSpeed + idx + (s * Math.PI) / 3;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(ang) * rx, cy + Math.sin(ang) * ry);
          ctx.stroke();
        }
        ctx.restore();
      });
    }

    if (preset.waterfalls) {
      preset.waterfalls.forEach((wf, idx) => {
        const wx = (wf.x / 100) * width;
        const wy = (wf.y / 100) * height;
        const ww = (wf.w / 100) * width;
        const wh = (wf.h / 100) * height;
        for (let k = 0; k < 5; k++) {
          const prog = (t * (1.8 + wheelBoost * 2) + k * 0.2 + idx * 0.3) % 1;
          const px = wx + (Math.sin(k * 2.4 + t * 4) * 0.35) * ww;
          const py = wy + prog * wh;
          ctx.fillStyle = `rgba(224, 242, 254, ${(0.45 * (1 - prog)).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(px, py, 2 + (1 - prog) * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // 4. Expanding Mud & Creek Ripples
    if (preset.ripples) {
      const rp = preset.ripples;
      ripples.forEach((r) => {
        r.prog += r.speed;
        if (r.prog >= 1) {
          r.prog = 0;
          r.rx = Math.random();
          r.ry = Math.random();
        }
        const cx = ((rp.x + r.rx * rp.w) / 100) * width;
        const cy = ((rp.y + r.ry * rp.h) / 100) * height;
        const radX = 4 + r.prog * 22;
        const radY = radX * 0.32;
        ctx.strokeStyle = `rgba(226, 232, 240, ${(0.36 * (1 - r.prog)).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, radX, radY, 0, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

    // 5. Rising Cauldron Hearth Smoke & Animal Breath Steam
    if (preset.smoke) {
      const sx0 = (preset.smoke.x / 100) * width;
      const sy0 = (preset.smoke.y / 100) * height;
      smokePuffs.forEach((p) => {
        p.prog = (p.prog + 0.0045) % 1;
        const px = sx0 + Math.sin(t * 1.4 + p.sway + p.prog * 4) * (12 * p.prog);
        const py = sy0 - p.prog * height * 0.42;
        const rad = 6 + p.prog * 22;
        ctx.fillStyle = `rgba(226, 232, 240, ${(0.18 * (1 - p.prog)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    if (preset.steam) {
      preset.steam.forEach((st, idx) => {
        const prog = (t * 0.75 + idx * 0.45) % 1;
        const sx = (st.x / 100) * width + prog * 10;
        const sy = (st.y / 100) * height - prog * 14;
        ctx.fillStyle = `rgba(241, 245, 249, ${(0.32 * Math.sin(prog * Math.PI)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 4 + prog * 9, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 6. Blazing Pitch-Torch & Hearth Flames + Rising Glowing Embers
    if (preset.torches) {
      preset.torches.forEach((tc, idx) => {
        const tx = (tc.x / 100) * width;
        const ty = (tc.y / 100) * height;
        const sc = tc.scale || 1;
        const flicker = 0.88 + Math.sin(t * 13 + idx * 2.1) * 0.1 + Math.cos(t * 21) * 0.05;

        // Warm ambient torchlight halo
        const haloR = Math.max(42, width * 0.12 * sc) * flicker;
        const halo = ctx.createRadialGradient(tx, ty, 2, tx, ty, haloR);
        halo.addColorStop(0, 'rgba(251, 191, 36, 0.42)');
        halo.addColorStop(0.45, 'rgba(245, 158, 11, 0.16)');
        halo.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(tx, ty, haloR, 0, Math.PI * 2);
        ctx.fill();

        // Dancing flame tongues
        for (let k = 0; k < 3; k++) {
          const sway = Math.sin(t * (9 + k * 3) + k) * 5 * sc;
          const fh = (18 + k * 5) * sc * flicker;
          const fw = (9 - k * 2) * sc;
          ctx.fillStyle = k === 2 ? 'rgba(254, 249, 195, 0.78)' : k === 1 ? 'rgba(251, 191, 36, 0.62)' : 'rgba(234, 88, 12, 0.48)';
          ctx.beginPath();
          ctx.moveTo(tx - fw, ty + 4);
          ctx.quadraticCurveTo(tx + sway, ty - fh, tx + fw, ty + 4);
          ctx.closePath();
          ctx.fill();
        }
      });

      embers.forEach((em) => {
        const tc = preset.torches[em.torchIdx];
        if (!tc) return;
        em.yOff = (em.yOff + 0.011) % 1;
        const ex = (tc.x / 100) * width + Math.sin(t * 4 + em.phase) * 9 + em.drift * em.yOff * 12;
        const ey = (tc.y / 100) * height - em.yOff * 46;
        ctx.fillStyle = `rgba(253, 224, 71, ${(0.85 * (1 - em.yOff)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(ex, ey, em.size * (1 - em.yOff * 0.5), 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Golden Quill & Saint Reliquary Shimmer
    const specialGlow = preset.quillGlow || preset.relicGlow;
    if (specialGlow) {
      const gx = (specialGlow.x / 100) * width;
      const gy = (specialGlow.y / 100) * height;
      const gr = (specialGlow.r / 100) * width * (0.9 + Math.sin(t * 3.6) * 0.14);
      const gg = ctx.createRadialGradient(gx, gy, 2, gx, gy, gr);
      gg.addColorStop(0, 'rgba(254, 240, 138, 0.44)');
      gg.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = gg;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. Orbiting Figure-Eight Turnip & Sweat Flies
    if (preset.flies) {
      preset.flies.forEach((cluster, cIdx) => {
        const cx = (cluster.x / 100) * width;
        const cy = (cluster.y / 100) * height;
        const sp = (cluster.spread / 100) * width;
        for (let f = 0; f < cluster.count; f++) {
          const ang = t * (3.4 + f * 0.5) + f * 2.1 + cIdx;
          const fx = cx + Math.sin(ang) * sp;
          const fy = cy + Math.sin(ang * 2) * (sp * 0.48);
          // Wings
          ctx.fillStyle = 'rgba(224, 242, 254, 0.78)';
          const wingBeat = Math.abs(Math.sin(t * 38 + f)) * 2.8;
          ctx.beginPath();
          ctx.ellipse(fx - 1.6, fy - 1.8, 2.2, 1 + wingBeat * 0.4, -0.4, 0, Math.PI * 2);
          ctx.ellipse(fx + 1.6, fy - 1.8, 2.2, 1 + wingBeat * 0.4, 0.4, 0, Math.PI * 2);
          ctx.fill();
          // Body
          ctx.fillStyle = '#1c1917';
          ctx.beginPath();
          ctx.arc(fx, fy, 1.9, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // 8. Living Grumpy Seagull Blink & Squawk Rings
    if (preset.seagull) {
      const gx = (preset.seagull.x / 100) * width;
      const gy = (preset.seagull.y / 100) * height;
      // Periodic angry blink every ~3.6 seconds
      if ((t % 3.6) < 0.14) {
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(gx, gy, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      if (gullSquawkTimer > 0) {
        const r = (1 - gullSquawkTimer) * 34 + 8;
        ctx.strokeStyle = `rgba(254, 240, 138, ${gullSquawkTimer.toFixed(2)})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(gx + 8, gy + 2, r, -0.7, 0.7);
        ctx.stroke();
      }
    }

    // 9. Dust Motes (Assize & Hut)
    if (motes.length > 0) {
      ctx.fillStyle = 'rgba(254, 243, 199, 0.35)';
      motes.forEach((m) => {
        m.x = (m.x + m.vx + 1) % 1;
        m.y = (m.y + m.vy + 1) % 1;
        ctx.beginPath();
        ctx.arc(m.x * width, m.y * height, m.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 10. Driving Hampshire Rain (with optional doorway clip)
    if (preset.rain && rainDrops.length > 0) {
      ctx.save();
      if (preset.rain.clip) {
        const cl = preset.rain.clip;
        ctx.beginPath();
        ctx.rect((cl.x / 100) * width, (cl.y / 100) * height, (cl.w / 100) * width, (cl.h / 100) * height);
        ctx.clip();
      }
      ctx.strokeStyle = `rgba(186, 230, 253, ${preset.rain.alpha})`;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      rainDrops.forEach((d) => {
        d.y += d.speed;
        d.x += d.speed * preset.rain.slant;
        if (d.y > 1.05) {
          d.y = -0.05;
          d.x = Math.random();
        }
        if (d.x < -0.05) d.x = 1.02;
        const px = d.x * width;
        const py = d.y * height;
        ctx.moveTo(px, py);
        ctx.lineTo(px + d.len * preset.rain.slant * 2.2, py + d.len);
      });
      ctx.stroke();
      ctx.restore();
    }

    // 11. Interactive Tap-Burst Particles (Mud / Gold / Feathers)
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.life -= 0.035;
      if (b.life <= 0) {
        bursts.splice(i, 1);
        continue;
      }
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.22;
      ctx.fillStyle = b.color;
      ctx.globalAlpha = Math.max(0, b.life);
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    rafId = requestAnimationFrame(drawFrame);
  }

  rafId = requestAnimationFrame(drawFrame);

  return {
    burst(xPct, yPct, kind = 'gold') {
      const bx = (xPct / 100) * width;
      const by = (yPct / 100) * height;
      if (kind === 'wheel') wheelBoost = 1.2;
      if (kind === 'seagull') gullSquawkTimer = 1.0;
      const palette =
        kind === 'mud'
          ? ['#78350f', '#451a03', '#a16207']
          : kind === 'seagull'
            ? ['#f8fafc', '#cbd5e1', '#fde047']
            : ['#fde047', '#f59e0b', '#fef08a'];
      for (let i = 0; i < 14; i++) {
        const ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.3;
        const spd = 1.8 + Math.random() * 3.8;
        bursts.push({
          x: bx,
          y: by,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 1.8,
          r: 2.2 + Math.random() * 2.6,
          color: palette[i % palette.length],
          life: 1.0,
        });
      }
    },
    destroy() {
      destroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      ro?.disconnect();
      containerEl.removeEventListener('pointermove', onPointerMove);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    },
  };
}
