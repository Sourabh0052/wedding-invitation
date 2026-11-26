import { useId } from 'react';
import { C } from '../../theme.js';

/** Small filled heart with a champagne-gold outline, sized in `em` so it scales with the names. */
export default function HeartMark({ className = '', light = false }) {
  const id = `h${useId().replace(/:/g, '')}`;
  return (
    <svg viewBox="0 0 24 22" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light ? '#ffffff' : C.heart[0]} />
          <stop offset="1" stopColor={light ? '#fde2e8' : C.heart[1]} />
        </linearGradient>
      </defs>
      <path
        d="M12 20.5 C5 15.5 1.5 11.6 1.5 7.4 C1.5 4.1 4 1.5 7.2 1.5 C9.2 1.5 11 2.6 12 4.3 C13 2.6 14.8 1.5 16.8 1.5 C20 1.5 22.5 4.1 22.5 7.4 C22.5 11.6 19 15.5 12 20.5 Z"
        fill={`url(#${id})`}
        stroke={C.heartStroke}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M6.2 5.2 C5 5.6 4.3 6.6 4.3 7.8" stroke="#fff" strokeOpacity=".7" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
