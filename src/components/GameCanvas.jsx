import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameLoop } from '../game/GameLoop.js';
import { GAME_STATES, CANVAS_WIDTH, CANVAS_HEIGHT, LEVELS } from '../config.js';
import { useGameControls } from '../hooks/useGameControls.js';
import { HUD } from './HUD.jsx';
import { Menu } from './Menu.jsx';
import { LevelComplete } from './LevelComplete.jsx';

export function GameCanvas() {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const [gameState, setGameState] = useState(GAME_STATES.MENU);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [levelIndex, setLevelIndex] = useState(0);
  const [carrotsCollected, setCarrotsCollected] = useState(0);
  const [totalCarrots, setTotalCarrots] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('rabbitHighScore') || '0'));
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const gl = gameLoopRef.current;
      if (!gl || !gl.player) return;
      setScore(gl.score);
      setLives(gl.player.lives);
      setLevelIndex(gl.levelIndex);
      setCarrotsCollected(gl.levelManager.collectedCount);
      setTotalCarrots(gl.levelManager.totalCarrots);
      setHighScore(gl.highScore);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = new GameLoop(canvas);
    gl.onStateChange = (newState) => {
      setGameState(newState);
      if (newState === GAME_STATES.PLAYING && gl.levelIndex === 0) {
        setTimeout(() => { setShowTip(true); setTimeout(() => setShowTip(false), 3500); }, 1200);
      }
    };
    gameLoopRef.current = gl;
    return () => gl.destroy();
  }, []);

  useGameControls(gameLoopRef, gameState);

  const handleStart = useCallback(() => gameLoopRef.current?.startGame(), []);
  const handleResume = useCallback(() => gameLoopRef.current?.pauseGame(), []);
  const handleRestart = useCallback(() => gameLoopRef.current?.restartGame(), []);
  const handleNextLevel = useCallback(() => gameLoopRef.current?.nextLevel(), []);

  const isPlaying = gameState === GAME_STATES.PLAYING;
  const isPaused = gameState === GAME_STATES.PAUSED;
  const isLevelComplete = gameState === GAME_STATES.LEVEL_COMPLETE;

  return (
    <div style={{
      position: 'relative', width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
      borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.06)',
      userSelect: 'none',
    }}>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ display: 'block' }} />

      {(isPlaying || isPaused) && (
        <HUD score={score} lives={lives} level={levelIndex + 1} totalLevels={LEVELS.length}
          carrotsCollected={carrotsCollected} totalCarrots={totalCarrots} />
      )}

      {/* Level 1 beginner tip */}
      {showTip && (
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.68)', color: '#FFE082', fontSize: 13,
          borderRadius: 20, padding: '6px 18px', pointerEvents: 'none',
          whiteSpace: 'nowrap', animation: 'fadeIn 0.4s ease',
        }}>
          💡 Tip: You can double-jump in mid-air!
        </div>
      )}

      {isLevelComplete && (
        <LevelComplete level={levelIndex + 1} score={score} onNext={handleNextLevel}
          isLastLevel={levelIndex >= LEVELS.length - 1} />
      )}

      <Menu state={gameState} onStart={handleStart} onResume={handleResume}
        onRestart={handleRestart} score={score} highScore={highScore} />

      {(isPlaying || isPaused) && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', padding: '8px 12px',
          pointerEvents: 'none', opacity: 0.5,
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <TouchBtn label="◀" onPress={() => gameLoopRef.current?.setKey('ArrowLeft', true)} onRelease={() => gameLoopRef.current?.setKey('ArrowLeft', false)} />
            <TouchBtn label="▶" onPress={() => gameLoopRef.current?.setKey('ArrowRight', true)} onRelease={() => gameLoopRef.current?.setKey('ArrowRight', false)} />
          </div>
          <TouchBtn label="↑" onPress={() => { gameLoopRef.current?.setKey('ArrowUp', true); setTimeout(() => gameLoopRef.current?.setKey('ArrowUp', false), 100); }} onRelease={() => {}} />
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(6px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}

function TouchBtn({ label, onPress, onRelease }) {
  return (
    <button onPointerDown={onPress} onPointerUp={onRelease} onPointerLeave={onRelease}
      style={{ pointerEvents: 'all', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: 10, color: 'white', fontSize: 20, width: 48, height: 48,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {label}
    </button>
  );
}
