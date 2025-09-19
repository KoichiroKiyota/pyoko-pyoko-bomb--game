import React, { useReducer, useEffect, useCallback, useRef } from 'react';
import {
  GRID_WIDTH, GRID_HEIGHT, TILE_SIZE, NUM_ENEMIES, TILE, PLAYER_START,
  BOMB_TIMER, EXPLOSION_TIMER, ENEMY_MOVE_INTERVAL,
  INITIAL_BOMB_RANGE, INITIAL_MAX_BOMBS, ITEM_SPAWN_CHANCE,
} from '../constants';
import { GameStatus, Position, GameAction, Enemy, Item } from '../types';
import { PlayerCharacter } from './assets/PlayerCharacter';
import { EnemyCharacter } from './assets/EnemyCharacter';
import { HeartBomb } from './assets/HeartBomb';
import { PresentBox } from './assets/PresentBox';
import { WallBlock } from './assets/WallBlock';
import { UIOverlay } from './UIOverlay';
import { BombUpItem } from './assets/BombUpItem';
import { FireUpItem } from './assets/FireUpItem';
import { StatusBar } from './StatusBar';

// --- Game Logic Utilities (Pure Functions) ---

const createInitialGrid = (): number[][] => {
  const grid = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(TILE.EMPTY));
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (y === 0 || y === GRID_HEIGHT - 1 || x === 0 || x === GRID_WIDTH - 1 || (x % 2 === 0 && y % 2 === 0)) {
        grid[y][x] = TILE.INDESTRUCTIBLE;
      } else if (Math.random() < 0.7) {
        grid[y][x] = TILE.DESTRUCTIBLE;
      }
    }
  }
  grid[PLAYER_START.y][PLAYER_START.x] = TILE.EMPTY;
  grid[PLAYER_START.y + 1][PLAYER_START.x] = TILE.EMPTY;
  grid[PLAYER_START.y][PLAYER_START.x + 1] = TILE.EMPTY;
  return grid;
};

const createInitialEnemies = (grid: number[][]): Enemy[] => {
    const enemies: Enemy[] = [];
    let attempts = 0;
    while (enemies.length < NUM_ENEMIES && attempts < 100) {
        const x = Math.floor(Math.random() * (GRID_WIDTH - 2)) + 1;
        const y = Math.floor(Math.random() * (GRID_HEIGHT - 2)) + 1;
        const isFarFromPlayer = Math.abs(x - PLAYER_START.x) + Math.abs(y - PLAYER_START.y) > 4;
        if (grid[y][x] === TILE.EMPTY && isFarFromPlayer) {
            enemies.push({ id: enemies.length, pos: { x, y }, status: 'hostile' });
        }
        attempts++;
    }
    return enemies;
};

const getInitialState = (): GameStatus => {
  const grid = createInitialGrid();
  return {
    grid,
    enemies: createInitialEnemies(grid),
    playerPosition: PLAYER_START,
    playerStats: {
      maxBombs: INITIAL_MAX_BOMBS,
      bombRange: INITIAL_BOMB_RANGE,
    },
    bombs: [],
    explosions: [],
    items: [],
    playerTrail: [],
    gameState: 'playing',
    gameOverReason: null,
  };
};

// --- Game Reducer: The heart of the game logic ---

