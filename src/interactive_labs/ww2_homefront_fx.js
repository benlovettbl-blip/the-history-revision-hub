/**
 * WW2 Home Front Lightweight Burst & VE Day Celebration Controller
 * Zero idle CPU/GPU background loops or misaligned pillarbox overlays.
 */

export function mountWw2HomeFrontFX(hostEl, preset = 'cover') {
  if (!hostEl || typeof document === 'undefined') {
    return { burst() {}, destroy() {} };
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'ww2-fx-canvas';
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
    canvas.height = Math.max(120, Math.min(450, Math.round(r.height || 360)));
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
      p.vy += 0.08;
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
      kind === 'bunting'
        ? ['#ef4444', '#f8fafc', '#3b82f6', '#fde047']
        : ['#fde047', '#f59e0b', '#4ade80'];

    for (let i = 0; i < 14; i++) {
      const ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.3;
      const spd = 1.3 + Math.random() * 2.6;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 1.0,
        r: 2.5 + Math.random() * 2.2,
        alpha: 0.92,
        color: palette[i % palette.length],
      });
    }
    if (!rafId) rafId = requestAnimationFrame(step);
  }

  if (preset === 'veday_banner') {
    burst(25, 45, 'bunting');
    burst(75, 45, 'bunting');
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
