// Game Constants — 1280×720 (16:9, TV-ready)
export const CANVAS_WIDTH  = 1280;
export const CANVAS_HEIGHT = 720;
export const GROUND_Y      = CANVAS_HEIGHT - 72;

export const PLAYER = {
  WIDTH: 56,
  HEIGHT: 56,
  SPEED: 5,
  JUMP_FORCE: -16,
  GRAVITY: 0.62,
  MAX_FALL_SPEED: 14,
  LIVES: 3,
};

export const CARROT = {
  WIDTH: 36,
  HEIGHT: 36,
  POINTS: 10,
};

export const OBSTACLE = {
  WIDTH: 48,
  HEIGHT: 48,
  BASE_SPEED: 2,
};

// ─── Levels 1-5  (beginner → intermediate) ────────────────────────────────
// ─── Levels 6-10 (hard → extreme)          ────────────────────────────────
export const LEVELS = [
  // ── Easy ──
  { level:  1, carrotsToCollect:  4, obstacleSpeed: 1.2, obstacleCount:  2, platformCount:  4, enemySlow: true,  theme: 'meadow'  },
  { level:  2, carrotsToCollect:  7, obstacleSpeed: 2.0, obstacleCount:  4, platformCount:  5, theme: 'meadow'  },
  { level:  3, carrotsToCollect:  9, obstacleSpeed: 2.5, obstacleCount:  5, platformCount:  5, theme: 'forest'  },
  { level:  4, carrotsToCollect: 11, obstacleSpeed: 3.0, obstacleCount:  6, platformCount:  6, theme: 'forest'  },
  { level:  5, carrotsToCollect: 13, obstacleSpeed: 3.5, obstacleCount:  7, platformCount:  6, theme: 'forest'  },
  // ── Hard ──
  { level:  6, carrotsToCollect: 15, obstacleSpeed: 4.0, obstacleCount:  9, platformCount:  7, theme: 'cave',   narrowPlatforms: true  },
  { level:  7, carrotsToCollect: 17, obstacleSpeed: 4.6, obstacleCount: 10, platformCount:  8, theme: 'cave',   narrowPlatforms: true  },
  // ── Expert ──
  { level:  8, carrotsToCollect: 20, obstacleSpeed: 5.2, obstacleCount: 11, platformCount:  8, theme: 'volcano', narrowPlatforms: true, moreHawks: true },
  { level:  9, carrotsToCollect: 22, obstacleSpeed: 5.8, obstacleCount: 12, platformCount:  9, theme: 'volcano', narrowPlatforms: true, moreHawks: true },
  // ── Extreme ──
  { level: 10, carrotsToCollect: 25, obstacleSpeed: 6.5, obstacleCount: 14, platformCount: 10, theme: 'storm',  narrowPlatforms: true, moreHawks: true, fastBounce: true },
];

// Theme sky/ground colours used by LevelManager.drawBackground
export const THEMES = {
  meadow:  { skyTop: '#5BA3C0', skyBot: '#C8E8F2', groundFill: '#5D4037', grassTop: '#4CAF50', grassBlade: '#388E3C' },
  forest:  { skyTop: '#2E5E3A', skyBot: '#8DBE8A', groundFill: '#3E2723', grassTop: '#388E3C', grassBlade: '#2E7D32' },
  cave:    { skyTop: '#1A1A2E', skyBot: '#2D2D44', groundFill: '#212121', grassTop: '#455A64', grassBlade: '#37474F' },
  volcano: { skyTop: '#4A0000', skyBot: '#8B2500', groundFill: '#1C1C1C', grassTop: '#B71C1C', grassBlade: '#880E4F' },
  storm:   { skyTop: '#0D0D1A', skyBot: '#1A1A3A', groundFill: '#0A0A0A', grassTop: '#1B1B2E', grassBlade: '#222244' },
};

export const GAME_STATES = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  GAME_OVER: 'GAME_OVER',
  WIN: 'WIN',
};

export const COLORS = {
  sky: '#87CEEB', ground: '#5D4037', grass: '#4CAF50',
  platform: '#8B6914', platformTop: '#6DB33F',
  carrot: '#FF6B35', carrotLeaf: '#4CAF50',
  obstacle: '#F44336', rabbit: '#F5F5F5', rabbitEar: '#FFCDD2',
  score: '#1A1A2E', hud: 'rgba(0,0,0,0.6)', star: '#FFD700',
};
