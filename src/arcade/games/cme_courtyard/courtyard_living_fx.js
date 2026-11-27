/**
 * Courtyard of Two Keys — 60 FPS Living Graphic-Novel & 2.5D Parallax Engine (Director's Cut 3.6)
 *
 * Architectural Depth-Clipped Scene Presets:
 *  - Every sky bird, wave crest, rain streak, and drifting leaf is strictly clipped (`ctx.clip()`)
 *    to verified unobstructed architectural/sky/water windows so background elements NEVER cross
 *    in front of character faces, bodies, ship masts, tent canvas, or stone pillars!
 */

const SCENE_FX_PRESETS = {
  // Subtle museum-grade archival dust motes & gentle memorial candlelight (zero cartoon overlays over authentic photographs)
  'cme_l0_banner_damascus_gate_jerusalem.jpg': { motes: 12 },
  'jerusalem_mandate_panorama_1920.jpg': { motes: 12 },
  'jewish_immigrants_haifa_1949.jpg': { motes: 10 },
  'cme_l1_b4_unscop_jerusalem_1947.jpg': { motes: 10 },
  'exodus_ship.jpg': { motes: 10 },
  'nakba_unrwa_khan_younis_1948.jpg': { motes: 10 },
  'cme_plate_beit_lid_maabara_1950.jpg': { motes: 10 },
  'cme_l3_banner_suez_canal_transit.jpg': { motes: 10 },
  'cme_l3_sinai_campaign_trenches_1956.jpg': { motes: 12 },
  'cme_l4_banner_galilee_golan_gamla.jpg': { motes: 10 },
  'cme_l4_srca_ahmad_shukeiri_1965.jpg': { motes: 10 },
  'cme_l5_tal_armoured_division_sinai_1967.jpg': { motes: 12 },
  'cme_palestinian_refugees_1948.jpg': { motes: 10 },
  'cme_l6_banner_east_jerusalem_temple_mount.jpg': { motes: 12 },
  'cme_plate_amman_camp_black_september_1970.jpg': { motes: 10 },
  'cme_l7_munich_olympic_village_1972.jpg': { motes: 8 },
  'cme_l8_yom_kippur_suez_pontoon_bridge_1973.jpg': { motes: 10 },
  'cme_opec_oil_embargo_pump_1973.jpg': { motes: 8 },
  'cme_l9_cameo_carter_sadat_begin_camp_david_1978.jpg': { motes: 10 },
  'cme_plate_kfar_etzion_settlement_1967.jpg': { motes: 10 },
  'cme_l10_iconic_lebanon_sea_evacuation_1982.jpg': { motes: 10 },
  'cme_l10_b3_gaza_first_intifada_dec_1987.jpg': { motes: 10 },
  'cme_plate_rabin_memorial_candles_1995.jpg': {
    glows: [{ x: 50.0, y: 65.0, r: 22, color: '255, 202, 88', intensity: 0.24 }],
    motes: 12,
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
