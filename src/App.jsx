import React, { useEffect, useRef, useState } from 'react';
import { GameCanvas } from './components/GameCanvas.jsx';
import './styles/main.css';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';

export default function App() {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const scaleX = (window.innerWidth - 32) / CANVAS_WIDTH;
      const scaleY = (window.innerHeight - 32) / CANVAS_HEIGHT;
      setScale(Math.min(1, scaleX, scaleY));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <GameCanvas />
      </div>
    </div>
  );
}
