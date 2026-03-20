import React from 'react';

export function HUD({ score, lives, level, totalLevels, carrotsCollected, totalCarrots }) {
  const hearts = Array.from({ length: 3 }, (_, i) => i < lives);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      {/* Lives */}
      <div style={{
        display: 'flex',
        gap: 4,
        background: 'rgba(0,0,0,0.55)',
        borderRadius: 20,
        padding: '6px 12px',
        backdropFilter: 'blur(4px)',
      }}>
        {hearts.map((alive, i) => (
          <span key={i} style={{
            fontSize: 20,
            filter: alive ? 'none' : 'grayscale(1) opacity(0.3)',
            transition: 'filter 0.3s',
          }}>❤️</span>
        ))}
      </div>

      {/* Score */}
      <div style={{
        background: 'rgba(0,0,0,0.55)',
        borderRadius: 20,
        padding: '6px 16px',
        backdropFilter: 'blur(4px)',
        textAlign: 'center',
      }}>
        <div style={{
          color: '#FFD700',
          fontFamily: '"Fredoka One", cursive',
          fontSize: 22,
          lineHeight: 1,
          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }}>{score.toLocaleString()}</div>
        <div style={{ color: '#aaa', fontSize: 10, letterSpacing: 1 }}>SCORE</div>
      </div>

      {/* Level & Carrots */}
      <div style={{
        background: 'rgba(0,0,0,0.55)',
        borderRadius: 20,
        padding: '6px 12px',
        backdropFilter: 'blur(4px)',
        textAlign: 'right',
      }}>
        <div style={{
          color: 'white',
          fontFamily: '"Fredoka One", cursive',
          fontSize: 14,
          lineHeight: 1.3,
        }}>
          Level {level}/{totalLevels}
        </div>
        <div style={{ color: '#FF6B35', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>🥕</span>
          <span style={{ fontFamily: '"Fredoka One", cursive' }}>
            {carrotsCollected}/{totalCarrots}
          </span>
        </div>
      </div>
    </div>
  );
}
