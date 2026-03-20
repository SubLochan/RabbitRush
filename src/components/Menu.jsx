import React from 'react';
import { GAME_STATES } from '../config.js';

export function Menu({ state, onStart, onResume, onRestart, score, highScore }) {
  if (state === GAME_STATES.PLAYING) return null;

  const overlay = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  };

  if (state === GAME_STATES.PAUSED) {
    return (
      <div style={{ ...overlay, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
        <div style={cardStyle}>
          <div style={titleStyle}>⏸ Paused</div>
          <Btn onClick={onResume} color="#4CAF50">Resume</Btn>
          <Btn onClick={onRestart} color="#FF9800">Restart</Btn>
        </div>
      </div>
    );
  }

  if (state === GAME_STATES.GAME_OVER) {
    return (
      <div style={{ ...overlay, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 56, marginBottom: 4 }}>💔</div>
          <div style={titleStyle}>Game Over</div>
          <div style={scoreDisplay}>Score: <strong>{score.toLocaleString()}</strong></div>
          {score >= highScore && score > 0 && (
            <div style={{ color: '#FFD700', fontSize: 14, marginBottom: 8 }}>🏆 New High Score!</div>
          )}
          <div style={{ color: '#aaa', fontSize: 13, marginBottom: 16 }}>Best: {highScore.toLocaleString()}</div>
          <Btn onClick={onRestart} color="#F44336">Try Again</Btn>
        </div>
      </div>
    );
  }

  if (state === GAME_STATES.WIN) {
    return (
      <div style={{ ...overlay, background: 'rgba(0,20,40,0.85)', backdropFilter: 'blur(6px)' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 56, marginBottom: 4, animation: 'spin 2s linear infinite' }}>🏆</div>
          <div style={{ ...titleStyle, color: '#FFD700' }}>You Win!</div>
          <div style={scoreDisplay}>Final Score: <strong>{score.toLocaleString()}</strong></div>
          {score >= highScore && score > 0 && (
            <div style={{ color: '#FFD700', fontSize: 14, marginBottom: 8 }}>🎉 New High Score!</div>
          )}
          <Btn onClick={onRestart} color="#FFD700" textColor="#1a1a1a">Play Again</Btn>
        </div>
      </div>
    );
  }

  // MENU
  return (
    <div style={{
      ...overlay,
      background: 'linear-gradient(160deg, #1a3a2a 0%, #0d2015 100%)',
    }}>
      <div style={{ ...cardStyle, maxWidth: 380 }}>
        <div style={{ fontSize: 72, marginBottom: 0, lineHeight: 1 }}>🐰</div>
        <div style={{
          fontFamily: '"Fredoka One", cursive',
          fontSize: 42,
          color: '#FF6B35',
          textShadow: '0 3px 0 #b84a1a, 0 0 30px rgba(255,107,53,0.4)',
          letterSpacing: 1,
          marginBottom: 4,
        }}>
          Rabbit Rush
        </div>
        <div style={{ color: '#aaa', fontSize: 14, marginBottom: 24, letterSpacing: 0.5 }}>
          Collect all carrots, avoid foxes & hawks!
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px 16px',
          marginBottom: 24,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 12,
          padding: '12px 16px',
          textAlign: 'left',
          fontSize: 13,
          color: '#ccc',
        }}>
          <div>⬅️➡️ / A D — Move</div>
          <div>⬆️ / W / Space — Jump</div>
          <div>🐇 Double jump!</div>
          <div>P / Esc — Pause</div>
        </div>

        {highScore > 0 && (
          <div style={{ color: '#FFD700', fontSize: 14, marginBottom: 12 }}>
            🏆 Best: {highScore.toLocaleString()}
          </div>
        )}
        <Btn onClick={onStart} color="#FF6B35">🥕 Start Game</Btn>
      </div>
    </div>
  );
}

function Btn({ onClick, color, textColor = 'white', children }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? shadeColor(color, -20) : color,
        color: textColor,
        border: 'none',
        borderRadius: 30,
        padding: '12px 36px',
        fontFamily: '"Fredoka One", cursive',
        fontSize: 20,
        cursor: 'pointer',
        width: '100%',
        marginBottom: 10,
        transform: hov ? 'scale(1.04)' : 'scale(1)',
        transition: 'all 0.15s ease',
        boxShadow: `0 4px 0 ${shadeColor(color, -40)}, 0 6px 20px ${color}55`,
        letterSpacing: 0.5,
      }}
    >
      {children}
    </button>
  );
}

function shadeColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}

const cardStyle = {
  background: 'rgba(10,20,15,0.92)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 24,
  padding: '36px 40px',
  textAlign: 'center',
  color: 'white',
  minWidth: 300,
  boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
};

const titleStyle = {
  fontFamily: '"Fredoka One", cursive',
  fontSize: 36,
  color: 'white',
  marginBottom: 12,
};

const scoreDisplay = {
  fontSize: 18,
  color: '#eee',
  marginBottom: 8,
};
