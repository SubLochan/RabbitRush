import React, { useEffect, useState } from 'react';
import { GameCanvas } from './components/GameCanvas.jsx';
import './styles/main.css';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';

export default function App() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      // Scale UP on large screens (TV) as well as down on small ones
      const scaleX = window.innerWidth  / CANVAS_WIDTH;
      const scaleY = window.innerHeight / CANVAS_HEIGHT;
      // Cap at 1.5× upscale so it doesn't blur too much on 4K TVs
      setScale(Math.min(scaleX, scaleY, 1.5));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', background: '#060d08',
    }}>
      <div style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        // Hint the browser to use GPU compositing for crisp TV upscale
        willChange: 'transform',
        imageRendering: 'auto',
      }}>
        <GameCanvas />
      </div>
    </div>
  );
}
