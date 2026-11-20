/**
 * Courtyard of Two Keys — 60 FPS Living Graphic-Novel & 2.5D Parallax Engine (Director's Cut 3.6)
 *
 * Architectural Depth-Clipped Scene Presets:
 *  - Every sky bird, wave crest, rain streak, and drifting leaf is strictly clipped (`ctx.clip()`)
 *    to verified unobstructed architectural/sky/water windows so background elements NEVER cross
 *    in front of character faces, bodies, ship masts, tent canvas, or stone pillars!
 */

const SCENE_FX_PRESETS = {
  // Bespoke Split-Time Front Cover Poster (1922 Morning Sunlight <-> 1995 Evening Rain)
  'cover_two_keys_poster.webp': {
    sunbeams: [{ x: 47, y: 15, w: 18, angle: 14, alpha: 0.12, clip: { x: 35, y: 15, w: 25, h: 68 } }],
    foliageCanopy: { x: 35, y: 14, w: 24, h: 28 },
    leafClip: { x: 35, y: 15, w: 25, h: 58 },
    leaves: { count: 7, color: 'rgba(108, 146, 70, 0.62)', blossomColor: 'rgba(208, 76, 58, 0.56)' },
    birdWindows: [{ x: 45, y: 20, w: 14, h: 9, count: 2 }],
    steam: [
      { x: 43.7, y: 73.5 },
      { x: 48.7, y: 74.0 },
    ],
    // Strictly clipped to the open courtyard gap BETWEEN Layla (left <=73%) and Yonatan (right >=87%)!
    rainWindows: [{ x: 73.5, y: 18, w: 13, h: 48, count: 34, slant: -0.05 }],
    puddles: { x: 74, y: 61, w: 12, h: 8, count: 4 },
    glows: [
      { x: 80.5, y: 70.5, r: 14.5, color: '255, 204, 88', intensity: 0.68 },
      { x: 48.0, y: 34.0, r: 16.0, color: '255, 232, 155', intensity: 0.2 },
    ],
    motes: 18,
  },

  // Ch 1
  'ep0_jaffa_1922.webp': {
    sunbeams: [{ x: 50, y: 18, w: 16, angle: 16, alpha: 0.12, clip: { x: 43.5, y: 17, w: 14, h: 50 } }],
    foliageCanopy: { x: 6, y: 2, w: 36, h: 36 },
    leafClip: { x: 27, y: 18, w: 30, h: 48 },
    // Strictly inside central arch sky between columns (44%..57%)!
    birdWindows: [{ x: 44.5, y: 21, w: 12, h: 12, count: 2 }],
    leaves: { count: 7, color: 'rgba(104, 142, 68, 0.6)', blossomColor: 'rgba(204, 77, 58, 0.55)' },
    motes: 22,
    glows: [{ x: 49.7, y: 68.5, r: 11.5, color: '255, 198, 92', intensity: 0.58 }],
    steam: [{ x: 82.5, y: 74 }],
  },
  'ep0_aloni_haifa_1936.webp': {
    sunbeams: [{ x: 18, y: 0, w: 28, angle: 18, alpha: 0.09 }],
    // Water strictly left of Dov's brown coat (x <= 12.5%)!
    waterWindows: [{ x: 1, y: 52, w: 11.5, h: 16, color: '255, 250, 225', waves: 3 }],
    // Sky strictly left of ship rigging (x <= 40%) and above hillside/heads (y <= 21%)!
    birdWindows: [{ x: 4, y: 4, w: 36, h: 16, count: 3 }],
    motes: 18,
    glows: [{ x: 65.6, y: 83.5, r: 6, color: '235, 90, 75', intensity: 0.26 }],
  },

  // Ch 2
  'ep1_haddad_jaffa_1947.webp': {
    // Strictly inside Arch 1 sky (above mast) and Arch 2 sky (left of Ibrahim's head at x=59%!)
    birdWindows: [
      { x: 9, y: 8, w: 18, h: 12, count: 2 },
      { x: 40, y: 8, w: 16.5, h: 17, count: 2 },
    ],
    // Strictly unobstructed open sea patches (zero overlap with pillars, boats, Ibrahim, Salma, or Karim!)
    waterWindows: [
      { x: 45, y: 34, w: 11, h: 11, color: '255, 205, 135', waves: 3 },
      { x: 11.5, y: 52, w: 8, h: 11, color: '255, 205, 135', waves: 2 },
    ],
    glows: [
      { x: 34.4, y: 8.5, r: 14, color: '255, 190, 80', intensity: 0.62 },
      { x: 55.8, y: 65.2, r: 8.5, color: '255, 205, 95', intensity: 0.54 },
    ],
    steam: [
      { x: 83.6, y: 74 },
      { x: 87.0, y: 77 },
    ],
    motes: 14,
  },
  'ep1_haifa_1947.webp': {
    // Strictly open water to the left of the steamer's bow inside the harbour window!
    waterWindows: [{ x: 8.5, y: 45, w: 7.5, h: 10, color: '255, 215, 150', waves: 2 }],
    glows: [
      { x: 66.3, y: 14.5, r: 18, color: '255, 210, 115', intensity: 0.58 },
      { x: 43.2, y: 69.2, r: 8.5, color: '255, 205, 90', intensity: 0.55 },
    ],
    steam: [
      { x: 53.6, y: 70 },
      { x: 66.8, y: 79 },
    ],
    motes: 16,
  },

  // Ch 3
  'ep2_haddad_jericho_1949.webp': {
    // Strictly clipped to the upper open triangle of the tent flap above Salma & Karim's heads!
    rainWindows: [{ x: 29, y: 14, w: 10.5, h: 24, count: 28, slant: -0.16 }],
    glows: [{ x: 49.6, y: 20.5, r: 24, color: '255, 190, 82', intensity: 0.64 }],
    steam: [{ x: 76.5, y: 83 }],
    motes: 14,
  },
  'ep2_courtyard_1948.webp': {
    sunbeams: [{ x: 49, y: 18, w: 16, angle: 16, alpha: 0.11, clip: { x: 43.5, y: 17, w: 14, h: 48 } }],
    foliageCanopy: { x: 6, y: 2, w: 36, h: 36 },
    leafClip: { x: 27, y: 18, w: 30, h: 46 },
    birdWindows: [{ x: 44.5, y: 21, w: 12, h: 11, count: 2 }],
    leaves: { count: 7, color: 'rgba(104, 138, 68, 0.58)', blossomColor: 'rgba(196, 77, 58, 0.52)' },
    steam: [{ x: 72.8, y: 74.5 }],
    motes: 18,
  },

  // Ch 4
  'ep3_haddad_classroom_1956.webp': {
    sunbeams: [{ x: 16, y: 12, w: 32, angle: 28, alpha: 0.12 }],
    glows: [{ x: 56.4, y: 64.5, r: 7.5, color: '255, 210, 110', intensity: 0.44 }],
    motes: 24,
  },
  'ep3_sinai_radio_1956.webp': {
    sunbeams: [{ x: 20, y: 22, w: 24, angle: 24, alpha: 0.09 }],
    glows: [
      { x: 5.5, y: 76.5, r: 13.5, color: '255, 190, 75', intensity: 0.6 },
      { x: 50.5, y: 64.5, r: 14.5, color: '255, 196, 85', intensity: 0.55 },
    ],
    motes: 20,
  },

  // Ch 5
  'ep4_galilee_water_1964.webp': {
    // Strictly between wooden porch posts (11%..63%) and above Noa's head (y <= 12%)!
    birdWindows: [{ x: 12, y: 2, w: 50, h: 10, count: 3 }],
    // Strictly open lake surface between hillside (26%) and Noa's shoulder (49%)!
    waterWindows: [{ x: 26, y: 19.5, w: 22, h: 11, color: '255, 252, 232', waves: 4 }],
    motes: 18,
  },
  'ep4_haddad_amman_1966.webp': {
    // Strictly right of stone wall (28%) and above distant hill crest & heads (y <= 11%)!
    birdWindows: [{ x: 29, y: 2, w: 42, h: 9, count: 2 }],
    steam: [
      { x: 47.5, y: 74 },
      { x: 66.8, y: 69 },
      { x: 81.2, y: 74 },
    ],
    motes: 18,
  },

  // Ch 6
  'ep5_june_1967.webp': {
    glows: [
      { x: 19.8, y: 27.5, r: 24, color: '255, 206, 98', intensity: 0.64 },
      { x: 25.8, y: 48.5, r: 10.5, color: '255, 210, 110', intensity: 0.48 },
    ],
    motes: 22,
  },
  'ep5_haddad_jordan_1967.webp': {
    // Strictly right of willow leaves (39%) and above Karim's hair (y <= 12%)!
    birdWindows: [{ x: 39, y: 2, w: 28, h: 10, count: 2 }],
    // Strictly open Jordan river water below broken timbers and left of plank bridge!
    waterWindows: [{ x: 20, y: 52, w: 25, h: 11, color: '255, 232, 165', waves: 4 }],
    motes: 18,
  },

  // Ch 7
  'ep6_doorway_1967.webp': {
    sunbeams: [{ x: 24, y: 10, w: 22, angle: 20, alpha: 0.11, clip: { x: 8, y: 10, w: 26, h: 55 } }],
    foliageCanopy: { x: 4, y: 2, w: 30, h: 36 },
    leafClip: { x: 6, y: 12, w: 26, h: 52 },
    leaves: { count: 7, color: 'rgba(104, 142, 68, 0.6)', blossomColor: 'rgba(198, 74, 56, 0.54)' },
    steam: [
      { x: 45.2, y: 73.5 },
      { x: 58.0, y: 72.5 },
    ],
    motes: 20,
  },

  // Ch 8
  'ep7_amman_table_1970.webp': {
    glows: [
      { x: 50.0, y: 14.0, r: 26, color: '255, 202, 98', intensity: 0.6 },
      { x: 58.8, y: 58.5, r: 7.5, color: '255, 190, 80', intensity: 0.42 },
    ],
    steam: [
      { x: 40.5, y: 60 },
      { x: 63.8, y: 59 },
    ],
    motes: 16,
  },
  'ep7_aloni_munich_1972.webp': {
    glows: [
      { x: 21.0, y: 46.5, r: 18, color: '195, 222, 255', intensity: 0.46, fastTv: true },
      { x: 43.2, y: 27.0, r: 15, color: '255, 212, 125', intensity: 0.42 },
      { x: 86.2, y: 77.5, r: 11, color: '255, 196, 82', intensity: 0.64 },
    ],
    motes: 14,
  },

  // Ch 9
  'ep8_october_1973.webp': {
    sunbeams: [{ x: 30, y: 8, w: 26, angle: 18, alpha: 0.11 }],
    motes: 20,
  },
  'ep8_haddad_amman_1973.webp': {
    glows: [
      { x: 56.5, y: 67.2, r: 9.5, color: '255, 202, 92', intensity: 0.54 },
      { x: 93.5, y: 71.0, r: 14.5, color: '255, 196, 82', intensity: 0.65 },
    ],
    motes: 18,
  },

  // Ch 10
  'ep9_jerusalem_1977.webp': {
    glows: [
      { x: 23.0, y: 56.0, r: 18, color: '215, 232, 255', intensity: 0.42, fastTv: true },
      { x: 64.0, y: 44.0, r: 19, color: '255, 206, 120', intensity: 0.32 },
    ],
    motes: 18,
  },
  'ep9_haddad_westbank_1978.webp': {
    // Strictly top-right open sky right of olive canopy (x >= 70%) and above cranes (y <= 18%)!
    birdWindows: [{ x: 70, y: 3, w: 26, h: 14, count: 2 }],
    motes: 18,
  },

  // Ch 11
  'ep10_aloni_telaviv_1982.webp': {
    glows: [
      { x: 3.2, y: 62.5, r: 5.2, color: '255, 212, 105', intensity: 0.6 },
      { x: 8.6, y: 63.5, r: 5.2, color: '255, 212, 105', intensity: 0.58 },
      { x: 14.0, y: 63.5, r: 5.2, color: '255, 212, 105', intensity: 0.6 },
      { x: 20.2, y: 63.0, r: 5.2, color: '255, 212, 105', intensity: 0.58 },
      { x: 35.0, y: 63.5, r: 5.2, color: '255, 212, 105', intensity: 0.6 },
      { x: 67.8, y: 63.0, r: 5.2, color: '255, 212, 105', intensity: 0.58 },
      { x: 73.2, y: 63.5, r: 5.2, color: '255, 212, 105', intensity: 0.56 },
      { x: 76.8, y: 64.5, r: 5.2, color: '255, 212, 105', intensity: 0.6 },
      { x: 85.8, y: 63.0, r: 5.2, color: '255, 212, 105', intensity: 0.58 },
    ],
    motes: 18,
  },
  'ep10_shuttered_street_1987.webp': {
    // Strictly open window sky between stone building (25%) and window frame (53%), above roof (14%)!
    birdWindows: [{ x: 25.5, y: 2, w: 27, h: 11, count: 2 }],
    motes: 18,
  },

  // Ch 12
  'ep11_courtyard_1995.webp': {
    // Strictly open left courtyard rain (left of central stone pillar at x=39%!)
    rainWindows: [{ x: 2, y: 4, w: 36.5, h: 86, count: 58, slant: -0.12 }],
    puddles: { x: 5, y: 74, w: 32, h: 18, count: 6 },
    glows: [{ x: 69.3, y: 70.5, r: 16, color: '255, 202, 88', intensity: 0.72 }],
  },
};