const gameReducer = (state: GameStatus, action: GameAction): GameStatus => {
  switch (action.type) {
    case 'RESET_GAME':
      return getInitialState();

    case 'MOVE_PLAYER': {
      if (state.gameState !== 'playing') return state;
      const { dx, dy } = action.payload;
      const { x, y } = state.playerPosition;
      const newPos = { x: x + dx, y: y + dy };
      const targetTile = state.grid[newPos.y]?.[newPos.x];
      const isBombAtTarget = state.bombs.some(b => b.pos.x === newPos.x && b.pos.y === newPos.y);

      if (targetTile === TILE.EMPTY && !isBombAtTarget) {
        // --- Item Pickup Logic ---
        let newPlayerStats = state.playerStats;
        let newItems = state.items;
        const itemAtNewPos = state.items.find(item => item.pos.x === newPos.x && item.pos.y === newPos.y);
        if (itemAtNewPos) {
          if (itemAtNewPos.type === 'bomb_up') {
            newPlayerStats = { ...state.playerStats, maxBombs: state.playerStats.maxBombs + 1 };
          } else { // fire_up
            newPlayerStats = { ...state.playerStats, bombRange: state.playerStats.bombRange + 1 };
          }
          newItems = state.items.filter(item => item.key !== itemAtNewPos.key);
        }

        // --- Follower Logic ---
        const newTrail = [state.playerPosition, ...state.playerTrail];
        const followers = state.enemies.filter(e => e.status === 'follower');
        const trimmedTrail = newTrail.slice(0, followers.length);
        const newEnemies = state.enemies.map(enemy => {
          if (enemy.status === 'follower') {
            const followerIndex = followers.findIndex(f => f.id === enemy.id);
            const targetPos = trimmedTrail[followerIndex];
            return targetPos ? { ...enemy, pos: targetPos } : enemy;
          }
          return enemy;
        });

        return { 
          ...state, 
          playerPosition: newPos, 
          playerStats: newPlayerStats,
          items: newItems,
          enemies: newEnemies,
          playerTrail: trimmedTrail,
        };
      }
      return state;
    }

    case 'PLACE_BOMB':
      return { ...state, bombs: [...state.bombs, { pos: action.payload.pos, key: action.payload.key }] };

    case 'EXPLODE_BOMB': {
      const bomb = state.bombs.find(b => b.key === action.payload.bombKey);
      if (!bomb) return state;

      const bombPos = bomb.pos;
      const explosionPositions = new Set<string>([`${bombPos.x},${bombPos.y}`]);
      const directions = [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }];
      const newGrid = state.grid.map(row => [...row]);
      const destroyedBlockPositions: Position[] = [];

      directions.forEach(dir => {
        for (let i = 1; i <= state.playerStats.bombRange; i++) {
          const x = bombPos.x + dir.x * i;
          const y = bombPos.y + dir.y * i;
          if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) break;
          
          explosionPositions.add(`${x},${y}`);
          if (newGrid[y][x] === TILE.INDESTRUCTIBLE) break;
          if (newGrid[y][x] === TILE.DESTRUCTIBLE) {
            newGrid[y][x] = TILE.EMPTY;
            destroyedBlockPositions.push({ x, y });
            break;
          }
        }
      });
      
      const newExplosionPositions = Array.from(explosionPositions).map(posStr => {
          const [x, y] = posStr.split(',').map(Number);
          return { x, y };
      });
      
      const newItems: Item[] = [];
      destroyedBlockPositions.forEach(pos => {
        if (Math.random() < ITEM_SPAWN_CHANCE) {
          const type = Math.random() < 0.5 ? 'bomb_up' : 'fire_up';
          newItems.push({ pos, type, key: Math.random() + Date.now() });
        }
      });

      const newEnemies: Enemy[] = state.enemies.map(enemy => {
        if (enemy.status === 'hostile' && newExplosionPositions.some(exp => exp.x === enemy.pos.x && exp.y === enemy.pos.y)) {
          return { ...enemy, status: 'follower' };
        }
        return enemy;
      });
      
      const newExplosions = newExplosionPositions.map(pos => ({ pos, key: Date.now() + Math.random() }));

      return {
        ...state,
        bombs: state.bombs.filter(b => b.key !== action.payload.bombKey),
        grid: newGrid,
        enemies: newEnemies,
        items: [...state.items, ...newItems],
        explosions: [...state.explosions, ...newExplosions],
      };
    }

    case 'CLEAR_EXPLOSIONS':
      return { ...state, explosions: state.explosions.filter(exp => !action.payload.explosionKeys.includes(exp.key)) };

    case 'GAME_TICK': {
      if (state.gameState !== 'playing') return state;

      const newEnemies = state.enemies.map((enemy) => {
        if (enemy.status === 'hostile') {
          const { x, y } = enemy.pos;
          const moves = [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }];
          const validMoves = moves.filter(move => {
            const newX = x + move.x; const newY = y + move.y;
            return state.grid[newY]?.[newX] === TILE.EMPTY && !state.bombs.some(b => b.pos.x === newX && b.pos.y === newY);
          });
          if (validMoves.length > 0) {
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            return { ...enemy, pos: { x: x + randomMove.x, y: y + randomMove.y } };
          }
        }
        return enemy;
      });

      let nextState: GameStatus = { ...state, enemies: newEnemies };

      if (nextState.explosions.some(exp => exp.pos.x === nextState.playerPosition.x && exp.pos.y === nextState.playerPosition.y)) {
        return { ...nextState, gameState: 'lost', gameOverReason: "爆発に巻き込まれた！" };
      }
      if (nextState.enemies.some(e => e.status === 'hostile' && e.pos.x === nextState.playerPosition.x && e.pos.y === nextState.playerPosition.y)) {
        return { ...nextState, gameState: 'lost', gameOverReason: "王子様につかまった！" };
      }

      const hasHostileEnemies = nextState.enemies.some(e => e.status === 'hostile');
      if (!hasHostileEnemies && nextState.enemies.length > 0) {
        return { ...nextState, gameState: 'won' };
      }
      return nextState;
    }
    default:
      return state;
  }
};

