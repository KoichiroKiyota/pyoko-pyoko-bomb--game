import React from 'react';

export const BombUpItem: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(3px 3px 2px rgba(0,0,0,0.3))' }}>
        <g>
            <path d="M 50 90 C 10 55, 40 15, 50 35 C 60 15, 90 55, 50 90 Z" fill="#FF69B4" stroke="#fff" strokeWidth="5" />
            <text x="50" y="30" fontFamily="Verdana" fontSize="30" fill="white" textAnchor="middle" fontWeight="bold" stroke="black" strokeWidth="1">+</text>
        </g>
    </svg>
);