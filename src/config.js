// Game Constants
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 500;

export const PLAYER = {
  WIDTH: 48,
  HEIGHT: 48,
  SPEED: 4,
  JUMP_FORCE: -14,
  GRAVITY: 0.6,
  MAX_FALL_SPEED: 12,
  LIVES: 3,
};

export const CARROT = {
  WIDTH: 32,
  HEIGHT: 32,
  POINTS: 10,
};

export const OBSTACLE = {
  WIDTH: 40,
  HEIGHT: 40,
  BASE_SPEED: 2,
};

export const LEVELS = [
  { level: 1, carrotsToCollect: 4,  obstacleSpeed: 1.2, obstacleCount: 2,  platformCount: 4, enemySlow: true },
  { level: 2, carrotsToCollect: 7,  obstacleSpeed: 2.2, obstacleCount: 4,  platformCount: 5 },
  { level: 3, carrotsToCollect: 9,  obstacleSpeed: 2.7, obstacleCount: 5,  platformCount: 5 },
  { level: 4, carrotsToCollect: 11, obstacleSpeed: 3.1, obstacleCount: 6,  platformCount: 6 },
  { level: 5, carrotsToCollect: 13, obstacleSpeed: 3.6, obstacleCount: 7,  platformCount: 6 },
];

export const GROUND_Y = CANVAS_HEIGHT - 60;

export const COLORS = {
  sky: '#87CEEB',
  ground: '#5D4037',
  grass: '#4CAF50',
  platform: '#8B6914',
  platformTop: '#6DB33F',
  carrot: '#FF6B35',
  carrotLeaf: '#4CAF50',
  obstacle: '#F44336',
  rabbit: '#F5F5F5',
  rabbitEar: '#FFCDD2',
  score: '#1A1A2E',
  hud: 'rgba(0,0,0,0.6)',
  star: '#FFD700',
};

export const GAME_STATES = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  GAME_OVER: 'GAME_OVER',
  WIN: 'WIN',
};
