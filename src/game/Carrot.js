import { CARROT } from '../config.js';

export class Carrot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = CARROT.WIDTH;
    this.height = CARROT.HEIGHT;
    this.collected = false;
    this.points = CARROT.POINTS;
    this.bobOffset = Math.random() * Math.PI * 2;
    this.bobTimer = 0;
    this.glowTimer = 0;
    this.sparkles = [];
  }

  update() {
    this.bobTimer += 0.05;
    this.glowTimer += 0.08;
    this.sparkles = this.sparkles.filter(s => s.life > 0);
    this.sparkles.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.life--;
      s.alpha = s.life / s.maxLife;
    });
  }

  collect() {
    this.collected = true;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      this.sparkles.push({
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        vx: Math.cos(angle) * (2 + Math.random() * 3),
        vy: Math.sin(angle) * (2 + Math.random() * 3),
        life: 25,
        maxLife: 25,
        alpha: 1,
        color: Math.random() > 0.5 ? '#FF6B35' : '#FFD700',
      });
    }
  }

  getBounds() {
    return {
      x: this.x + 4,
      y: this.y + 4,
      width: this.width - 8,
      height: this.height - 8,
    };
  }

  draw(ctx) {
    const bob = Math.sin(this.bobTimer + this.bobOffset) * 4;
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2 + bob;

    // Glow
    if (!this.collected) {
      const glow = Math.sin(this.glowTimer) * 0.3 + 0.7;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24);
      grad.addColorStop(0, `rgba(255, 107, 53, ${glow * 0.4})`);
      grad.addColorStop(1, 'rgba(255, 107, 53, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!this.collected) {
      // Carrot body
      ctx.fillStyle = '#FF6B35';
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy - 10);
      ctx.lineTo(cx + 8, cy - 10);
      ctx.lineTo(cx + 4, cy + 12);
      ctx.lineTo(cx - 4, cy + 12);
      ctx.closePath();
      ctx.fill();

      // Carrot stripes
      ctx.strokeStyle = '#E55A25';
      ctx.lineWidth = 1.5;
      for (let i = -6; i <= 6; i += 4) {
        ctx.beginPath();
        const frac = (i + 10) / 20;
        const hw = 8 - frac * 4;
        ctx.moveTo(cx - hw, cy + i);
        ctx.lineTo(cx + hw, cy + i);
        ctx.stroke();
      }

      // Leaves
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.ellipse(cx - 4, cy - 14, 4, 9, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 4, cy - 15, 4, 9, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx, cy - 16, 3, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sparkles
    this.sparkles.forEach(s => {
      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}