export class CourtyardLivingFx {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.camRigEl = null;
    this.viewportEl = null;
    this.baseCamClass = '';
    this.rafId = null;
    this.preset = null;

    this.particles = [];
    this.leaves = [];
    this.birdGroups = [];
    this.waterGroups = [];
    this.rainGroups = [];
    this.ripples = [];
    this.steamPuffs = [];
    this.hoverSparks = [];

    this.hoverTarget = null;
    this.solvedTarget = null;
    this.speakerTarget = null;

    this.targetMx = 0;
    this.targetMy = 0;
    this.currMx = 0;
    this.currMy = 0;
    this.boundMouseMove = null;
    this.boundMouseLeave = null;

    this.startTime = performance.now();
  }

  attach(canvasEl, sceneImgPath, camRigEl = null, viewportEl = null, baseCamClass = '') {
    this.stop();
    if (!canvasEl) return;

    const filename = String(sceneImgPath || '').split('/').pop();
    this.preset = SCENE_FX_PRESETS[filename] || { motes: 18 };
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.canvas.width = 640;
    this.canvas.height = 360;
    this.camRigEl = camRigEl;
    this.viewportEl = viewportEl;
    this.baseCamClass = baseCamClass || '';

    if (this.viewportEl) {
      this.boundMouseMove = (e) => {
        const r = this.viewportEl.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          this.targetMx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
          this.targetMy = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
        }
      };
      this.boundMouseLeave = () => {
        this.targetMx = 0;
        this.targetMy = 0;
      };
      this.viewportEl.addEventListener('mousemove', this.boundMouseMove, { passive: true });
      this.viewportEl.addEventListener('mouseleave', this.boundMouseLeave, { passive: true });
    }

    this.initEntities();
    this.loop();
  }

  setHoverTarget(target) {
    this.hoverTarget = target || null;
  }

  setSolvedTarget(target) {
    this.solvedTarget = target || null;
  }

  setSpeakerTarget(target) {
    this.speakerTarget = target || null;
  }

  setUnvisitedTargets(targets) {
    this.unvisitedTargets = Array.isArray(targets) ? targets : [];
  }

  initEntities() {
    const p = this.preset;
    const W = 640;
    const H = 360;

    // Dust motes
    const moteCount = p.motes || 0;
    this.particles = Array.from({ length: moteCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.85 + Math.random() * 1.4,
      vx: 0.08 + Math.random() * 0.16,
      vy: -0.06 - Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2,
    }));

    // Clipped outdoor courtyard leaves
    const leafCount = p.leaves?.count || 0;
    const lBox = p.leafClip || p.foliageCanopy || { x: 10, y: 10, w: 30, h: 40 };
    this.leaves = Array.from({ length: leafCount }, (_, i) => ({
      x: ((lBox.x + Math.random() * lBox.w) / 100) * W,
      y: ((lBox.y + Math.random() * lBox.h) / 100) * H,
      vx: 0.2 + Math.random() * 0.24,
      vy: 0.18 + Math.random() * 0.22,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.03,
      size: 3.0 + Math.random() * 2.2,
      isBlossom: Boolean(p.leaves?.blossomColor && i % 3 === 0),
      swayPhase: Math.random() * Math.PI * 2,
    }));

    // Depth-clipped Sky Bird Windows (glide behind stone arches cleanly at window edges!)
    this.birdGroups = (p.birdWindows || []).map((bw) => {
      const rx = (bw.x / 100) * W;
      const ry = (bw.y / 100) * H;
      const rw = (bw.w / 100) * W;
      const rh = (bw.h / 100) * H;
      const birds = Array.from({ length: bw.count || 2 }, (_, idx) => ({
        x: rx + Math.random() * rw,
        baseY: ry + rh * (0.28 + 0.44 * Math.random()),
        vx: (idx % 2 === 0 ? 1 : -1) * (0.2 + Math.random() * 0.16),
        flapSpeed: 3.2 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        span: 3.4 + Math.random() * 2.2,
      }));
      return { rx, ry, rw, rh, birds };
    });

    // Depth-clipped Water Windows
    this.waterGroups = (p.waterWindows || []).map((ww) => {
      const rx = (ww.x / 100) * W;
      const ry = (ww.y / 100) * H;
      const rw = (ww.w / 100) * W;
      const rh = (ww.h / 100) * H;
      const glints = Array.from({ length: 10 }, () => ({
        x: rx + Math.random() * Math.max(4, rw - 10),
        y: ry + Math.random() * rh,
        len: 5 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        speed: 1.4 + Math.random() * 1.4,
      }));
      const waves = Array.from({ length: ww.waves || 3 }, (_, idx) => ({
        x: rx + (idx / Math.max(1, ww.waves || 3)) * rw,
        y: ry + ((idx + 0.5) / Math.max(1, ww.waves || 3)) * rh,
        width: Math.min(rw * 0.65, 22 + Math.random() * 18),
        phase: idx * 1.4 + Math.random(),
        speed: 0.26 + Math.random() * 0.18,
      }));
      return { rx, ry, rw, rh, color: ww.color || '255, 245, 215', glints, waves };
    });

    // Depth-clipped Rain Windows
    this.rainGroups = (p.rainWindows || []).map((rwCfg) => {
      const rx = (rwCfg.x / 100) * W;
      const ry = (rwCfg.y / 100) * H;
      const rw = (rwCfg.w / 100) * W;
      const rh = (rwCfg.h / 100) * H;
      const drops = Array.from({ length: rwCfg.count || 32 }, () => ({
        x: rx + Math.random() * rw,
        y: ry + Math.random() * rh,
        len: 9 + Math.random() * 10,
        speed: 4.4 + Math.random() * 2.4,
      }));
      return { rx, ry, rw, rh, slant: rwCfg.slant || -0.12, drops };
    });

    // Puddle ripples
    const pudCfg = p.puddles;
    this.ripples = pudCfg
      ? Array.from({ length: pudCfg.count }, () => ({
          x: ((pudCfg.x + Math.random() * pudCfg.w) / 100) * W,
          y: ((pudCfg.y + Math.random() * pudCfg.h) / 100) * H,
          r: Math.random() * 10,
          maxR: 9 + Math.random() * 7,
        }))
      : [];

    // Rising tea/coffee steam wisps
    this.steamPuffs = [];
    (p.steam || []).forEach((src) => {
      for (let k = 0; k < 5; k++) {
        this.steamPuffs.push({
          baseX: (src.x / 100) * W,
          baseY: (src.y / 100) * H,
          life: k * 0.2,
          drift: (Math.random() - 0.5) * 6,
        });
      }
    });

    this.hoverSparks = [];
  }

  loop() {
    if (!this.ctx || !this.canvas || !this.canvas.isConnected) {
      this.stop();
      return;
    }

    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const t = (performance.now() - this.startTime) * 0.001;
    const p = this.preset;

    // Smooth 2.5D Mouse-Tilt + Breathing Camera Rig Interpolation
    // Note: #ct-living-fx-canvas lives INSIDE #ct-cam-rig, so background birds/waves/rain stay 100% locked
    // to their exact painted sky & archway coordinates without ever drifting onto foreground faces!
    this.currMx += (this.targetMx - this.currMx) * 0.075;
    this.currMy += (this.targetMy - this.currMy) * 0.075;
    const breathX = Math.sin(t * 0.55) * 2.6;
    const breathY = Math.cos(t * 0.42) * 1.6;

    if (this.camRigEl) {
      let panPctX = 0;
      let baseScale = 1.036;
      if (this.baseCamClass.includes('cam-focus-left')) {
        panPctX = 3.2;
        baseScale = 1.07;
      } else if (this.baseCamClass.includes('cam-focus-right')) {
        panPctX = -3.2;
        baseScale = 1.07;
      }
      const rigPxX = -this.currMx * 6.0 + breathX;
      const rigPxY = -this.currMy * 4.0 + breathY;
      this.camRigEl.style.transform = `scale(${baseScale}) translate(calc(${panPctX}% + ${rigPxX.toFixed(2)}px), ${rigPxY.toFixed(2)}px)`;
    }

    ctx.clearRect(0, 0, W, H);

    // 1. Slanted Volumetric Sunbeams (Clipped to archway if specified)
    if (p.sunbeams) {
      p.sunbeams.forEach((b, idx) => {
        ctx.save();
        if (b.clip) {
          ctx.beginPath();
          ctx.rect((b.clip.x / 100) * W, (b.clip.y / 100) * H, (b.clip.w / 100) * W, (b.clip.h / 100) * H);
          ctx.clip();
        }
        ctx.globalCompositeOperation = 'screen';
        const pulse = 0.85 + 0.15 * Math.sin(t * 0.7 + idx);
        const bx = (b.x / 100) * W;
        const by = (b.y / 100) * H;
        const bw = (b.w / 100) * W;
        ctx.translate(bx, by);
        ctx.rotate((b.angle * Math.PI) / 180);
        const grad = ctx.createLinearGradient(0, 0, 0, H * 0.85);
        grad.addColorStop(0, `rgba(255, 238, 185, ${(b.alpha * pulse).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(255, 238, 185, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(-bw / 2, 0, bw, H * 0.85);
        ctx.restore();
      });
    }

    // 2. Dappled Rustling Canopy Sunlight Caustics
    if (p.foliageCanopy) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const c = p.foliageCanopy;
      for (let i = 0; i < 5; i++) {
        const cx = ((c.x + c.w * (0.2 + 0.15 * i)) / 100) * W + Math.sin(t * 1.3 + i * 1.7) * 6;
        const cy = ((c.y + c.h * (0.28 + 0.14 * (i % 3))) / 100) * H + Math.cos(t * 1.1 + i) * 4;
        const rg = ctx.createRadialGradient(cx, cy, 1, cx, cy, 22);
        rg.addColorStop(0, 'rgba(255, 240, 180, 0.1)');
        rg.addColorStop(1, 'rgba(255, 240, 180, 0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 3. Depth-Clipped Water Windows (Waves & Shimmer Glints strictly on open water!)
    if (this.waterGroups.length) {
      this.waterGroups.forEach((wg) => {
        ctx.save();
        ctx.beginPath();
        ctx.rect(wg.rx, wg.ry, wg.rw, wg.rh);
        ctx.clip();
        ctx.globalCompositeOperation = 'screen';

        wg.waves.forEach((wv) => {
          wv.x += wv.speed;
          if (wv.x > wg.rx + wg.rw) wv.x = wg.rx - wv.width;
          const alpha = 0.2 + 0.09 * Math.sin(t * 1.4 + wv.phase);
          ctx.strokeStyle = `rgba(255, 252, 242, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          for (let dx = 0; dx <= wv.width; dx += 4) {
            const wy = wv.y + Math.sin(dx * 0.24 + t * 2.2 + wv.phase) * 1.2;
            if (dx === 0) ctx.moveTo(wv.x + dx, wy);
            else ctx.lineTo(wv.x + dx, wy);
          }
          ctx.stroke();
        });

        wg.glints.forEach((g) => {
          const a = Math.max(0, Math.sin(t * g.speed + g.phase)) * 0.38;
          if (a > 0.02) {
            ctx.strokeStyle = `rgba(${wg.color}, ${a.toFixed(3)})`;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            const sway = Math.sin(t * 0.9 + g.phase) * 3;
            ctx.moveTo(g.x + sway, g.y);
            ctx.lineTo(g.x + sway + g.len, g.y);
            ctx.stroke();
          }
        });

        ctx.restore();
      });
    }

    // 4. Depth-Clipped Distant Sky Birds (Clipped strictly inside open sky windows — disappear cleanly behind arches/pillars!)
    if (this.birdGroups.length) {
      this.birdGroups.forEach((bg) => {
        ctx.save();
        ctx.beginPath();
        ctx.rect(bg.rx, bg.ry, bg.rw, bg.rh);
        ctx.clip();
        ctx.strokeStyle = 'rgba(42, 34, 28, 0.52)';
        ctx.lineWidth = 1.15;
        ctx.lineCap = 'round';

        bg.birds.forEach((bd) => {
          bd.x += bd.vx;
          if (bd.vx > 0 && bd.x > bg.rx + bg.rw + 10) bd.x = bg.rx - 10;
          if (bd.vx < 0 && bd.x < bg.rx - 10) bd.x = bg.rx + bg.rw + 10;
          const by = Math.max(
            bg.ry + 4,
            Math.min(bg.ry + bg.rh - 4, bd.baseY + Math.sin(t * 0.85 + bd.phase) * 3.2),
          );
          const flap = Math.sin(t * bd.flapSpeed + bd.phase) * 2.4;
          ctx.beginPath();
          ctx.moveTo(bd.x - bd.span, by - flap);
          ctx.quadraticCurveTo(bd.x - bd.span * 0.4, by - 1.6, bd.x, by);
          ctx.quadraticCurveTo(bd.x + bd.span * 0.4, by - 1.6, bd.x + bd.span, by - flap);
          ctx.stroke();
        });

        ctx.restore();
      });
    }

    // 5. Flickering Lamps, Lanterns, Candles & Radio Dials
    if (p.glows) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      p.glows.forEach((g, idx) => {
        const speed = g.fastTv ? 7.5 : 3.2;
        const flicker =
          0.82 +
          0.11 * Math.sin(t * speed + idx * 2.1) +
          0.07 * Math.sin(t * (speed * 2.3) + idx * 0.7);
        const gx = (g.x / 100) * W;
        const gy = (g.y / 100) * H;
        const gr = (g.r / 100) * W * (0.95 + 0.08 * flicker);
        const alpha = Math.min(0.88, g.intensity * flicker);
        const grad = ctx.createRadialGradient(gx, gy, 1, gx, gy, gr);
        grad.addColorStop(0, `rgba(${g.color}, ${alpha.toFixed(3)})`);
        grad.addColorStop(0.45, `rgba(${g.color}, ${(alpha * 0.44).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${g.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    // 6. Persistent Golden Halo on Solved Puzzle Target
    if (this.solvedTarget) {
      const sx = (this.solvedTarget.x / 100) * W;
      const sy = (this.solvedTarget.y / 100) * H;
      const sr = Math.max(28, (Math.max(this.solvedTarget.w, this.solvedTarget.h) / 100) * W * 0.55);
      const pulse = 0.78 + 0.22 * Math.sin(t * 2.2);
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const sg = ctx.createRadialGradient(sx, sy, 2, sx, sy, sr);
      sg.addColorStop(0, `rgba(253, 224, 71, ${(0.38 * pulse).toFixed(3)})`);
      sg.addColorStop(0.55, `rgba(245, 158, 11, ${(0.16 * pulse).toFixed(3)})`);
      sg.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 6.5 Subtle Unvisited Discovery Candle-Glints (Eliminates blind pixel-hunting without ugly boxes!)
    if (this.unvisitedTargets && this.unvisitedTargets.length) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      this.unvisitedTargets.forEach((ut, idx) => {
        const ux = (ut.x / 100) * W;
        const uy = (ut.y / 100) * H;
        const wave = 0.5 + 0.5 * Math.sin(t * 2.1 + idx * 1.85);
        const haloR = ut.isPuzzleTarget ? 19 + wave * 5 : 13 + wave * 4;
        const haloAlpha = ut.isPuzzleTarget ? 0.16 + wave * 0.18 : 0.11 + wave * 0.14;

        const hg = ctx.createRadialGradient(ux, uy, 0.5, ux, uy, haloR);
        hg.addColorStop(0, `rgba(254, 240, 138, ${haloAlpha.toFixed(3)})`);
        hg.addColorStop(0.55, `rgba(245, 158, 11, ${(haloAlpha * 0.42).toFixed(3)})`);
        hg.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(ux, uy, haloR, 0, Math.PI * 2);
        ctx.fill();

        // Delicate 4-point starlet sparkle at center of unvisited object/person
        const starLen = (ut.isPuzzleTarget ? 5.2 : 3.8) * (0.72 + 0.36 * wave);
        const starAlpha = 0.35 + 0.48 * wave;
        ctx.strokeStyle = `rgba(255, 251, 220, ${starAlpha.toFixed(3)})`;
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.moveTo(ux - starLen, uy);
        ctx.lineTo(ux + starLen, uy);
        ctx.moveTo(ux, uy - starLen);
        ctx.lineTo(ux, uy + starLen);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 253, 240, ${Math.min(0.95, starAlpha + 0.15).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(ux, uy, 1.35, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    // 7. Rising Tea & Coffee Steam Wisps
    if (this.steamPuffs.length) {
      ctx.save();
      this.steamPuffs.forEach((sp) => {
        sp.life += 0.005;
        if (sp.life >= 1) sp.life = 0;
        const y = sp.baseY - sp.life * 26;
        const x = sp.baseX + Math.sin(sp.life * Math.PI * 2 + t * 1.7) * 4 + sp.drift * sp.life;
        const alpha = Math.sin(sp.life * Math.PI) * 0.3;
        const r = 3 + sp.life * 6.2;
        const g = ctx.createRadialGradient(x, y, 0.5, x, y, r);
        g.addColorStop(0, `rgba(255, 250, 240, ${alpha.toFixed(3)})`);
        g.addColorStop(1, 'rgba(255, 250, 240, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    // 8. Depth-Clipped Courtyard Leaves
    if (this.leaves.length && p.leaves) {
      const lBox = p.leafClip || p.foliageCanopy || { x: 10, y: 10, w: 30, h: 40 };
      const lx = (lBox.x / 100) * W;
      const ly = (lBox.y / 100) * H;
      const lw = (lBox.w / 100) * W;
      const lh = (lBox.h / 100) * H;
      ctx.save();
      ctx.beginPath();
      ctx.rect(lx, ly, lw, lh);
      ctx.clip();
      this.leaves.forEach((lf) => {
        lf.x += lf.vx + Math.sin(t * 1.4 + lf.swayPhase) * 0.24;
        lf.y += lf.vy;
        lf.rot += lf.vRot;
        if (lf.y > ly + lh || lf.x > lx + lw) {
          lf.x = lx + Math.random() * lw * 0.7;
          lf.y = ly - 4;
        }
        ctx.save();
        ctx.translate(lf.x, lf.y);
        ctx.rotate(lf.rot);
        ctx.fillStyle = lf.isBlossom ? p.leaves.blossomColor : p.leaves.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, lf.size, lf.size * 0.48, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      ctx.restore();
    }

    // 9. Subtle Sunlit Floating Dust Motes
    if (this.particles.length) {
      ctx.save();
      this.particles.forEach((pt) => {
        pt.x += pt.vx + Math.sin(t * 0.85 + pt.phase) * 0.12;
        pt.y += pt.vy;
        if (pt.x > W) pt.x = 0;
        if (pt.y < 0) pt.y = H;
        const a = 0.16 + 0.14 * Math.sin(t * 1.8 + pt.phase);
        ctx.fillStyle = `rgba(255, 242, 195, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    // 10. Depth-Clipped Rain Streaks & Puddle Ripples (Never crosses tent walls or indoor faces!)
    if (this.rainGroups.length) {
      this.rainGroups.forEach((rg) => {
        ctx.save();
        ctx.beginPath();
        ctx.rect(rg.rx, rg.ry, rg.rw, rg.rh);
        ctx.clip();
        ctx.strokeStyle = 'rgba(215, 232, 252, 0.42)';
        ctx.lineWidth = 1.1;
        rg.drops.forEach((d) => {
          d.y += d.speed;
          d.x += d.speed * rg.slant;
          if (d.y > rg.ry + rg.rh || d.x < rg.rx - 8) {
            d.y = rg.ry - 8;
            d.x = rg.rx + Math.random() * (rg.rw + 10);
          }
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + d.len * rg.slant, d.y + d.len);
          ctx.stroke();
        });
        ctx.restore();
      });
    }

    if (p.puddles && this.ripples.length) {
      ctx.save();
      this.ripples.forEach((rp) => {
        rp.r += 0.18;
        if (rp.r > rp.maxR) {
          rp.r = 0.5;
          rp.x = ((p.puddles.x + Math.random() * p.puddles.w) / 100) * W;
          rp.y = ((p.puddles.y + Math.random() * p.puddles.h) / 100) * H;
        }
        const alpha = (1 - rp.r / rp.maxR) * 0.42;
        ctx.strokeStyle = `rgba(224, 238, 255, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.05;
        ctx.beginPath();
        ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();
    }

    // 11. Active Speaker Theatre Spotlight Dimming
    if (this.speakerTarget) {
      const sx = (this.speakerTarget.x / 100) * W;
      const sy = (this.speakerTarget.y / 100) * H;
      const sr = Math.max(65, (Math.max(this.speakerTarget.w, this.speakerTarget.h) / 100) * W * 0.72);
      ctx.save();
      const maskGrad = ctx.createRadialGradient(sx, sy, sr * 0.25, sx, sy, sr * 1.45);
      maskGrad.addColorStop(0, 'rgba(255, 238, 190, 0)');
      maskGrad.addColorStop(0.55, 'rgba(14, 11, 8, 0.07)');
      maskGrad.addColorStop(1, 'rgba(12, 9, 6, 0.22)');
      ctx.fillStyle = maskGrad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // 12. Borderless Hover Firefly Sparkles
    if (this.hoverTarget && this.hoverSparks.length < 14 && Math.random() < 0.45) {
      const hx = (this.hoverTarget.x / 100) * W;
      const hy = (this.hoverTarget.y / 100) * H;
      const spreadX = Math.max(18, (this.hoverTarget.w / 100) * W * 0.34);
      const spreadY = Math.max(16, (this.hoverTarget.h / 100) * H * 0.34);
      this.hoverSparks.push({
        x: hx + (Math.random() - 0.5) * spreadX * 2,
        y: hy + (Math.random() - 0.5) * spreadY * 2,
        vy: -0.35 - Math.random() * 0.45,
        vx: (Math.random() - 0.5) * 0.3,
        life: 0,
        r: 1.5 + Math.random() * 1.8,
        emerald: Boolean(this.hoverTarget.isUseMode),
      });
    }

    if (this.hoverSparks.length) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      this.hoverSparks = this.hoverSparks.filter((sp) => {
        sp.life += 0.032;
        sp.x += sp.vx;
        sp.y += sp.vy;
        if (sp.life >= 1) return false;
        const a = Math.sin(sp.life * Math.PI) * 0.85;
        ctx.fillStyle = sp.emerald
          ? `rgba(110, 231, 183, ${a.toFixed(3)})`
          : `rgba(253, 224, 71, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      ctx.restore();
    }

    this.rafId = requestAnimationFrame(() => this.loop());
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.viewportEl && this.boundMouseMove) {
      this.viewportEl.removeEventListener('mousemove', this.boundMouseMove);
      this.viewportEl.removeEventListener('mouseleave', this.boundMouseLeave);
    }
    this.boundMouseMove = null;
    this.boundMouseLeave = null;
    this.hoverTarget = null;
  }
}

export const courtyardLivingFx = new CourtyardLivingFx();
