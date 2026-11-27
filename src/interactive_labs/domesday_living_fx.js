/**
 * Domesday 1086 Lightweight Burst & Victory Confetti Controller
 * Zero idle CPU/GPU background loops on school Chromebooks; renders crisp celebration bursts on demand.
 */

export function mountLivingDioramaFX(hostEl, preset = 'cover') {
  if (!hostEl || typeof document === 'undefined') {
    return { burst() {}, destroy() {} };
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'dst-fx-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:4;';
  hostEl.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let rafId = null;
  let particles = [];

  function syncSize() {
    const r = hostEl.getBoundingClientRect();
    canvas.width = Math.max(320, Math.min(800, Math.round(r.width || 640)));
    canvas.height = Math.max(180, Math.min(450, Math.round(r.height || 360)));
  }
  syncSize();

  function step() {
    if (!canvas.isConnected || !ctx) {
      rafId = null;
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter((p) => p.alpha > 0.04);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.09;
      p.alpha *= 0.94;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (particles.length > 0) {
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
    }
  }

  function burst(xPct = 50, yPct = 50, kind = 'gold') {
    syncSize();
    const cx = (xPct / 100) * canvas.width;
    const cy = (yPct / 100) * canvas.height;
    const palette =
      kind === 'mud'
        ? ['#a16207', '#f59e0b', '#84cc16']
        : kind === 'wheel'
          ? ['#38bdf8', '#bae6fd', '#fde047']
          : ['#fde047', '#f59e0b', '#4ade80'];

    for (let i = 0; i < 16; i++) {
      const ang = (Math.PI * 2 * i) / 16 + Math.random() * 0.3;
      const spd = 1.4 + Math.random() * 2.8;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 1.1,
        r: 2.5 + Math.random() * 2.5,
        alpha: 0.95,
        color: palette[i % palette.length],
      });
    }
    if (!rafId) rafId = requestAnimationFrame(step);
  }

  if (preset === 'victory_confetti') {
    burst(25, 30, 'gold');
    burst(50, 25, 'wheel');
    burst(75, 30, 'gold');
  }

  return {
    burst,
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      particles = [];
      canvas.remove();
    },
  };
}
