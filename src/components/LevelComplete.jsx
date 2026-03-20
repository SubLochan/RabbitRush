import React, { useEffect, useState } from 'react';

export function LevelComplete({ level, score, onNext, isLastLevel }) {
  const [stars, setStars] = useState(0);

  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t++;
      setStars(t);
      if (t >= 3) clearInterval(interval);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 20,
    }}>
      <div style={{
        background: 'linear-gradient(160deg, #0d2a14 0%, #071a0e 100%)',
        border: '1px solid rgba(76,175,80,0.3)',
        borderRadius: 24,
        padding: '36px 48px',
        textAlign: 'center',
        color: 'white',
        minWidth: 320,
        boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(76,175,80,0.15)',
        animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>🥕</div>

        <div style={{
          fontFamily: '"Fredoka One", cursive',
          fontSize: 38,
          color: '#4CAF50',
          textShadow: '0 3px 0 #1B5E20, 0 0 20px rgba(76,175,80,0.4)',
          marginBottom: 6,
        }}>
          Level {level} Clear!
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          margin: '16px 0',
        }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              fontSize: 36,
              filter: i < stars ? 'none' : 'grayscale(1) opacity(0.2)',
              transform: i < stars ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}>⭐</span>
          ))}
        </div>

        <div style={{
          color: '#ccc',
          fontSize: 16,
          marginBottom: 6,
        }}>
          All carrots collected! 🎉
        </div>

        <div style={{
          color: '#FFD700',
          fontFamily: '"Fredoka One", cursive',
          fontSize: 24,
          marginBottom: 28,
        }}>
          Score: {score.toLocaleString()}
        </div>

        <button
          onClick={onNext}
          style={{
            background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
            color: 'white',
            border: 'none',
            borderRadius: 30,
            padding: '13px 40px',
            fontFamily: '"Fredoka One", cursive',
            fontSize: 20,
            cursor: 'pointer',
            boxShadow: '0 4px 0 #1B5E20, 0 6px 20px rgba(76,175,80,0.4)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        >
          {isLastLevel ? '🏆 Finish!' : '➡️ Next Level'}
        </button>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
