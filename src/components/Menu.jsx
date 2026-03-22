import React, { useState } from 'react';
import { GAME_STATES, LEVELS } from '../config.js';
import { CryingRabbit } from './CryingRabbit.jsx';

const DIFF_LABEL = (lvl) => lvl <= 5 ? '⭐ Easy–Medium' : lvl <= 7 ? '🔥 Hard' : lvl <= 9 ? '💀 Expert' : '☠️ Extreme';

export function Menu({ state, onStart, onResume, onRestart, score, highScore }) {
  if (state === GAME_STATES.PLAYING) return null;

  const overlay = {
    position: 'absolute', inset: 0, display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 20,
  };

  if (state === GAME_STATES.PAUSED) {
    return (
      <div style={{ ...overlay, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>
        <div style={cardStyle}>
          <div style={titleStyle}>⏸ Paused</div>
          <Btn onClick={onResume}  color="#4CAF50">Resume</Btn>
          <Btn onClick={onRestart} color="#FF9800">Restart</Btn>
        </div>
      </div>
    );
  }

  if (state === GAME_STATES.GAME_OVER) {
    return (
      <div style={{ ...overlay, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)' }}>
        <div style={{
          ...cardStyle,
          border: '1px solid rgba(244,67,54,0.3)',
          boxShadow: '0 32px 100px rgba(0,0,0,0.9), 0 0 60px rgba(244,67,54,0.15)',
        }}>
          {/* Animated crying rabbit illustration */}
          <div style={{ marginBottom: 6, animation: 'gentleShake 0.5s ease-in-out 3' }}>
            <CryingRabbit size={160} />
          </div>

          <div style={{
            fontWeight: 900, fontSize: 44, color: '#EF5350',
            textShadow: '0 3px 0 #b71c1c, 0 0 30px rgba(244,67,54,0.4)',
            marginBottom: 8, letterSpacing: 0.5,
          }}>Game Over</div>

          <div style={{
            fontSize: 15, color: '#888', fontStyle: 'italic',
            marginBottom: 16, lineHeight: 1.5,
          }}>
            Poor bunny… the foxes got you! 🦊
          </div>

          <div style={scoreDisplay}>
            Score: <strong style={{ color: '#FFD700' }}>{score.toLocaleString()}</strong>
          </div>
          {score >= highScore && score > 0 && (
            <div style={{ color: '#FFD700', fontSize: 15, marginBottom: 8 }}>🏆 New High Score!</div>
          )}
          <div style={{ color: '#555', fontSize: 14, marginBottom: 24 }}>
            Best: {highScore.toLocaleString()}
          </div>

          <Btn onClick={onRestart} color="#F44336">🐰 Try Again</Btn>
        </div>

        <style>{\`
          @keyframes gentleShake {
            0%,100% { transform: translateX(0); }
            20%      { transform: translateX(-6px); }
            40%      { transform: translateX(6px); }
            60%      { transform: translateX(-4px); }
            80%      { transform: translateX(4px); }
          }
        \`}</style>
      </div>
    );
  }

  if (state === GAME_STATES.WIN) {
    return (
      <div style={{ ...overlay, background: 'rgba(0,10,30,0.88)', backdropFilter: 'blur(8px)' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 68, marginBottom: 4 }}>🏆</div>
          <div style={{ ...titleStyle, color: '#FFD700' }}>You Win!</div>
          <div style={scoreDisplay}>Final Score: <strong>{score.toLocaleString()}</strong></div>
          {score >= highScore && score > 0 && <div style={{ color: '#FFD700', fontSize: 15, marginBottom: 8 }}>🎉 New Record!</div>}
          <Btn onClick={onRestart} color="#FFD700" textColor="#1a1a00">Play Again</Btn>
        </div>
      </div>
    );
  }

  // Main menu
  return (
    <div style={{ ...overlay, background: 'linear-gradient(160deg,#0d1a10 0%,#060d08 100%)' }}>
      <div style={{ ...cardStyle, maxWidth: 520 }}>
        <div style={{ fontSize: 80, lineHeight: 1.1 }}>🐰</div>
        <div style={{
          fontFamily: 'sans-serif', fontWeight: 800, fontSize: 52,
          color: '#FF6B35', textShadow: '0 3px 0 #b84a1a, 0 0 30px rgba(255,107,53,0.4)',
          letterSpacing: 1, marginBottom: 6,
        }}>Rabbit Rush</div>
        <div style={{ color: '#888', fontSize: 15, marginBottom: 24, lineHeight: 1.7 }}>
          Collect all carrots · Dodge foxes & hawks<br />
          <span style={{ color: '#aaa' }}>10 levels from Easy to ☠️ Extreme</span>
        </div>

        {/* Level progression preview */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6,
          marginBottom: 22, width: '100%',
        }}>
          {LEVELS.map((l, i) => {
            const colors = ['#4CAF50','#4CAF50','#4CAF50','#4CAF50','#4CAF50','#FF9800','#FF9800','#F44336','#F44336','#FF00FF'];
            return (
              <div key={i} style={{
                background: colors[i] + '22', border: `1px solid ${colors[i]}55`,
                borderRadius: 8, padding: '6px 4px', textAlign: 'center',
              }}>
                <div style={{ color: colors[i], fontWeight: 700, fontSize: 13 }}>Lv {l.level}</div>
                <div style={{ color: '#777', fontSize: 10 }}>{l.theme}</div>
              </div>
            );
          })}
        </div>

        <div style={{ color: '#555', fontSize: 13, marginBottom: 18, lineHeight: 1.9 }}>
          ← → / A D — Move &nbsp;|&nbsp; ↑ W Space — Jump &nbsp;|&nbsp; Double-jump! &nbsp;|&nbsp; P — Pause
        </div>
        {highScore > 0 && <div style={{ color: '#FFD700', fontSize: 15, marginBottom: 14 }}>🏆 Best: {highScore.toLocaleString()}</div>}
        <Btn onClick={onStart} color="#FF6B35">🥕 Start Game</Btn>
      </div>
    </div>
  );
}

function Btn({ onClick, color, textColor = 'white', children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? shadeColor(color, -20) : color,
        color: textColor, border: 'none', borderRadius: 32,
        padding: '14px 42px', fontFamily: 'sans-serif', fontWeight: 700, fontSize: 22,
        cursor: 'pointer', width: '100%', marginBottom: 12,
        transform: hov ? 'scale(1.04)' : 'scale(1)',
        transition: 'all 0.15s ease',
        boxShadow: `0 5px 0 ${shadeColor(color,-40)}, 0 8px 24px ${color}55`,
        letterSpacing: 0.5,
      }}>
      {children}
    </button>
  );
}

function shadeColor(hex, amount) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, Math.max(0, (num>>16)+amount));
  const g = Math.min(255, Math.max(0, ((num>>8)&0xff)+amount));
  const b = Math.min(255, Math.max(0, (num&0xff)+amount));
  return `rgb(${r},${g},${b})`;
}

const cardStyle = {
  background: 'rgba(8,18,10,0.94)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 28, padding: '40px 48px', textAlign: 'center', color: 'white',
  minWidth: 340, boxShadow: '0 28px 90px rgba(0,0,0,0.8)',
};
const titleStyle = { fontFamily: 'sans-serif', fontWeight: 700, fontSize: 42, color: 'white', marginBottom: 14 };
const scoreDisplay = { fontSize: 20, color: '#eee', marginBottom: 10 };
