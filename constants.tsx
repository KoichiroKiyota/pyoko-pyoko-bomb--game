import React from 'react';
import type { Character } from './types';

// --- Game Config ---
export const GRID_WIDTH = 15;
export const GRID_HEIGHT = 13;
export const TILE_SIZE = 56; // in pixels
export const NUM_ENEMIES = 3;

export const TILE = {
  EMPTY: 0,
  INDESTRUCTIBLE: 1,
  DESTRUCTIBLE: 2,
};

export const PLAYER_START = { x: 1, y: 1 };
export const BOMB_TIMER = 3000;
export const EXPLOSION_TIMER = 500;
export const ENEMY_MOVE_INTERVAL = 700;

// --- New ---
export const INITIAL_MAX_BOMBS = 1;
export const INITIAL_BOMB_RANGE = 2;
export const ITEM_SPAWN_CHANCE = 0.35; // 35% chance

// --- Promotional Page Data ---
export const CHARACTERS: Character[] = [
  {
    name: "バニーガール",
    emoji: "👯‍♀️",
    description: "俊敏なステップが魅力！初期の移動速度が少し速い。",
    bgColor: "bg-pink-100",
    image: "https://picsum.photos/seed/bunnygirl/300/300"
  },
  {
    name: "ネコ",
    emoji: "🐈",
    description: "爆弾の扱いが得意。爆弾の初期設置数が多い。",
    bgColor: "bg-blue-100",
    image: "https://picsum.photos/seed/cat/300/300"
  },
  {
    name: "ヒヨコ",
    emoji: "🐤",
    description: "パワフルな爆風！爆弾の爆発範囲が少し広い。",
    bgColor: "bg-yellow-100",
    image: "https://picsum.photos/seed/chick/300/300"
  },
];

export const GAME_FEATURES = [
    {
        icon: '♡',
        title: '爆弾アクション'
    },
    {
        icon: '💥',
        title: 'パワーアップ'
    },
    {
        icon: '🗺️',
        title: '迷路ステージ'
    },
    {
        icon: '👻',
        title: '可愛い敵キャラ'
    }
];