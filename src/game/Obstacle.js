import { CANVAS_WIDTH, GROUND_Y } from '../config.js';

export class Obstacle {
  constructor(x, y, speed, type = 'fox') {
    this.x = x;
    this.y = y;
    this.width = 44;
    this.height = 44;
    this.speed = speed;
    this.direction = Math.random() > 0.5 ? 1 : -1;
    this.type = type;
    this.animTimer = 0;
    this.animFrame = 0;
    this.bounceTimer = Math.random() * Math.PI * 2;
  }

  update(platforms) {
    this.x += this.speed * this.direction;
    this.bounceTimer += 0.07;
    this.animTimer++;
    if (this.animTimer > 10) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 2;
    }

    // Reverse at walls
    if (this.x <= 0 || this.x + this.width >= CANVAS_WIDTH) {
      this.direction *= -1;
    }

    // Platform edge reversal
    for (const platform of platforms) {
      if (this.y + this.height >= platform.y &&
        this.y < platform.y + platform.height) {
        if (this.direction === 1 && this.x + this.width > platform.x + platform.width) {
          this.direction = -1;
        }
        if (this.direction === -1 && this.x < platform.x) {
          this.direction = 1;
        }
      }
    }
  }

  getBounds() {
    return {
      x: this.x + 6,
      y: this.y + 6,
      width: this.width - 12,
      height: this.height - 12,
    };
  }

  draw(ctx) {
    const x = this.x;
    const y = this.y + Math.sin(this.bounceTimer) * 2;
    const w = this.width;
    const h = this.height;
    const flip = this.direction === -1;

    ctx.save();
    if (flip) {
      ctx.translate(x + w / 2, y + h / 2);
      ctx.scale(-1, 1);
      ctx.translate(-(x + w / 2), -(y + h / 2));
    }

    if (this.type === 'fox') {
      this.drawFox(ctx, x, y, w, h);
    } else {
      this.drawHawk(ctx, x, y, w, h);
    }

    ctx.restore();
  }

  drawFox(ctx, x, y, w, h) {
    // Body
    ctx.fillStyle = '#E67E22';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h * 0.65, w * 0.35, h * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#E67E22';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.62, y + h * 0.35, w * 0.25, h * 0.22, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.fillStyle = '#F0A07A';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.78, y + h * 0.42, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#E67E22';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.52, y + h * 0.18);
    ctx.lineTo(x + w * 0.46, y + h * 0.03);
    ctx.lineTo(x + w * 0.62, y + h * 0.18);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + w * 0.65, y + h * 0.17);
    ctx.lineTo(x + w * 0.62, y + h * 0.03);
    ctx.lineTo(x + w * 0.76, y + h * 0.18);
    ctx.fill();

    // Inner ears
    ctx.fillStyle = '#FFB3BA';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.53, y + h * 0.18);
    ctx.lineTo(x + w * 0.49, y + h * 0.07);
    ctx.lineTo(x + w * 0.61, y + h * 0.18);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.arc(x + w * 0.7, y + h * 0.32, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#27AE60';
    ctx.beginPath();
    ctx.arc(x + w * 0.7, y + h * 0.32, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.arc(x + w * 0.83, y + h * 0.4, 2, 0, Math.PI * 2);
    ctx.fill();

    // White belly
    ctx.fillStyle = '#FAD7A0';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.45, y + h * 0.67, w * 0.18, h * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.fillStyle = '#E67E22';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.1, y + h * 0.6, 10, 18, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x + w * 0.07, y + h * 0.48, 5, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    const legAnim = this.animFrame === 0 ? 3 : -3;
    ctx.fillStyle = '#E67E22';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.38, y + h * 0.9 + legAnim, 6, 8, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w * 0.58, y + h * 0.9 - legAnim, 6, 8, -0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawHawk(ctx, x, y, w, h) {
    const wingSpan = this.animFrame === 0 ? 0.8 : 0.6;

    // Wings
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.2, y + h * 0.4, w * wingSpan, h * 0.15, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w * 0.8, y + h * 0.4, w * wingSpan, h * 0.15, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#795548';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h * 0.5, w * 0.22, h * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#8D6E63';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.28, 11, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#FDD835';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.58, y + h * 0.3);
    ctx.lineTo(x + w * 0.72, y + h * 0.35);
    ctx.lineTo(x + w * 0.58, y + h * 0.4);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = '#FDD835';
    ctx.beginPath();
    ctx.arc(x + w * 0.56, y + h * 0.27, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.arc(x + w * 0.57, y + h * 0.27, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}
