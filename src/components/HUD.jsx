import React from 'react';
import { LEVELS } from '../config.js';

const DIFFICULTY = ['','','Easy','Easy','Easy','Easy','Easy','Hard','Hard','Expert','EXTREME'];

function getDiffColor(level) {
  if (level <= 5)  return '#4CAF50';
  if (level <= 7)  return '#FF9800';
  if (level <= 9)  return '#F44336';
  return '#FF00FF';
}

export function HUD({ score, lives, level, totalLevels, carrotsCollected, totalCarrots }) {
  const hearts = Array.from({ length: 3 }, (_, i) => i < lives);
  const diff = DIFFICULTY[level] || '';
  const diffColor = getDiffColor(level);
  const cfg = LEVELS[level - 1];
  const themeName = cfg ? (cfg.theme.charAt(0).toUpperCase() + cfg.theme.slice(1)) : '';

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      padding: '12px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      pointerEvents: 'none', zIndex: 10,
    }}>
      {/* Lives */}
      <div style={{
        display: 'flex', gap: 6, background: 'rgba(0,0,0,0.55)',
        borderRadius: 24, padding: '8px 16px', backdropFilter: 'blur(4px)',
      }}>
        {hearts.map((alive, i) => (
          <span key={i} style={{
            fontSize: 26,
            filter: alive ? 'none' : 'grayscale(1) opacity(0.3)',
            transition: 'filter 0.3s',
          }}>❤️</span>
        ))}
      </div>

      {/* Centre: score */}
      <div style={{
        background: 'rgba(0,0,0,0.55)', borderRadius: 24,
        padding: '8px 20px', backdropFilter: 'blur(4px)', textAlign: 'center',
      }}>
        <div style={{ color: '#FFD700', fontFamily: 'sans-serif', fontWeight: 700, fontSize: 28, lineHeight: 1, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
          {score.toLocaleString()}
        </div>
        <div style={{ color: '#aaa', fontSize: 11, letterSpacing: 1.5, marginTop: 2 }}>SCORE</div>
      </div>

      {/* Right: level + theme + carrots */}
      <div style={{
        background: 'rgba(0,0,0,0.55)', borderRadius: 24,
        padding: '8px 16px', backdropFilter: 'blur(4px)', textAlign: 'right',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
          <span style={{
            background: diffColor, color: 'white', fontSize: 10, fontWeight: 700,
            borderRadius: 8, padding: '2px 8px', letterSpacing: 0.5,
          }}>{diff}</span>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
            Lv {level}/{totalLevels}
          </span>
        </div>
        <div style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>{themeName}</div>
        <div style={{ color: '#FF6B35', fontSize: 14, display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end', marginTop: 2 }}>
          <span style={{ fontSize: 16 }}>🥕</span>
          <span style={{ fontWeight: 700 }}>{carrotsCollected}/{totalCarrots}</span>
        </div>
      </div>
    </div>
  );
}
