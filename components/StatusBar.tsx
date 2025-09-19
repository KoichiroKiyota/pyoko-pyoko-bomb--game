import React from 'react';
import { PlayerStats } from '../types';
import { HeartBomb } from './assets/HeartBomb';
import { FireUpItem } from './assets/FireUpItem';

interface StatusBarProps {
  stats: PlayerStats;
}

export const StatusBar: React.FC<StatusBarProps> = ({ stats }) => {
  return (
    <div className="flex gap-6 items-center justify-center p-3 bg-white/70 backdrop-blur-sm shadow-lg rounded-full text-gray-800 text-2xl font-bold">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8">
            <HeartBomb />
        </div>
        <span>x {stats.maxBombs}</span>
      </div>
      <div className="w-px h-8 bg-gray-300" />
      <div className="flex items-center gap-2">
         <div className="w-8 h-8">
            <FireUpItem />
        </div>
        <span>x {stats.bombRange}</span>
      </div>
    </div>
  );
};