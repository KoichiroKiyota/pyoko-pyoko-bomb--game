import React from 'react';
import { GameState } from '../types';

interface UIOverlayProps {
  gameState: GameState;
  gameOverReason: string | null;
  onReset: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ gameState, gameOverReason, onReset }) => {
  if (gameState === 'playing') {
    return null;
  }

  const isWin = gameState === 'won';
  const title = isWin ? "CLEAR!" : "GAME OVER";

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl">
      <h2 className={`text-8xl font-extrabold mb-4 text-white ${isWin ? 'bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300' : ''}`} style={{ textShadow: '4px 4px 8px rgba(0,0,0,0.5)' }}>
        {title}
      </h2>
      {!isWin && gameOverReason && <p className="text-2xl text-white mb-8 font-bold">{gameOverReason}</p>}
      <div className="flex gap-4">
        <button onClick={onReset} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold text-xl rounded-full hover:from-blue-600 hover:to-cyan-500 transition-all shadow-lg transform hover:scale-105 active:scale-100">
          もう一度プレイ
        </button>
      </div>
    </div>
  );
};
