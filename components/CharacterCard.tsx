import React from 'react';
import type { Character } from '../types';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <div className={`p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:-translate-y-3 ${character.bgColor}`}>
      <div className="w-full h-56 mb-5 rounded-xl overflow-hidden shadow-inner">
        <img src={character.image} alt={character.name} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-3xl font-bold text-center mb-3 text-gray-800">
        {character.emoji} {character.name}
      </h3>
      <p className="text-center bg-white/70 p-3 rounded-lg text-gray-700">{character.description}</p>
    </div>
  );
};

export default CharacterCard;