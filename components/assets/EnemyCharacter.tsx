import React from 'react';

interface EnemyCharacterProps {
  status: 'hostile' | 'follower';
}

export const EnemyCharacter: React.FC<EnemyCharacterProps> = ({ status }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(3px 3px 2px rgba(0,0,0,0.3))' }}>
    {/* Crown */}
    <path d="M 30 30 L 70 30 L 80 45 L 50 35 L 20 45 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
    <circle cx="35" cy="28" r="4" fill="#FF4500" />
    <circle cx="50" cy="25" r="4" fill="#32CD32" />
    <circle cx="65" cy="28" r="4" fill="#4169E1" />

    {/* Head */}
    <circle cx="50" cy="55" r="22" fill="#F0E68C" />
    
    {/* Hair */}
    <path d="M 30 40 Q 50 25, 70 40 L 65 60 Q 50 65, 35 60 Z" fill="#A0522D" />

    {/* Eyes */}
    <circle cx="43" cy="55" r="3" fill="black" />
    <circle cx="57" cy="55" r="3" fill="black" />

    {/* Mouth */}
    <path d="M 48 65 Q 50 62, 52 65" stroke="black" strokeWidth="1.5" fill="none" />

    {/* Body */}
    <path d="M 35 75 Q 50 95, 65 75 Z" fill="#4682B4" />
    
    {/* Follower Heart */}
    {status === 'follower' && (
       <path 
        d="M50 5 Q 60 0, 70 10 C 80 20, 60 30, 50 20 Q 40 30, 30 10 C 40 0, 50 5, 50 5 Z" 
        fill="#FF69B4"
        stroke="white"
        strokeWidth="1.5"
       />
    )}
  </svg>
);
