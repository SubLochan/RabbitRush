# 🐰 Rabbit Rush

A kawaii canvas-based platformer built with React + Vite. Collect carrots, avoid foxes & hawks across 5 levels!

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Controls

| Key | Action |
|-----|--------|
| ← → / A D | Move |
| ↑ / W / Space | Jump |
| Double-tap jump | Mid-air double jump |
| P / Esc | Pause |

## 🏗️ Project Structure

```
rabbit-carrot-game/
├── index.html              ← Vite entry point (must be in root)
├── vite.config.js
├── package.json
├── public/                 ← Static assets
├── src/
│   ├── main.jsx            ← React entry point
│   ├── App.jsx
│   ├── config.js           ← Game constants & level configs
│   ├── components/
│   │   ├── GameCanvas.jsx
│   │   ├── HUD.jsx
│   │   ├── Menu.jsx
│   │   └── LevelComplete.jsx
│   ├── game/
│   │   ├── GameLoop.js
│   │   ├── Player.js       ← Kawaii rabbit with blinking, wagging tail
│   │   ├── Carrot.js
│   │   ├── Obstacle.js     ← Fox + Hawk enemies
│   │   └── LevelManager.js
│   ├── hooks/
│   │   └── useGameControls.js
│   └── styles/
│       └── main.css
```

## ✨ Features

- 🐰 Kawaii rabbit: sparkly eyes, rosy cheeks, wagging tail, blinking
- 🦊 Fox + 🦅 Hawk enemies with patrol AI
- 🥕 5 levels — Level 1 is beginner-friendly (slow enemies, fewer carrots)
- 💾 High score saved in localStorage
- 📱 Touch controls for mobile
- 💥 Screen shake on damage
- ⭐ Level complete star rating
