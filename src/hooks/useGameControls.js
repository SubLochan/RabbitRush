import { useEffect, useCallback, useRef } from 'react';

export function useGameControls(gameLoopRef, gameState) {
  const touchStartRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (!gameLoopRef.current) return;
    const gl = gameLoopRef.current;

    if (e.code === 'Escape' || e.code === 'KeyP') {
      if (gameState === 'PLAYING' || gameState === 'PAUSED') {
        gl.pauseGame();
      }
      return;
    }

    gl.setKey(e.code, true);
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  }, [gameLoopRef, gameState]);

  const handleKeyUp = useCallback((e) => {
    if (!gameLoopRef.current) return;
    gameLoopRef.current.setKey(e.code, false);
  }, [gameLoopRef]);

  // Touch controls
  const handleTouchStart = useCallback((e) => {
    if (!gameLoopRef.current) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  }, [gameLoopRef]);

  const handleTouchEnd = useCallback((e) => {
    if (!gameLoopRef.current || !touchStartRef.current) return;
    const gl = gameLoopRef.current;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    if (Math.abs(dy) > 40 && dy < 0) {
      gl.setKey('ArrowUp', true);
      setTimeout(() => gl.setKey('ArrowUp', false), 100);
    } else if (Math.abs(dx) > 30 && dt < 300) {
      if (dx > 0) {
        gl.setKey('ArrowRight', true);
        setTimeout(() => gl.setKey('ArrowRight', false), 200);
      } else {
        gl.setKey('ArrowLeft', true);
        setTimeout(() => gl.setKey('ArrowLeft', false), 200);
      }
    }
    touchStartRef.current = null;
  }, [gameLoopRef]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleKeyDown, handleKeyUp, handleTouchStart, handleTouchEnd]);
}
