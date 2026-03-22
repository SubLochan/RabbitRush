import React, { useEffect, useState, useRef } from 'react';
import { LEVELS } from '../config.js';

const DIFF_COLORS = {
  meadow:  '#4CAF50',
  forest:  '#2E7D32',
  cave:    '#78909C',
  volcano: '#F44336',
  storm:   '#7C4DFF',
};

const DIFF_LABEL = {
  meadow:  '🌿 Meadow',
  forest:  '🌲 Forest',
  cave:    '🕳️ Cave',
  volcano: '🌋 Volcano',
  storm:   '⚡ Storm',
};

// Cheer messages per level range
const CHEER_MSGS = [
  { title: 'Great Start! 🐰',   sub: 'The garden is yours, little bunny!'    }, // lv 1
  { title: 'Hopping Along! 🥕', sub: 'Those carrots never stood a chance!'   }, // lv 2
  { title: 'Forest Explorer! 🌲',sub: 'You dashed through the trees!'        }, // lv 3
  { title: 'Fox Dodger! 🦊',    sub: 'No fox could catch you today!'         }, // lv 4
  { title: 'Meadow Master! 🌸', sub: 'You conquered the fields!'             }, // lv 5
  { title: 'Cave Conqueror! 🕳️',sub: 'The darkness couldn\'t stop you!'    }, // lv 6
  { title: 'Shadow Runner! 🌑', sub: 'You raced through pitch black caves!'  }, // lv 7
  { title: 'Volcano Victor! 🌋',sub: 'Through fire and ash you prevailed!'   }, // lv 8
  { title: 'Inferno Champ! 🔥', sub: 'The lava could not touch you!'        }, // lv 9
  { title: '☠️ EXTREME CLEAR!', sub: 'You are the ultimate Rabbit Rush champion!' }, // lv 10
];

// Confetti particle colours
const CONFETTI_COLORS = [
  '#FF6B35','#FFD700','#4CAF50','#2196F3','#E91E63',
  '#9C27B0','#00BCD4','#FF5722','#8BC34A','#FFC107',
];

function randomBetween(a, b) { return a + Math.random() * (b - a); }

// ── Canvas confetti ──────────────────────────────────────────────────────────
function ConfettiCanvas({ active }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    // Spawn 180 confetti pieces in two bursts
    const spawn = (count, delay) => setTimeout(() => {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: randomBetween(W * 0.1, W * 0.9),
          y: randomBetween(-30, -10),
          vx: randomBetween(-4, 4),
          vy: randomBetween(2, 7),
          rot: randomBetween(0, Math.PI * 2),
          rotV: randomBetween(-0.15, 0.15),
          w: randomBetween(8, 16),
          h: randomBetween(5, 10),
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          alpha: 1,
          life: randomBetween(120, 220),
          maxLife: 0,
          shape: Math.random() > 0.5 ? 'rect' : 'circle',
          wobble: randomBetween(0, Math.PI * 2),
          wobbleSpeed: randomBetween(0.05, 0.15),
        });
        particlesRef.current[particlesRef.current.length - 1].maxLife =
          particlesRef.current[particlesRef.current.length - 1].life;
      }
    }, delay);

    spawn(100, 0);
    spawn(80, 400);
    spawn(60, 900);

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.vy += 0.12; // gravity
        p.y += p.vy;
        p.rot += p.rotV;
        p.wobble += p.wobbleSpeed;
        p.x += Math.sin(p.wobble) * 0.8;
        p.life--;
        p.alpha = Math.min(1, p.life / 30); // fade out last 30 frames

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      width={1280}
      height={720}
      style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', zIndex: 21,
      }}
    />
  );
}

