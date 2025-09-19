import React from 'react';

export const PlayerCharacter: React.FC = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(3px 3px 2px rgba(0,0,0,0.3))' }}>
    {/* Head */}
    <circle cx="50" cy="55" r="25" fill="#FFDAB9" />
    
    {/* Ears */}
    <path d="M 35 35 C 25 10, 40 10, 40 30 Z" fill="#2c2c2c" />
    <path d="M 32 32 C 30 20, 38 20, 38 30 Z" fill="#FFC0CB" />
    <path d="M 65 35 C 75 10, 60 10, 60 30 Z" fill="#2c2c2c" />
    <path d="M 68 32 C 70 20, 62 20, 62 30 Z" fill="#FFC0CB" />

    {/* Eyes */}
    <circle cx="42" cy="55" r="3" fill="#2c2c2c" />
    <circle cx="58" cy="55" r="3" fill="#2c2c2c" />

    {/* Blush */}
    <circle cx="38" cy="62" r="4" fill="#FF69B4" opacity="0.6"/>
    <circle cx="62" cy="62" r="4" fill="#FF69B4" opacity="0.6"/>

    {/* Mouth */}
    <path d="M 48 65 Q 50 68, 52 65" stroke="#2c2c2c" strokeWidth="1.5" fill="none" />
    
    {/* Body */}
    <path d="M 35 75 Q 50 95, 65 75 Z" fill="#2c2c2c" />
    <path d="M 45 78 L 55 78 L 55 85 L 45 85 Z" fill="white" />
    <circle cx="50" cy="78" r="4" fill="white" />

    {/* Bowtie */}
    <path d="M 45 75 L 55 75 L 50 80 Z" fill="white" />
  </svg>
);
