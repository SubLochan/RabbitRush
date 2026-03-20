import { LEVELS, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';
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
  }

  get levelConfig() {
    return LEVELS[Math.min(this.currentLevel, LEVELS.length - 1)];
  }

  get isLastLevel() {
    return this.currentLevel >= LEVELS.length - 1;
  }

  buildLevel(levelIndex) {
    this.currentLevel = levelIndex;
    this.platforms = [];
    this.carrots = [];
    this.obstacles = [];
    this.particles = [];

    const cfg = this.levelConfig;
    this.platforms = this._generatePlatforms(cfg.platformCount);

    const carrotPositions = this._generateCarrotPositions(cfg.carrotsToCollect);
    this.carrots = carrotPositions.map(pos => new Carrot(pos.x, pos.y));

    for (let i = 0; i < cfg.obstacleCount; i++) {
      // Level 1: skip platform index 0 to keep spawn area safe
      const startIdx = levelIndex === 0 ? 1 : 0;
      const pi = (i + startIdx) % this.platforms.length;
      const platform = this.platforms[pi];
      const type = i % 4 === 0 ? 'hawk' : 'fox';
      const spd = cfg.enemySlow
        ? cfg.obstacleSpeed * (0.8 + Math.random() * 0.3)
        : cfg.obstacleSpeed * (0.85 + Math.random() * 0.3);
      const ox = platform
        ? platform.x + Math.random() * (platform.width - 48)
        : Math.random() * (CANVAS_WIDTH - 100) + 50;
      const oy = platform ? platform.y - 44 : GROUND_Y - 44;
      this.obstacles.push(new Obstacle(ox, oy, spd, type));
    }

    this.clouds = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * CANVAS_WIDTH,
      y: 30 + Math.random() * 100,
      width: 80 + Math.random() * 60,
      speed: 0.2 + Math.random() * 0.3,
    }));

    this.backgroundElements = Array.from({ length: 8 }, (_, i) => ({
      x: i * 120 + 20,
      y: GROUND_Y - 40,
      type: Math.random() > 0.5 ? 'tree' : 'bush',
      scale: 0.7 + Math.random() * 0.5,
    }));
  }

  _generatePlatforms(count) {
    const platforms = [];
    const rows = [GROUND_Y - 120, GROUND_Y - 210, GROUND_Y - 300];
    const minGap = this.currentLevel === 0 ? 30 : 10;

    for (let i = 0; i < count; i++) {
      let tries = 0, placed = false;
      while (tries++ < 30 && !placed) {
        const w = 90 + Math.random() * 80;
        const row = rows[i % rows.length];
        const x = 60 + Math.random() * (CANVAS_WIDTH - w - 120);
        const ok = platforms.every(p => Math.abs(p.x - x) > w + minGap || Math.abs(p.y - row) > 10);
        if (ok) { platforms.push({ x, y: row, width: w, height: 18 }); placed = true; }
      }
      if (!placed) {
        const w = 100, row = rows[i % rows.length];
        const x = 60 + i * (CANVAS_WIDTH - 170) / Math.max(count - 1, 1);
        platforms.push({ x, y: row, width: w, height: 18 });
      }
    }
    return platforms;
  }

  _generateCarrotPositions(count) {
    const positions = [];
    const allSurfaces = [
      { x: 0, y: GROUND_Y - 36, width: CANVAS_WIDTH },
      ...this.platforms.map(p => ({ x: p.x, y: p.y - 36, width: p.width })),
    ];
    for (let i = 0; i < count; i++) {
      const surface = allSurfaces[i % allSurfaces.length];
      const x = surface.x + 16 + Math.random() * Math.max(surface.width - 60, 20);
      positions.push({ x, y: surface.y });
    }
    return positions;
  }

  addParticle(x, y, color = '#FFD700') {
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * (1 + Math.random() * 3),
        vy: Math.sin(angle) * (1 + Math.random() * 3) - 2,
        life: 30, maxLife: 30, color, size: 3 + Math.random() * 3,
      });
    }
  }

  update() {
    this.clouds.forEach(c => { c.x += c.speed; if (c.x > CANVAS_WIDTH + c.width) c.x = -c.width; });
    this.particles = this.particles.filter(p => p.life > 0);
    this.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--; });
    this.carrots.forEach(c => c.update());
    this.obstacles.forEach(o => o.update(this.platforms));
  }

  drawBackground(ctx) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    skyGrad.addColorStop(0, '#6BB8D4');
    skyGrad.addColorStop(0.6, '#ACD6E8');
    skyGrad.addColorStop(1, '#D4EFF7');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    this.clouds.forEach(cloud => {
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.width * 0.28, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.width * 0.22, cloud.y - 10, cloud.width * 0.20, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.width * 0.42, cloud.y - 5, cloud.width * 0.25, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.width * 0.62, cloud.y, cloud.width * 0.18, 0, Math.PI * 2);
      ctx.fill();
    });

    this.backgroundElements.forEach(el => {
      ctx.save();
      ctx.translate(el.x, el.y);
      ctx.scale(el.scale, el.scale);
      if (el.type === 'tree') {
        ctx.fillStyle = '#5D4037'; ctx.fillRect(-4, -30, 8, 30);
        ctx.fillStyle = '#388E3C'; ctx.beginPath(); ctx.arc(0, -40, 22, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2E7D32'; ctx.beginPath(); ctx.arc(-8, -45, 14, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = '#558B2F';
        ctx.beginPath(); ctx.arc(0, -10, 18, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(-14, -6, 14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(14, -6, 14, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });

    ctx.fillStyle = '#5D4037'; ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
    ctx.fillStyle = '#4CAF50'; ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 12);
    ctx.fillStyle = '#388E3C';
    for (let gx = 0; gx < CANVAS_WIDTH; gx += 12) {
      ctx.beginPath(); ctx.moveTo(gx, GROUND_Y + 12); ctx.lineTo(gx + 4, GROUND_Y - 2); ctx.lineTo(gx + 8, GROUND_Y + 12); ctx.fill();
    }
  }

  drawPlatforms(ctx) {
    this.platforms.forEach(p => {
      const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
      grad.addColorStop(0, '#A0522D'); grad.addColorStop(1, '#6D3B1A');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.roundRect(p.x, p.y, p.width, p.height, 4); ctx.fill();
      ctx.fillStyle = '#5CB85C'; ctx.beginPath(); ctx.roundRect(p.x, p.y, p.width, 7, [4, 4, 0, 0]); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(p.x + 4, p.y + p.height, p.width - 8, 5);
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
  get totalCarrots() { return this.carrots.length; }
}
