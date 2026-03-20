import { PLAYER, GROUND_Y, CANVAS_WIDTH } from '../config.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = PLAYER.WIDTH;
    this.height = PLAYER.HEIGHT;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.lives = PLAYER.LIVES;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.facingRight = true;
    this.animFrame = 0;
    this.animTimer = 0;
    this.jumpCount = 0;
    this.isRunning = false;
    // Kawaii extras
    this.blinkTimer = 120 + Math.random() * 80;
    this.blinking = false;
    this.blinkFrame = 0;
    this.cheekPulse = 0;
    this.tailWag = 0;
  }

  update(keys, platforms) {
    this.vx = 0;
    this.isRunning = false;
    if (keys['ArrowLeft'] || keys['KeyA']) { this.vx = -PLAYER.SPEED; this.facingRight = false; this.isRunning = true; }
    if (keys['ArrowRight'] || keys['KeyD']) { this.vx = PLAYER.SPEED; this.facingRight = true; this.isRunning = true; }

    this.vy += PLAYER.GRAVITY;
    if (this.vy > PLAYER.MAX_FALL_SPEED) this.vy = PLAYER.MAX_FALL_SPEED;
    this.x += this.vx;
    this.x = Math.max(0, Math.min(CANVAS_WIDTH - this.width, this.x));
    this.y += this.vy;

    this.onGround = false;
    if (this.y + this.height >= GROUND_Y) {
      this.y = GROUND_Y - this.height; this.vy = 0; this.onGround = true; this.jumpCount = 0;
    }
    for (const p of platforms) {
      if (this.vy >= 0 && this.x + this.width > p.x + 4 && this.x < p.x + p.width - 4 &&
          this.y + this.height > p.y && this.y + this.height < p.y + p.height + 10) {
        this.y = p.y - this.height; this.vy = 0; this.onGround = true; this.jumpCount = 0;
      }
    }

    this.animTimer++;
    if (this.animTimer > 7) { this.animTimer = 0; this.animFrame = (this.animFrame + 1) % 4; }
    if (this.invincible) { this.invincibleTimer--; if (this.invincibleTimer <= 0) this.invincible = false; }
    if (this.cheekPulse > 0) this.cheekPulse--;

    this.blinkTimer--;
    if (this.blinkTimer <= 0) { this.blinking = true; this.blinkFrame = 8; this.blinkTimer = 100 + Math.random() * 90; }
    if (this.blinking) { this.blinkFrame--; if (this.blinkFrame <= 0) this.blinking = false; }
    this.tailWag += 0.12;
  }

  jump() {
    if (this.jumpCount < 2) {
      this.vy = PLAYER.JUMP_FORCE; this.jumpCount++; this.onGround = false; this.cheekPulse = 12;
      return true;
    }
    return false;
  }

  hit() {
    if (this.invincible) return false;
    this.lives--; this.invincible = true; this.invincibleTimer = 120; this.cheekPulse = 0;
    return true;
  }

  getBounds() {
    return { x: this.x + 6, y: this.y + 6, width: this.width - 12, height: this.height - 6 };
  }

  draw(ctx) {
    ctx.save();
    if (this.invincible && Math.floor(this.invincibleTimer / 6) % 2 === 0) ctx.globalAlpha = 0.32;

    const x = this.x, y = this.y, w = this.width, h = this.height, cx = x + w / 2;

    if (!this.facingRight) {
      ctx.translate(cx, y + h / 2); ctx.scale(-1, 1); ctx.translate(-cx, -(y + h / 2));
    }

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(cx, y + h + 2, w * 0.34, 4, 0, 0, Math.PI * 2); ctx.fill();

    // Legs
    const lb = (this.isRunning && this.onGround) ? Math.sin(this.animFrame * Math.PI / 2) * 4 : 0;
    ctx.fillStyle = '#EDE0D0';
    ctx.beginPath(); ctx.ellipse(cx - 8, y + h - 4 + lb, 9, 7, 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 8, y + h - 4 - lb, 9, 7, -0.15, 0, Math.PI * 2); ctx.fill();

    // Tail
    const wagX = Math.sin(this.tailWag) * 4;
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(x + w * 0.14 + wagX, y + h * 0.62, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F5E8E0'; ctx.beginPath(); ctx.arc(x + w * 0.14 + wagX, y + h * 0.62, 5, 0, Math.PI * 2); ctx.fill();

    // Body
    ctx.fillStyle = '#EDE0D0'; ctx.beginPath(); ctx.ellipse(cx, y + h * 0.64, w * 0.40, h * 0.31, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(200,170,145,0.22)'; ctx.beginPath(); ctx.ellipse(cx - 4, y + h * 0.68, w * 0.22, h * 0.18, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,240,230,0.7)'; ctx.beginPath(); ctx.ellipse(cx, y + h * 0.66, w * 0.22, h * 0.18, 0, 0, Math.PI * 2); ctx.fill();

    // Ears
    ctx.fillStyle = '#EDE0D0';
    ctx.beginPath(); ctx.ellipse(cx - 9, y + h * 0.10, 7, 18, -0.22, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 9, y + h * 0.08, 7, 18, 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F9C4CB';
    ctx.beginPath(); ctx.ellipse(cx - 9, y + h * 0.10, 4, 13, -0.22, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 9, y + h * 0.08, 4, 13, 0.22, 0, Math.PI * 2); ctx.fill();

    // Head
    ctx.fillStyle = '#EDE0D0'; ctx.beginPath(); ctx.arc(cx, y + h * 0.35, w * 0.38, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(200,170,145,0.18)'; ctx.beginPath(); ctx.arc(cx - 6, y + h * 0.38, w * 0.20, 0, Math.PI * 2); ctx.fill();

    // Cheeks
    const ca = this.cheekPulse > 0 ? 0.55 : 0.32;
    ctx.fillStyle = `rgba(255,160,160,${ca})`;
    ctx.beginPath(); ctx.ellipse(cx - 13, y + h * 0.41, 7, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 13, y + h * 0.41, 7, 4.5, 0, 0, Math.PI * 2); ctx.fill();

    // Eyes
    const eyeY = y + h * 0.33;
    if (this.blinking) {
      ctx.strokeStyle = '#3D2B6B'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(cx - 8, eyeY + 2, 5, Math.PI, 0); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 8, eyeY + 2, 5, Math.PI, 0); ctx.stroke();
    } else {
      ctx.fillStyle = 'white';
      ctx.beginPath(); ctx.arc(cx - 8, eyeY, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 8, eyeY, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2D1B50';
      ctx.beginPath(); ctx.arc(cx - 8, eyeY + 1, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 8, eyeY + 1, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7C5CBA';
      ctx.beginPath(); ctx.arc(cx - 8, eyeY + 1, 2.8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 8, eyeY + 1, 2.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'white';
      ctx.beginPath(); ctx.arc(cx - 6.5, eyeY - 0.5, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 9.5, eyeY - 0.5, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx - 9.5, eyeY + 1.5, 0.9, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 6.5, eyeY + 1.5, 0.9, 0, Math.PI * 2); ctx.fill();
    }

    // Nose (heart)
    ctx.fillStyle = '#F4A0B0';
    ctx.beginPath(); ctx.arc(cx - 1.5, y + h * 0.41, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 1.5, y + h * 0.41, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx, y + h * 0.415); ctx.lineTo(cx - 3.5, y + h * 0.43); ctx.lineTo(cx + 3.5, y + h * 0.43); ctx.closePath(); ctx.fill();

    // Mouth
    ctx.strokeStyle = '#C08080'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 4, y + h * 0.455);
    ctx.quadraticCurveTo(cx - 2, y + h * 0.47, cx, y + h * 0.46);
    ctx.quadraticCurveTo(cx + 2, y + h * 0.47, cx + 4, y + h * 0.455);
    ctx.stroke();

    // Arms / paws
    ctx.fillStyle = '#EDE0D0';
    ctx.beginPath(); ctx.ellipse(cx - w * 0.38, y + h * 0.56, 5, 8, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + w * 0.38, y + h * 0.56, 5, 8, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(180,140,120,0.55)';
    for (let d = -1; d <= 1; d++) {
      ctx.beginPath(); ctx.arc(cx - w * 0.38 + d * 2, y + h * 0.595, 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + w * 0.38 + d * 2, y + h * 0.595, 1.2, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
  }
}
