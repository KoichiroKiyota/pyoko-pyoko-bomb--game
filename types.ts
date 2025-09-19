import type { ReactNode } from 'react';

export interface Character {
  name: string;
  emoji: string;
  description: string;
  bgColor: string;
  image: string;
}

// --- Game Specific Types ---

export type Position = { x: number; y: number };

export type GameState = 'playing' | 'won' | 'lost';

export type Bomb = {
  pos: Position;
  key: number;
};

export type Explosion = {
  pos: Position;
  key: number;
};

export type Item = {
  pos: Position;
  type: 'bomb_up' | 'fire_up';
  key: number;
};

export type PlayerStats = {
  maxBombs: number;
  bombRange: number;
};

export type Enemy = {
  id: number;
  pos: Position;
  status: 'hostile' | 'follower';
};

export interface GameStatus {
  grid: number[][];
  playerPosition: Position;
  playerStats: PlayerStats;
  bombs: Bomb[];
  explosions: Explosion[];
  items: Item[];
  enemies: Enemy[];
  playerTrail: Position[];
  gameState: GameState;
  gameOverReason: string | null;
}

// --- Reducer Action Types ---

export type GameAction =
  | { type: 'RESET_GAME' }
  | { type: 'GAME_TICK' }
  | { type: 'MOVE_PLAYER'; payload: { dx: number; dy: number } }
  | { type: 'PLACE_BOMB'; payload: { pos: Position; key: number } }
  | { type: 'EXPLODE_BOMB'; payload: { bombKey: number } }
  | { type: 'CLEAR_EXPLOSIONS'; payload: { explosionKeys: number[] } };