const Game: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, getInitialState());
  const { grid, playerPosition, playerStats, bombs, explosions, enemies, items, gameState, gameOverReason } = state;

  const bombTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const gameLoopInterval = useRef<NodeJS.Timeout | null>(null);

  const resetGame = useCallback(() => {
    bombTimers.current.forEach(timer => clearTimeout(timer));
    bombTimers.current.clear();
    if (gameLoopInterval.current) clearInterval(gameLoopInterval.current);
    dispatch({ type: 'RESET_GAME' });
  }, []);
  
  // Keyboard Input Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameState !== 'playing') return;
      
      const keyMap: Record<string, GameAction> = {
        ArrowUp: { type: 'MOVE_PLAYER', payload: { dx: 0, dy: -1 } },
        ArrowDown: { type: 'MOVE_PLAYER', payload: { dx: 0, dy: 1 } },
        ArrowLeft: { type: 'MOVE_PLAYER', payload: { dx: -1, dy: 0 } },
        ArrowRight: { type: 'MOVE_PLAYER', payload: { dx: 1, dy: 0 } },
      };

      if (keyMap[e.key]) {
        e.preventDefault();
        dispatch(keyMap[e.key]);
      } else if (e.key === ' ') {
        e.preventDefault();
        if (bombs.length < playerStats.maxBombs && !bombs.some(b => b.pos.x === playerPosition.x && b.pos.y === playerPosition.y)) {
          const bombKey = Date.now();
          dispatch({ type: 'PLACE_BOMB', payload: { pos: { ...playerPosition }, key: bombKey } });
          const timer = setTimeout(() => {
             dispatch({ type: 'EXPLODE_BOMB', payload: { bombKey } });
             bombTimers.current.delete(bombKey);
          }, BOMB_TIMER);
          bombTimers.current.set(bombKey, timer);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bombs, playerPosition, playerStats.maxBombs, state.gameState]);

  // Main Game Loop
  useEffect(() => {
    gameLoopInterval.current = setInterval(() => {
      dispatch({ type: 'GAME_TICK' });
    }, ENEMY_MOVE_INTERVAL);
    return () => {
      if(gameLoopInterval.current) clearInterval(gameLoopInterval.current);
    };
  }, []);

  // Explosion Cleanup Effect
  useEffect(() => {
    if (explosions.length > 0) {
      const explosionKeys = explosions.map(e => e.key);
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_EXPLOSIONS', payload: { explosionKeys } });
      }, EXPLOSION_TIMER);
      return () => clearTimeout(timer);
    }
  }, [explosions]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 to-sky-200 p-4 font-sans select-none">
      <StatusBar stats={playerStats} />
      <div 
        className="relative bg-black/10 p-2 rounded-2xl shadow-2xl overflow-hidden mt-4" 
        style={{ width: GRID_WIDTH * TILE_SIZE, height: GRID_HEIGHT * TILE_SIZE }}
      >
        <div className="absolute inset-0 grid" style={{gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`, gridTemplateRows: `repeat(${GRID_HEIGHT}, 1fr)`}}>
          {Array.from({length: GRID_HEIGHT * GRID_WIDTH}).map((_, i) => {
            const x = i % GRID_WIDTH; const y = Math.floor(i / GRID_WIDTH);
            return <div key={i} className={(x + y) % 2 === 0 ? 'bg-lime-300/80' : 'bg-lime-400/80'} />;
          })}
        </div>

        {grid.map((row, y) => row.map((tile, x) => {
          const style = { left: x * TILE_SIZE, top: y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE };
          if (tile === TILE.INDESTRUCTIBLE) return <div key={`${x}-${y}`} className="absolute" style={style}><WallBlock /></div>;
          if (tile === TILE.DESTRUCTIBLE) return <div key={`${x}-${y}`} className="absolute" style={style}><PresentBox /></div>;
          return null;
        }))}
        
        {items.map(item => (
            <div key={item.key} className="absolute flex items-center justify-center" style={{ left: item.pos.x * TILE_SIZE, top: item.pos.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}>
                {item.type === 'bomb_up' ? <BombUpItem /> : <FireUpItem />}
            </div>
        ))}

        {explosions.map(({pos, key}) => (
          <div key={key} className="absolute pop-explosion" style={{ left: pos.x * TILE_SIZE, top: pos.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}/>
        ))}
        
        {bombs.map(({pos, key}) => (
          <div key={key} className="absolute flex items-center justify-center bomb-pulse" style={{ left: pos.x * TILE_SIZE, top: pos.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}>
            <HeartBomb />
          </div>
        ))}
        
        {enemies.map(enemy => (
          <div key={enemy.id} className="absolute flex items-center justify-center transition-all duration-300 ease-in-out" style={{ left: enemy.pos.x * TILE_SIZE, top: enemy.pos.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}>
            <EnemyCharacter status={enemy.status} />
          </div>
        ))}

        {gameState === 'playing' && (
          <div className="absolute flex items-center justify-center transition-all duration-100" style={{ left: playerPosition.x * TILE_SIZE, top: playerPosition.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}>
            <PlayerCharacter />
          </div>
        )}
        
        <UIOverlay gameState={gameState} gameOverReason={gameOverReason} onReset={resetGame} />
      </div>
      <div className="mt-6 p-4 bg-white/70 backdrop-blur-sm shadow-lg rounded-xl text-gray-800 text-lg max-w-2xl text-center">
        <span className="font-bold">移動:</span> 矢印キー | <span className="font-bold">爆弾:</span> スペースキー | <span className="font-bold">目的:</span> 全ての王子様を仲間にしよう！
      </div>
    </div>
  );
};

export default Game;