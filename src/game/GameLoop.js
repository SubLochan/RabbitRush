import { GAME_STATES, CANVAS_WIDTH, GROUND_Y } from '../config.js';
import { Player } from './Player.js';
import { LevelManager } from './LevelManager.js';

export class GameLoop {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = GAME_STATES.MENU;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('rabbitHighScore') || '0');
    this.levelIndex = 0;
    this.player = null;
    this.levelManager = new LevelManager();
    this.keys = {};
    this.rafId = null;
    this.onStateChange = null;
    this.lastJumpKey = false;
    this.floatingTexts = [];
    this.shakeTimer = 0;
    this.tipShown = false;
  }

  startGame() {
    this.score = 0;
    this.levelIndex = 0;
    this.tipShown = false;
    this.player = new Player(80, GROUND_Y - 60);
    this.levelManager.buildLevel(0);
    this.state = GAME_STATES.PLAYING;
    this._notify();
    this._loop();
  }

  nextLevel() {
    this.levelIndex++;
    if (this.levelIndex >= 5) {
      this.state = GAME_STATES.WIN;
      this._saveHighScore();
      this._notify();
      return;
    }
    this.player.x = 80;
    this.player.y = GROUND_Y - 60;
    this.player.vx = 0;
    this.player.vy = 0;
    this.levelManager.buildLevel(this.levelIndex);
    this.state = GAME_STATES.PLAYING;
    this._notify();
  }

  pauseGame() {
    if (this.state === GAME_STATES.PLAYING) this.state = GAME_STATES.PAUSED;
    else if (this.state === GAME_STATES.PAUSED) this.state = GAME_STATES.PLAYING;
    this._notify();
  }

  restartGame() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.startGame();
  }

  setKey(key, pressed) { this.keys[key] = pressed; }

  _notify() { if (this.onStateChange) this.onStateChange(this.state); }

  _loop() {
    this.rafId = requestAnimationFrame(() => this._loop());
    this._update();
    this._render();
  }

  _update() {
    if (this.state !== GAME_STATES.PLAYING) return;
    const lm = this.levelManager;
    const player = this.player;

    const jumpPressed = this.keys['ArrowUp'] || this.keys['KeyW'] || this.keys['Space'];
    if (jumpPressed && !this.lastJumpKey) player.jump();
    this.lastJumpKey = jumpPressed;

    player.update(this.keys, lm.platforms);
    lm.update();

    lm.carrots.forEach(carrot => {
      if (carrot.collected) return;
      if (rectsOverlap(player.getBounds(), carrot.getBounds())) {
        carrot.collect();
        this.score += carrot.points * (this.levelIndex + 1);
        lm.addParticle(carrot.x + 16, carrot.y + 16, '#FF6B35');
        this.addFloatingText(`+${carrot.points * (this.levelIndex + 1)}`, carrot.x + 16, carrot.y, '#FF6B35');
      }
    });

    lm.obstacles.forEach(obstacle => {
      if (rectsOverlap(player.getBounds(), obstacle.getBounds())) {
        if (player.hit()) {
          this.shakeTimer = 20;
          lm.addParticle(player.x + 24, player.y + 24, '#FF1744');
          if (player.lives <= 0) {
            this._saveHighScore();
            this.state = GAME_STATES.GAME_OVER;
            this._notify();
          }
        }
      }
    });

    if (lm.collectedCount >= lm.totalCarrots) {
      this.state = GAME_STATES.LEVEL_COMPLETE;
      this._notify();
    }

    this.floatingTexts = this.floatingTexts.filter(t => t.life > 0);
    this.floatingTexts.forEach(t => { t.y -= 1.5; t.life--; t.alpha = t.life / t.maxLife; });
    if (this.shakeTimer > 0) this.shakeTimer--;
  }

  addFloatingText(text, x, y, color = '#FFD700') {
    this.floatingTexts.push({ text, x, y, life: 40, maxLife: 40, alpha: 1, color });
  }

  _saveHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('rabbitHighScore', this.highScore);
    }
  }

  _render() {
    const ctx = this.ctx;
    const lm = this.levelManager;

    ctx.save();
    if (this.shakeTimer > 0) ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);

    lm.drawBackground(ctx);
    lm.drawPlatforms(ctx);
    lm.drawObjects(ctx);
    if (this.player) this.player.draw(ctx);

    this.floatingTexts.forEach(t => {
      ctx.save();
      ctx.globalAlpha = t.alpha;
      ctx.fillStyle = t.color;
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 3;
      ctx.strokeText(t.text, t.x, t.y);
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    });

    ctx.restore();
  }

  destroy() { if (this.rafId) cancelAnimationFrame(this.rafId); }
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
