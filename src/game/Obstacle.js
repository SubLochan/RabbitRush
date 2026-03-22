import { CANVAS_WIDTH } from '../config.js';

export class Obstacle {
  constructor(x, y, speed, type = 'fox', platform = null, fastBounce = false) {
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 48;
    this.speed = speed;
    this.direction = Math.random() > 0.5 ? 1 : -1;
    this.type = type;
    this.animTimer = 0;
    this.animFrame = 0;
    this.bounceTimer = Math.random() * Math.PI * 2;
    this.assignedPlatform = platform;
    // fastBounce (level 10): shorter cooldown so enemies feel aggressive
    this.dirCooldown = 0;
    this.cooldownFrames = fastBounce ? 12 : 30;
  }

  update(platforms) {
    this.x += this.speed * this.direction;
    this.bounceTimer += 0.07;
    this.animTimer++;
    if (this.animTimer > 10) { this.animTimer = 0; this.animFrame = (this.animFrame + 1) % 2; }

    if (this.dirCooldown > 0) { this.dirCooldown--; return; }

    if (this.x <= 0) {
      this.x = 0; this.direction = 1; this.dirCooldown = this.cooldownFrames; return;
    }
    if (this.x + this.width >= CANVAS_WIDTH) {
      this.x = CANVAS_WIDTH - this.width; this.direction = -1; this.dirCooldown = this.cooldownFrames; return;
    }

    const patrol = this.assignedPlatform;
    if (patrol) {
      if (this.direction === 1 && this.x + this.width >= patrol.x + patrol.width - 4) {
        this.x = patrol.x + patrol.width - this.width - 4;
        this.direction = -1; this.dirCooldown = this.cooldownFrames; return;
      }
      if (this.direction === -1 && this.x <= patrol.x + 4) {
        this.x = patrol.x + 4;
        this.direction = 1; this.dirCooldown = this.cooldownFrames; return;
      }
    } else {
      for (const platform of platforms) {
        const onIt = this.y + this.height >= platform.y && this.y < platform.y + platform.height;
        if (onIt) {
          if (this.direction === 1  && this.x + this.width >= platform.x + platform.width - 4) { this.direction = -1; this.dirCooldown = this.cooldownFrames; return; }
          if (this.direction === -1 && this.x <= platform.x + 4) { this.direction = 1; this.dirCooldown = this.cooldownFrames; return; }
        }
      }
    }
  }

  getBounds() {
    return { x: this.x + 7, y: this.y + 7, width: this.width - 14, height: this.height - 14 };
  }

  draw(ctx) {
    const x = this.x, y = this.y + Math.sin(this.bounceTimer) * 2.5;
    const w = this.width, h = this.height;
    ctx.save();
    if (this.direction === -1) {
      ctx.translate(x + w / 2, y + h / 2); ctx.scale(-1, 1); ctx.translate(-(x + w / 2), -(y + h / 2));
    }
    if (this.type === 'fox') this.drawFox(ctx, x, y, w, h);
    else this.drawHawk(ctx, x, y, w, h);
    ctx.restore();
  }

  drawFox(ctx, x, y, w, h) {
    ctx.fillStyle = '#E67E22';
    ctx.beginPath(); ctx.ellipse(x+w/2, y+h*0.65, w*0.35, h*0.28, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+w*0.62, y+h*0.35, w*0.25, h*0.22, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle='#F0A07A'; ctx.beginPath(); ctx.ellipse(x+w*0.78, y+h*0.42, 7, 5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle='#E67E22';
    ctx.beginPath(); ctx.moveTo(x+w*0.52,y+h*0.18); ctx.lineTo(x+w*0.46,y+h*0.03); ctx.lineTo(x+w*0.62,y+h*0.18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x+w*0.65,y+h*0.17); ctx.lineTo(x+w*0.62,y+h*0.03); ctx.lineTo(x+w*0.76,y+h*0.18); ctx.fill();
    ctx.fillStyle='#FFB3BA';
    ctx.beginPath(); ctx.moveTo(x+w*0.53,y+h*0.18); ctx.lineTo(x+w*0.49,y+h*0.07); ctx.lineTo(x+w*0.61,y+h*0.18); ctx.fill();
    ctx.fillStyle='#2C3E50'; ctx.beginPath(); ctx.arc(x+w*0.70,y+h*0.32,3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#27AE60'; ctx.beginPath(); ctx.arc(x+w*0.70,y+h*0.32,1.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#2C3E50'; ctx.beginPath(); ctx.arc(x+w*0.83,y+h*0.40,2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FAD7A0'; ctx.beginPath(); ctx.ellipse(x+w*0.45,y+h*0.67,w*0.18,h*0.20,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#E67E22'; ctx.beginPath(); ctx.ellipse(x+w*0.10,y+h*0.60,10,18,-0.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='white';   ctx.beginPath(); ctx.arc(x+w*0.07,y+h*0.48,5,0,Math.PI*2); ctx.fill();
    const la = this.animFrame===0?3:-3;
    ctx.fillStyle='#E67E22';
    ctx.beginPath(); ctx.ellipse(x+w*0.38,y+h*0.90+la,6,8,0.2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+w*0.58,y+h*0.90-la,6,8,-0.2,0,Math.PI*2); ctx.fill();
  }

  drawHawk(ctx, x, y, w, h) {
    const ws = this.animFrame===0?0.80:0.60;
    ctx.fillStyle='#5D4037';
    ctx.beginPath(); ctx.ellipse(x+w*0.20,y+h*0.40,w*ws,h*0.15,-0.3,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+w*0.80,y+h*0.40,w*ws,h*0.15, 0.3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#795548'; ctx.beginPath(); ctx.ellipse(x+w/2,y+h*0.50,w*0.22,h*0.30,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#8D6E63'; ctx.beginPath(); ctx.arc(x+w/2,y+h*0.28,12,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FDD835';
    ctx.beginPath(); ctx.moveTo(x+w*0.58,y+h*0.30); ctx.lineTo(x+w*0.73,y+h*0.35); ctx.lineTo(x+w*0.58,y+h*0.40); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(x+w*0.56,y+h*0.27,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#1A1A1A'; ctx.beginPath(); ctx.arc(x+w*0.57,y+h*0.27,2,0,Math.PI*2); ctx.fill();
  }
}
