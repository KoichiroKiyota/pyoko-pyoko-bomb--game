import React from 'react';

export const WallBlock: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
         <defs>
            <linearGradient id="wallGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#a78bfa', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#6d28d9', stopOpacity: 1}} />
            </linearGradient>
            <filter id="innerGlow">
              <feMorphology operator="dilate" radius="2" in="SourceAlpha" result="thicken" />
              <feGaussianBlur in="thicken" stdDeviation="4" result="blurred" />
              <feFlood floodColor="#d8b4fe" />
              <feComposite in2="blurred" operator="in" />
              <feComposite in="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
        </defs>
        <rect x="5" y="5" width="90" height="90" rx="15" ry="15" fill="url(#wallGradient)" stroke="#4c1d95" strokeWidth="4" />
        <path d="M 15 25 L 85 25 M 15 50 L 85 50 M 15 75 L 85 75" stroke="#4c1d95" strokeWidth="4" />
        <path d="M 25 15 L 25 85 M 50 15 L 50 85 M 75 15 L 75 85" stroke="#4c1d95" strokeWidth="4" />
        <rect x="5" y="5" width="90" height="90" rx="15" ry="15" fill="transparent" style={{ filter: 'url(#innerGlow)' }}/>
    </svg>
);