// ── Animated star ────────────────────────────────────────────────────────────
function AnimStar({ delay }) {
  const [lit, setLit] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLit(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <span style={{
      fontSize: 52,
      display: 'inline-block',
      transition: 'transform 0.45s cubic-bezier(0.175,0.885,0.32,1.5), filter 0.45s',
      transform: lit ? 'scale(1.35) rotate(-8deg)' : 'scale(0.3) rotate(30deg)',
      filter: lit ? 'drop-shadow(0 0 12px #FFD700)' : 'grayscale(1) opacity(0.2)',
    }}>⭐</span>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export function LevelComplete({ level, score, onNext, isLastLevel }) {
  const [phase, setPhase] = useState(0);
  // phase 0 = cheer burst, phase 1 = full card visible

  const cfg      = LEVELS[level - 1];
  const nextCfg  = LEVELS[level];
  const themeColor = cfg ? (DIFF_COLORS[cfg.theme] || '#4CAF50') : '#4CAF50';
  const cheer    = CHEER_MSGS[Math.min(level - 1, CHEER_MSGS.length - 1)];

  // After 2.2s auto-transition from cheer burst to full card
  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 2200);
    return () => clearTimeout(t);
  }, []);

  const diffLabel = level <= 5 ? 'Easy' : level <= 7 ? 'Hard' : level <= 9 ? 'Expert' : 'EXTREME';
  const diffColor = level <= 5 ? '#4CAF50' : level <= 7 ? '#FF9800' : level <= 9 ? '#F44336' : '#FF00FF';

  return (
    <>
      {/* Confetti layer — always present once mounted */}
      <ConfettiCanvas active={true} />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 22,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: phase === 0
          ? 'rgba(0,0,0,0.55)'
          : 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(6px)',
        transition: 'background 0.6s',
      }}>

        {/* ── PHASE 0: Big cheer burst ─────────────────────────────── */}
        {phase === 0 && (
          <div style={{
            textAlign: 'center',
            animation: 'cheerPop 0.5s cubic-bezier(0.175,0.885,0.32,1.4) forwards',
          }}>
            {/* Big emoji burst */}
            <div style={{
              fontSize: 96, lineHeight: 1,
              animation: 'bounce 0.6s ease-in-out infinite alternate',
            }}>
              {isLastLevel ? '🏆' : '🥳'}
            </div>

            {/* Title */}
            <div style={{
              marginTop: 18,
              fontFamily: 'sans-serif', fontWeight: 900,
              fontSize: isLastLevel ? 64 : 58,
              color: themeColor,
              textShadow: `0 4px 0 ${themeColor}66, 0 0 40px ${themeColor}88`,
              letterSpacing: 1,
              animation: 'slideUp 0.4s 0.15s ease both',
            }}>
              {cheer.title}
            </div>

            {/* Sub-title */}
            <div style={{
              marginTop: 10,
              fontSize: 26, color: '#ddd',
              fontFamily: 'sans-serif',
              animation: 'slideUp 0.4s 0.3s ease both',
              opacity: 0,
            }}>
              {cheer.sub}
            </div>

            {/* Level badge */}
            <div style={{
              marginTop: 20,
              display: 'inline-flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,0.08)',
              border: `1px solid ${themeColor}55`,
              borderRadius: 50, padding: '10px 28px',
              animation: 'slideUp 0.4s 0.45s ease both',
              opacity: 0,
            }}>
              <span style={{ fontSize: 22, color: themeColor, fontWeight: 700 }}>
                Level {level}
              </span>
              <span style={{ color: '#666', fontSize: 18 }}>·</span>
              <span style={{ fontSize: 18, color: diffColor, fontWeight: 700 }}>{diffLabel}</span>
              <span style={{ color: '#666', fontSize: 18 }}>·</span>
              <span style={{ fontSize: 18, color: '#aaa' }}>{DIFF_LABEL[cfg?.theme]}</span>
            </div>

            {/* Stars row */}
            <div style={{
              marginTop: 24, display: 'flex', justifyContent: 'center', gap: 18,
            }}>
              <AnimStar delay={600} />
              <AnimStar delay={900} />
              <AnimStar delay={1200} />
            </div>

            {/* "Tap to continue" hint */}
            <div style={{
              marginTop: 22, fontSize: 16, color: 'rgba(255,255,255,0.35)',
              animation: 'fadeInBlink 0.5s 1.8s ease forwards',
              opacity: 0,
            }}>
              Continuing in a moment…
            </div>
          </div>
        )}

        {/* ── PHASE 1: Full summary card ───────────────────────────── */}
        {phase === 1 && (
          <div style={{
            background: 'rgba(5,12,8,0.97)',
            border: `1px solid ${themeColor}44`,
            borderRadius: 28,
            padding: '44px 60px',
            textAlign: 'center',
            color: 'white',
            minWidth: 420,
            maxWidth: 560,
            boxShadow: `0 32px 100px rgba(0,0,0,0.9), 0 0 80px ${themeColor}22`,
            animation: 'cardSlideIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both',
          }}>

            {/* Emoji + title */}
            <div style={{ fontSize: 60, marginBottom: 6 }}>
              {isLastLevel ? '🏆' : '🥕'}
            </div>
            <div style={{
              fontWeight: 900, fontSize: 44, color: themeColor,
              textShadow: `0 3px 0 ${themeColor}66`,
              marginBottom: 6,
            }}>
              Level {level} Clear!
            </div>

            {/* Theme chip */}
            <div style={{
              display: 'inline-block',
              background: themeColor + '22',
              border: `1px solid ${themeColor}55`,
              borderRadius: 50, padding: '5px 18px',
              fontSize: 15, color: themeColor, marginBottom: 20,
            }}>
              {DIFF_LABEL[cfg?.theme] || ''} &nbsp;·&nbsp;
              <span style={{ color: diffColor }}>{diffLabel}</span>
            </div>

            {/* Stars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 20 }}>
              <AnimStar delay={100} />
              <AnimStar delay={300} />
              <AnimStar delay={500} />
            </div>

            {/* Score row */}
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 20,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#666', letterSpacing: 1, marginBottom: 4 }}>SCORE</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#FFD700' }}>{score.toLocaleString()}</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#666', letterSpacing: 1, marginBottom: 4 }}>CARROTS</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#FF6B35' }}>
                  {cfg?.carrotsToCollect ?? '?'} 🥕
                </div>
              </div>
            </div>

            {/* Cheer sub message */}
            <div style={{
              fontSize: 16, color: '#aaa', marginBottom: 20,
              fontStyle: 'italic', lineHeight: 1.5,
            }}>
              "{cheer.sub}"
            </div>

            {/* Next level preview */}
            {nextCfg && !isLastLevel && (
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '12px 20px',
                marginBottom: 26, textAlign: 'left',
              }}>
                <div style={{ fontSize: 12, color: '#555', letterSpacing: 1, marginBottom: 6 }}>UP NEXT</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>
                      Level {nextCfg.level}
                    </span>
                    <span style={{ fontSize: 15, color: '#777', marginLeft: 8 }}>
                      {DIFF_LABEL[nextCfg.theme] || nextCfg.theme}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 13, color: '#777' }}>
                    <span>🥕 {nextCfg.carrotsToCollect}</span>
                    <span style={{
                      color: nextCfg.level <= 5 ? '#4CAF50' : nextCfg.level <= 7 ? '#FF9800' : nextCfg.level <= 9 ? '#F44336' : '#FF00FF',
                      fontWeight: 700,
                    }}>
                      {nextCfg.level <= 5 ? 'Easy' : nextCfg.level <= 7 ? 'Hard' : nextCfg.level <= 9 ? 'Expert' : '☠️ EXTREME'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* CTA button */}
            <button
              onClick={onNext}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              style={{
                background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}bb 100%)`,
                color: 'white', border: 'none', borderRadius: 36,
                padding: '18px 52px',
                fontWeight: 800, fontSize: 24,
                cursor: 'pointer', width: '100%',
                boxShadow: `0 6px 0 ${themeColor}88, 0 10px 30px ${themeColor}44`,
                transition: 'transform 0.15s',
                letterSpacing: 0.5,
              }}
            >
              {isLastLevel ? '🏆 Finish Game!' : '➡️ Next Level'}
            </button>

            {/* Keyboard hint */}
            <div style={{ marginTop: 12, fontSize: 13, color: '#444' }}>
              Press Enter or click to continue
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes cheerPop {
          from { transform: scale(0.6); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes bounce {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-18px) scale(1.08); }
        }
        @keyframes slideUp {
          from { transform: translateY(24px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes fadeInBlink {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cardSlideIn {
          from { transform: scale(0.85) translateY(30px); opacity: 0; }
          to   { transform: scale(1)    translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
