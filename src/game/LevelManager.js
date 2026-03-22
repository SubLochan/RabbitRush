import { LEVELS, THEMES, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';
import { Carrot } from './Carrot.js';
import { Obstacle } from './Obstacle.js';

export class LevelManager {
  constructor() {
    this.currentLevel = 0;
    this.platforms = [];
    this.carrots = [];
    this.obstacles = [];
    this.clouds = [];
    this.particles = [];
    this.backgroundElements = [];
    this.lightningTimer = 0;
    this.lightningActive = false;
  }

  get levelConfig() {
    return LEVELS[Math.min(this.currentLevel, LEVELS.length - 1)];
  }
  get isLastLevel() {
    return this.currentLevel >= LEVELS.length - 1;
  }
  get theme() {
    return THEMES[this.levelConfig.theme] || THEMES.meadow;
  }

  buildLevel(levelIndex) {
    this.currentLevel = levelIndex;
    this.platforms = [];
    this.carrots = [];
    this.obstacles = [];
    this.particles = [];
    this.lightningTimer = 0;
    this.lightningActive = false;

    const cfg = this.levelConfig;
    this.platforms = this._generatePlatforms(cfg.platformCount, cfg.narrowPlatforms);

    const carrotPositions = this._generateCarrotPositions(cfg.carrotsToCollect);
    this.carrots = carrotPositions.map(pos => new Carrot(pos.x, pos.y));

    for (let i = 0; i < cfg.obstacleCount; i++) {
      const startIdx = levelIndex === 0 ? 1 : 0;
      const pi = (i + startIdx) % this.platforms.length;
      const platform = this.platforms[pi];
      // Levels 8-10 spawn more hawks (every 3rd = hawk, else fox); earlier = every 4th
      const hawkFreq = cfg.moreHawks ? 3 : 4;
      const type = i % hawkFreq === 0 ? 'hawk' : 'fox';
      const spd = cfg.enemySlow
        ? cfg.obstacleSpeed * (0.8 + Math.random() * 0.3)
        : cfg.obstacleSpeed * (0.85 + Math.random() * 0.3);
      const ox = platform
        ? platform.x + 20 + Math.random() * Math.max(platform.width - 64, 20)
        : Math.random() * (CANVAS_WIDTH - 120) + 60;
      const oy = platform ? platform.y - 50 : GROUND_Y - 50;
      this.obstacles.push(new Obstacle(ox, oy, spd, type, platform, cfg.fastBounce));
    }

    const cloudCount = cfg.theme === 'storm' ? 8 : cfg.theme === 'cave' ? 3 : 7;
    this.clouds = Array.from({ length: cloudCount }, () => ({
      x: Math.random() * CANVAS_WIDTH,
      y: 30 + Math.random() * 120,
      width: 90 + Math.random() * 80,
      speed: 0.22 + Math.random() * 0.28,
    }));

    const bgCount = cfg.theme === 'cave' || cfg.theme === 'storm' ? 5 : 10;
    this.backgroundElements = Array.from({ length: bgCount }, (_, i) => ({
      x: i * (CANVAS_WIDTH / bgCount) + 20,
      y: GROUND_Y - 40,
      type: Math.random() > 0.5 ? 'tree' : 'bush',
      scale: 0.7 + Math.random() * 0.6,
    }));
  }

  _generatePlatforms(count, narrow = false) {
    const platforms = [];
    // 4 height rows for the bigger canvas
    const rows = [
      GROUND_Y - 140,
      GROUND_Y - 260,
      GROUND_Y - 380,
      GROUND_Y - 480,
    ];
    const minW = narrow ? 100 : 170;
    const maxW = narrow ? 170 : 280;
    const minGap = narrow ? 10 : 20;

    for (let i = 0; i < count; i++) {
      let tries = 0, placed = false;
      while (tries++ < 50 && !placed) {
        const w = minW + Math.random() * (maxW - minW);
        const row = rows[i % rows.length];
        const x = 50 + Math.random() * (CANVAS_WIDTH - w - 100);
        const ok = platforms.every(p =>
          Math.abs(p.x - x) > w + minGap || Math.abs(p.y - row) > 10
        );
        if (ok) { platforms.push({ x, y: row, width: w, height: 20 }); placed = true; }
      }
      if (!placed) {
        const w = minW + 20;
        const row = rows[i % rows.length];
        const x = 50 + i * (CANVAS_WIDTH - w - 100) / Math.max(count - 1, 1);
        platforms.push({ x, y: row, width: w, height: 20 });
      }
    }
    return platforms;
  }

  _generateCarrotPositions(count) {
    const positions = [];
    const allSurfaces = [
      { x: 20, y: GROUND_Y - 40, width: CANVAS_WIDTH - 40 },
      ...this.platforms.map(p => ({ x: p.x, y: p.y - 40, width: p.width })),
    ];
    for (let i = 0; i < count; i++) {
      const surface = allSurfaces[i % allSurfaces.length];
      const x = surface.x + 16 + Math.random() * Math.max(surface.width - 60, 20);
      positions.push({ x, y: surface.y });
    }
    return positions;
  }

  addParticle(x, y, color = '#FFD700') {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * (1 + Math.random() * 4),
        vy: Math.sin(angle) * (1 + Math.random() * 4) - 2,
        life: 35, maxLife: 35, color, size: 3 + Math.random() * 4,
      });
    }
  }

  update() {
    this.clouds.forEach(c => { c.x += c.speed; if (c.x > CANVAS_WIDTH + c.width) c.x = -c.width; });
    this.particles = this.particles.filter(p => p.life > 0);
    this.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--; });
    this.carrots.forEach(c => c.update());
    this.obstacles.forEach(o => o.update(this.platforms));

    // Storm level: random lightning flashes
    if (this.levelConfig.theme === 'storm') {
      this.lightningTimer--;
      if (this.lightningTimer <= 0) {
        this.lightningActive = true;
        this.lightningTimer = 120 + Math.floor(Math.random() * 180);
        setTimeout(() => { this.lightningActive = false; }, 80);
      }
    }
  }

  drawBackground(ctx) {
    const t = this.theme;

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    skyGrad.addColorStop(0, t.skyTop);
    skyGrad.addColorStop(1, t.skyBot);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Lightning flash for storm theme
    if (this.lightningActive) {
      ctx.fillStyle = 'rgba(200,200,255,0.18)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Clouds / particles
    const cloudColor = this.levelConfig.theme === 'cave' || this.levelConfig.theme === 'storm'
      ? 'rgba(80,80,120,0.4)'
      : this.levelConfig.theme === 'volcano'
        ? 'rgba(120,40,20,0.5)'
        : 'rgba(255,255,255,0.82)';
    ctx.fillStyle = cloudColor;
    this.clouds.forEach(cloud => {
      ctx.beginPath();
      ctx.arc(cloud.x,               cloud.y,      cloud.width * 0.28, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.width * 0.22, cloud.y - 10, cloud.width * 0.20, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.width * 0.44, cloud.y - 5,  cloud.width * 0.25, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.width * 0.64, cloud.y,      cloud.width * 0.18, 0, Math.PI * 2);
      ctx.fill();
    });

    // Volcano: lava glow at horizon
    if (this.levelConfig.theme === 'volcano') {
      const lavaGrad = ctx.createLinearGradient(0, GROUND_Y - 80, 0, GROUND_Y);
      lavaGrad.addColorStop(0, 'rgba(255,80,0,0)');
      lavaGrad.addColorStop(1, 'rgba(255,60,0,0.35)');
      ctx.fillStyle = lavaGrad;
      ctx.fillRect(0, GROUND_Y - 80, CANVAS_WIDTH, 80);
    }

    // Background decorations
    this.backgroundElements.forEach(el => {
      ctx.save();
      ctx.translate(el.x, el.y);
      ctx.scale(el.scale, el.scale);
      const theme = this.levelConfig.theme;
      if (theme === 'cave' || theme === 'storm') {
        // Stalactite shapes
        ctx.fillStyle = theme === 'storm' ? '#1a1a33' : '#333344';
        ctx.beginPath();
        ctx.moveTo(0, -10); ctx.lineTo(-12, -55); ctx.lineTo(12, -55); ctx.closePath();
        ctx.fill();
      } else if (theme === 'volcano') {
        // Rocky spike
        ctx.fillStyle = '#4a1a00';
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(-15, -50); ctx.lineTo(15, -50); ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ff4400';
        ctx.beginPath();
        ctx.arc(-8, -52, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (el.type === 'tree') {
        ctx.fillStyle = '#5D4037'; ctx.fillRect(-5, -36, 10, 36);
        ctx.fillStyle = '#388E3C'; ctx.beginPath(); ctx.arc(0, -48, 26, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2E7D32'; ctx.beginPath(); ctx.arc(-10, -54, 17, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = '#558B2F';
        ctx.beginPath(); ctx.arc(0, -12, 20, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(-16, -8, 16, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(16, -8, 16, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });

    // Ground
    ctx.fillStyle = t.groundFill;
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
    ctx.fillStyle = t.grassTop;
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 14);
    ctx.fillStyle = t.grassBlade;
    for (let gx = 0; gx < CANVAS_WIDTH; gx += 14) {
      ctx.beginPath(); ctx.moveTo(gx, GROUND_Y + 14); ctx.lineTo(gx + 5, GROUND_Y - 2); ctx.lineTo(gx + 10, GROUND_Y + 14); ctx.fill();
    }

    // Cave/volcano/storm: dim overlay for atmosphere
    if (['cave','volcano','storm'].includes(this.levelConfig.theme)) {
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }

  drawPlatforms(ctx) {
    const theme = this.levelConfig.theme;
    this.platforms.forEach(p => {
      // Platform colours by theme
      let topColor, bodyTop, bodyBot;
      if (theme === 'cave')    { topColor = '#546E7A'; bodyTop = '#37474F'; bodyBot = '#263238'; }
      else if (theme === 'volcano') { topColor = '#B71C1C'; bodyTop = '#6D1111'; bodyBot = '#3E0000'; }
      else if (theme === 'storm')   { topColor = '#283593'; bodyTop = '#1A237E'; bodyBot = '#0D0D4A'; }
      else { topColor = '#5CB85C'; bodyTop = '#A0522D'; bodyBot = '#6D3B1A'; }

      const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
      grad.addColorStop(0, bodyTop); grad.addColorStop(1, bodyBot);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.roundRect(p.x, p.y, p.width, p.height, 5); ctx.fill();

      ctx.fillStyle = topColor;
      ctx.beginPath(); ctx.roundRect(p.x, p.y, p.width, 8, [5, 5, 0, 0]); ctx.fill();

      // Glow edges on dark themes
      if (['cave','volcano','storm'].includes(theme)) {
        ctx.strokeStyle = theme === 'volcano' ? 'rgba(255,80,0,0.4)' : 'rgba(100,150,255,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(p.x, p.y, p.width, p.height, 5); ctx.stroke();
      }

      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(p.x + 5, p.y + p.height, p.width - 10, 6);
    });
  }

  drawObjects(ctx) {
    this.carrots.forEach(c => c.draw(ctx));
    this.obstacles.forEach(o => o.draw(ctx));
    this.particles.forEach(p => {
      ctx.save(); ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
  }

  get collectedCount() { return this.carrots.filter(c => c.collected).length; }
  get totalCarrots()   { return this.carrots.length; }
}
