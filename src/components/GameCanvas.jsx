import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameLoop } from '../game/GameLoop.js';
import { GAME_STATES, CANVAS_WIDTH, CANVAS_HEIGHT, LEVELS } from '../config.js';
import { useGameControls } from '../hooks/useGameControls.js';
import { HUD } from './HUD.jsx';
import { Menu } from './Menu.jsx';
import { LevelComplete } from './LevelComplete.jsx';

export function GameCanvas() {
  const canvasRef    = useRef(null);
  const gameLoopRef  = useRef(null);
  const [gameState,        setGameState]        = useState(GAME_STATES.MENU);
  const [score,            setScore]            = useState(0);
  const [lives,            setLives]            = useState(3);
  const [levelIndex,       setLevelIndex]       = useState(0);
  const [carrotsCollected, setCarrotsCollected] = useState(0);
  const [totalCarrots,     setTotalCarrots]     = useState(0);
  const [highScore,        setHighScore]        = useState(parseInt(localStorage.getItem('rabbitHighScore') || '0'));
  const [showTip,          setShowTip]          = useState(false);

  // Poll every 50ms — no player guard so levelIndex stays live during LEVEL_COMPLETE
  useEffect(() => {
    const iv = setInterval(() => {
      const gl = gameLoopRef.current;
      if (!gl) return;
      setScore(gl.score);
      setLevelIndex(gl.levelIndex);
      setHighScore(gl.highScore);
      if (gl.player) setLives(gl.player.lives);
      setCarrotsCollected(gl.levelManager.collectedCount);
      setTotalCarrots(gl.levelManager.totalCarrots);
    }, 50);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = new GameLoop(canvas);
    gl.onStateChange = (newState) => {
      setGameState(newState);
      setLevelIndex(gl.levelIndex); // immediate sync
      if (newState === GAME_STATES.PLAYING && gl.levelIndex === 0) {
        setTimeout(() => { setShowTip(true); setTimeout(() => setShowTip(false), 3800); }, 1400);
      }
    };
    gameLoopRef.current = gl;
    return () => gl.destroy();
  }, []);

  const handleNextLevel = useCallback(() => gameLoopRef.current?.nextLevel(), []);

  // Pass handleNextLevel into controls so Enter key works on the cheer screen
  useGameControls(gameLoopRef, gameState, handleNextLevel);

  const handleStart    = useCallback(() => gameLoopRef.current?.startGame(),   []);
  const handleResume   = useCallback(() => gameLoopRef.current?.pauseGame(),   []);
  const handleRestart  = useCallback(() => gameLoopRef.current?.restartGame(), []);

  const isPlaying       = gameState === GAME_STATES.PLAYING;
  const isPaused        = gameState === GAME_STATES.PAUSED;
  const isLevelComplete = gameState === GAME_STATES.LEVEL_COMPLETE;

  return (
    <div style={{
      position: 'relative', width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
      borderRadius: 0, overflow: 'hidden',
      boxShadow: '0 0 0 2px rgba(255,255,255,0.05)',
      userSelect: 'none',
    }}>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ display: 'block' }} />

      {/* HUD shown while playing or paused */}
      {(isPlaying || isPaused) && (
        <HUD
          score={score} lives={lives}
          level={levelIndex + 1} totalLevels={LEVELS.length}
          carrotsCollected={carrotsCollected} totalCarrots={totalCarrots}
        />
      )}

      {/* Level 1 beginner tip */}
      {showTip && (
        <div style={{
          position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.72)', color: '#FFE082', fontSize: 16,
          borderRadius: 24, padding: '8px 24px', pointerEvents: 'none',
          whiteSpace: 'nowrap', animation: 'fadeIn 0.4s ease',
        }}>
          💡 Tip: You can double-jump in mid-air!
        </div>
      )}

      {/* ── Celebration screen ── */}
      {isLevelComplete && (
        <LevelComplete
          level={levelIndex + 1}
          score={score}
          onNext={handleNextLevel}
          isLastLevel={levelIndex >= LEVELS.length - 1}
        />
      )}

      <Menu
        state={gameState}
        onStart={handleStart} onResume={handleResume}
        onRestart={handleRestart} score={score} highScore={highScore}
      />

      {/* Touch / TV D-pad */}
      {(isPlaying || isPaused) && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', padding: '10px 16px',
          pointerEvents: 'none', opacity: 0.45,
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <TouchBtn label="◀"
              onPress={()   => gameLoopRef.current?.setKey('ArrowLeft', true)}
              onRelease={()  => gameLoopRef.current?.setKey('ArrowLeft', false)} />
            <TouchBtn label="▶"
              onPress={()   => gameLoopRef.current?.setKey('ArrowRight', true)}
              onRelease={()  => gameLoopRef.current?.setKey('ArrowRight', false)} />
          </div>
          <TouchBtn label="↑"
            onPress={() => {
              gameLoopRef.current?.setKey('ArrowUp', true);
              setTimeout(() => gameLoopRef.current?.setKey('ArrowUp', false), 100);
            }}
            onRelease={() => {}} />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

function TouchBtn({ label, onPress, onRelease }) {
  return (
    <button
      onPointerDown={onPress}
      onPointerUp={onRelease}
      onPointerLeave={onRelease}
      style={{
        pointerEvents: 'all',
        background: 'rgba(255,255,255,0.14)',
        border: '1px solid rgba(255,255,255,0.28)',
        borderRadius: 12, color: 'white', fontSize: 24,
        width: 58, height: 58, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
      {label}
    </button>
  );
}
