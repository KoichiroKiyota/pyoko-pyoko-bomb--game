import React from 'react';

export const PresentBox: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="presentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#ff8fab', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#fb6f92', stopOpacity: 1}} />
            </linearGradient>
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                <feOffset dx="3" dy="3"/>
                <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g style={{ filter: 'url(#dropShadow)' }}>
            <rect x="10" y="10" width="80" height="80" rx="10" ry="10" fill="url(#presentGradient)" />
            {/* Ribbon */}
            <rect x="40" y="10" width="20" height="80" fill="#FFFFFF" opacity="0.8" />
            <rect x="10" y="40" width="80" height="20" fill="#FFFFFF" opacity="0.8" />
            {/* Bow */}
            <path d="M 50 10 C 30 10, 35 30, 50 30 C 65 30, 70 10, 50 10 Z" fill="#FFFFFF" opacity="0.9"/>
             <circle cx="50" cy="28" r="8" fill="#FFFFFF" opacity="0.9"/>
        </g>
    </svg>
);
