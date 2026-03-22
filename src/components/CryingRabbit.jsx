import React, { useEffect, useRef } from 'react';

export function CryingRabbit({ size = 140 }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const tearsRef  = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Spawn a tear drop
    function spawnTear(side) {
      // side: 'left' | 'right'
      const x = side === 'left' ? W * 0.36 : W * 0.64;
      const y = H * 0.46;
      tearsRef.current.push({
        x, y,
        vy: 1.2 + Math.random() * 0.8,
        alpha: 1,
        size: 4 + Math.random() * 3,
        side,
      });
    }

    let frame = 0;
    let tearTimer = 0;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2 - 8;

      // ── Shadow ──────────────────────────────────────────
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.beginPath();
      ctx.ellipse(cx, H - 14, W * 0.3, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // ── Legs ─────────────────────────────────────────────
      ctx.fillStyle = '#C8B8A2';
      ctx.beginPath(); ctx.ellipse(cx - 18, cy + 42, 13, 9, 0.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 18, cy + 42, 13, 9, -0.2, 0, Math.PI * 2); ctx.fill();

      // ── Tail ─────────────────────────────────────────────
      const wagX = Math.sin(frame * 0.04) * 2; // barely wagging — sad rabbit
      ctx.fillStyle = 'white';
      ctx.beginPath(); ctx.arc(cx - W * 0.28 + wagX, cy + 14, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F5E8E0';
      ctx.beginPath(); ctx.arc(cx - W * 0.28 + wagX, cy + 14, 7, 0, Math.PI * 2); ctx.fill();

      // ── Body ─────────────────────────────────────────────
      ctx.fillStyle = '#EDE0D0';
      ctx.beginPath(); ctx.ellipse(cx, cy + 18, W * 0.3, H * 0.26, 0, 0, Math.PI * 2); ctx.fill();

      // Body shading
      ctx.fillStyle = 'rgba(180,150,120,0.18)';
      ctx.beginPath(); ctx.ellipse(cx - 8, cy + 22, W * 0.18, H * 0.16, 0.3, 0, Math.PI * 2); ctx.fill();

      // Tummy
      ctx.fillStyle = 'rgba(255,240,228,0.65)';
      ctx.beginPath(); ctx.ellipse(cx, cy + 18, W * 0.17, H * 0.17, 0, 0, Math.PI * 2); ctx.fill();

      // ── Ears ─────────────────────────────────────────────
      // Drooping / sad ears — angled outward & down
      ctx.fillStyle = '#EDE0D0';
      // Left ear (drooping left)
      ctx.save();
      ctx.translate(cx - 16, cy - 28);
      ctx.rotate(0.55);
      ctx.beginPath(); ctx.ellipse(0, -18, 8, 20, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F9C4CB';
      ctx.beginPath(); ctx.ellipse(0, -18, 4.5, 14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Right ear (drooping right)
      ctx.fillStyle = '#EDE0D0';
      ctx.save();
      ctx.translate(cx + 16, cy - 28);
      ctx.rotate(-0.55);
      ctx.beginPath(); ctx.ellipse(0, -18, 8, 20, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F9C4CB';
      ctx.beginPath(); ctx.ellipse(0, -18, 4.5, 14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // ── Head ─────────────────────────────────────────────
      ctx.fillStyle = '#EDE0D0';
      ctx.beginPath(); ctx.arc(cx, cy - 8, W * 0.3, 0, Math.PI * 2); ctx.fill();

      // Head shading
      ctx.fillStyle = 'rgba(180,150,120,0.15)';
      ctx.beginPath(); ctx.arc(cx - 10, cy - 5, W * 0.16, 0, Math.PI * 2); ctx.fill();

      // ── Rosy cheeks (extra pink when crying) ─────────────
      ctx.fillStyle = 'rgba(255,120,130,0.50)';
      ctx.beginPath(); ctx.ellipse(cx - 20, cy + 3, 11, 7, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 20, cy + 3, 11, 7, 0, 0, Math.PI * 2); ctx.fill();

      // ── Sad closed eyes (curved downward arc = sad) ──────
      ctx.strokeStyle = '#3D2B6B';
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      // Left eye — arc curves DOWN (sad)
      ctx.beginPath(); ctx.arc(cx - 14, cy - 12, 7, 0.3, Math.PI - 0.3); ctx.stroke();
      // Right eye
      ctx.beginPath(); ctx.arc(cx + 14, cy - 12, 7, 0.3, Math.PI - 0.3); ctx.stroke();

      // Tear sparkle dots in corners
      ctx.fillStyle = 'rgba(100,180,255,0.85)';
      ctx.beginPath(); ctx.arc(cx - 20, cy - 7, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 20, cy - 7, 2.5, 0, Math.PI * 2); ctx.fill();

      // ── Nose ─────────────────────────────────────────────
      ctx.fillStyle = '#F4A0B0';
      ctx.beginPath(); ctx.arc(cx - 2, cy + 0, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 2, cy + 0, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx, cy + 2.5); ctx.lineTo(cx - 5, cy + 8); ctx.lineTo(cx + 5, cy + 8);
      ctx.closePath(); ctx.fill();

      // ── Sad mouth (downward curve) ────────────────────────
      ctx.strokeStyle = '#C08080'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy + 11);
      ctx.quadraticCurveTo(cx, cy + 17, cx + 6, cy + 11);
      ctx.stroke();

      // ── Paws covering face (hiding in shame) ─────────────
      // Left paw slightly raised toward face
      ctx.fillStyle = '#EDE0D0';
      ctx.beginPath(); ctx.ellipse(cx - W * 0.26, cy + 5, 8, 12, -0.6, 0, Math.PI * 2); ctx.fill();
      // Paw dots
      ctx.fillStyle = 'rgba(170,130,110,0.5)';
      for (let d = -1; d <= 1; d++) {
        ctx.beginPath(); ctx.arc(cx - W * 0.26 + d * 3, cy + 10, 1.8, 0, Math.PI * 2); ctx.fill();
      }

      // Right paw
      ctx.fillStyle = '#EDE0D0';
      ctx.beginPath(); ctx.ellipse(cx + W * 0.26, cy + 5, 8, 12, 0.6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(170,130,110,0.5)';
      for (let d = -1; d <= 1; d++) {
        ctx.beginPath(); ctx.arc(cx + W * 0.26 + d * 3, cy + 10, 1.8, 0, Math.PI * 2); ctx.fill();
      }

      // ── Tears ─────────────────────────────────────────────
      tearsRef.current.forEach(t => {
        // Teardrop shape
        ctx.save();
        ctx.globalAlpha = t.alpha;
        ctx.fillStyle = '#74C0FC';
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size * 0.55, 0, Math.PI * 2);
        ctx.fill();
        // Pointy top
        ctx.beginPath();
        ctx.moveTo(t.x, t.y - t.size * 1.4);
        ctx.bezierCurveTo(t.x + t.size * 0.7, t.y - t.size * 0.5, t.x + t.size * 0.7, t.y + t.size * 0.3, t.x, t.y + t.size * 0.55);
        ctx.bezierCurveTo(t.x - t.size * 0.7, t.y + t.size * 0.3, t.x - t.size * 0.7, t.y - t.size * 0.5, t.x, t.y - t.size * 1.4);
        ctx.fill();
        // Shine dot inside
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath(); ctx.arc(t.x - t.size * 0.2, t.y - t.size * 0.3, t.size * 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      // ── Small sad particles (little hearts breaking) ──────
      const sadParticleX = [cx - 38, cx + 38];
      sadParticleX.forEach((px, i) => {
        const pulse = Math.sin(frame * 0.05 + i * Math.PI) * 0.3 + 0.7;
        ctx.save();
        ctx.globalAlpha = pulse * 0.6;
        ctx.fillStyle = '#FF8FA3';
        ctx.font = `${12 + pulse * 4}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('💧', px, cy - 22 - pulse * 4);
        ctx.restore();
      });

      frame++;
    }

    function tick() {
      draw();

      // Tears: spawn alternating left/right
      tearTimer++;
      if (tearTimer % 28 === 0) spawnTear('left');
      if (tearTimer % 28 === 14) spawnTear('right');

      // Update tears
      tearsRef.current = tearsRef.current.filter(t => t.alpha > 0);
      tearsRef.current.forEach(t => {
        t.y += t.vy;
        t.vy += 0.08;
        if (t.y > H - 20) t.alpha -= 0.12;
      });

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ display: 'block', margin: '0 auto' }}
    />
  );
}
