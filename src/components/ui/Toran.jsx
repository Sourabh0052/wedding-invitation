import { memo, useId } from 'react';
import { C } from '../../theme.js';

const T = C.toran;

const UNIT = 120; // one repeat of the garland, in SVG units
const UNITS = 20;
const WIDTH = UNIT * UNITS;

/**
 * Festive marigold toran (door garland): a red-and-gold rope with marigolds,
 * mango leaves and hanging flower strings ending in red buds and gold bells.
 * Spans the full width of its parent; the strings sway gently.
 */
function Toran({ className = '', flip = false }) {
  const uid = useId().replace(/:/g, '');
  const id = (name) => `${uid}-${name}`;

  const units = Array.from({ length: UNITS + 1 }, (_, i) => i * UNIT);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden ${className}`}
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <svg
        viewBox={`0 0 ${WIDTH} 112`}
        preserveAspectRatio="xMidYMin slice"
        className="block h-full w-full"
        focusable="false"
      >
        <defs>
          <linearGradient id={id('leafA')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={T.leafA[0]} />
            <stop offset="1" stopColor={T.leafA[1]} />
          </linearGradient>
          <linearGradient id={id('leafB')} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={T.leafB[0]} />
            <stop offset="1" stopColor={T.leafB[1]} />
          </linearGradient>
          <linearGradient id={id('rope')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={T.rope[0]} />
            <stop offset="1" stopColor={T.rope[1]} />
          </linearGradient>

          {/* marigold: ruffled outer ring, inner bloom, deep centre */}
          <symbol id={id('mgY')} viewBox="-12 -12 24 24" overflow="visible">
            <circle r="8.2" fill={T.flower1[0]} stroke={T.flower1[1]} strokeWidth="4.4" strokeDasharray="2.1 1.3" />
            <circle r="5.6" fill={T.flower1[2]} stroke={T.flower1[3]} strokeWidth="1.6" strokeDasharray="1.4 1" />
            <circle r="2.2" fill={T.flower1[4]} />
          </symbol>
          <symbol id={id('mgO')} viewBox="-12 -12 24 24" overflow="visible">
            <circle r="8.2" fill={T.flower2[0]} stroke={T.flower2[1]} strokeWidth="4.4" strokeDasharray="2.1 1.3" />
            <circle r="5.6" fill={T.flower2[2]} stroke={T.flower2[3]} strokeWidth="1.6" strokeDasharray="1.4 1" />
            <circle r="2.2" fill={T.flower2[4]} />
          </symbol>
          <symbol id={id('bud')} viewBox="-8 -8 16 16" overflow="visible">
            <circle r="5.5" fill={T.bud[0]} stroke={T.bud[1]} strokeWidth="2.4" strokeDasharray="1.6 1.1" />
            <circle r="2.4" fill={T.bud[2]} />
          </symbol>
          <symbol id={id('leaf')} viewBox="-10 0 20 48" overflow="visible">
            <path d="M0,0 C10,11 10,31 0,46 C-10,31 -10,11 0,0 Z" />
            <path d="M0,3 L0,42" stroke="#f1fbe9" strokeOpacity=".7" strokeWidth="1.2" fill="none" />
          </symbol>
        </defs>

        {/* mango leaves hang behind the rope */}
        {units.map((x, i) => (
          <g key={`l${x}`}>
            <use href={`#${id('leaf')}`} x={x + 22} y={8} width="20" height="48" fill={`url(#${id('leafA')})`} transform={`rotate(10 ${x + 32} 10)`} />
            <use href={`#${id('leaf')}`} x={x + 80} y={8} width="20" height="48" fill={`url(#${id(i % 2 ? 'leafA' : 'leafB')})`} transform={`rotate(-10 ${x + 90} 10)`} />
          </g>
        ))}

        {/* hanging flower strings (ladi) */}
        {units.map((x, i) => {
          const long = i % 2 === 0;
          const beads = long ? [30, 46, 62, 78] : [30, 46, 62];
          const end = beads[beads.length - 1] + 16;
          return (
            <g key={`s${x}`} className="toran-sway" style={{ animationDelay: `${(i % 5) * -0.7}s` }}>
              <line x1={x + 60} y1={14} x2={x + 60} y2={end + 14} stroke={T.string} strokeWidth="1" />
              {beads.map((y, j) => (
                <use key={y} href={`#${id((i + j) % 2 ? 'mgO' : 'mgY')}`} x={x + 50} y={y - 10} width="20" height="20" />
              ))}
              <use href={`#${id('bud')}`} x={x + 53} y={end - 7} width="14" height="14" />
              {/* little gold bell */}
              <path d={`M${x + 56},${end + 8} q4,-9 8,0 z`} fill={T.bell[0]} stroke={T.bell[1]} strokeWidth=".6" />
              <circle cx={x + 60} cy={end + 9.5} r="1.4" fill={T.bell[1]} />
            </g>
          );
        })}

        {/* rope: red with a gold twist */}
        <rect x="0" y="4" width={WIDTH} height="9" rx="4.5" fill={`url(#${id('rope')})`} />
        <rect x="0" y="7.5" width={WIDTH} height="2" fill="none" stroke={T.twist} strokeWidth="1.6" strokeDasharray="5 4" />

        {/* marigolds strung along the rope */}
        {units.map((x, i) => (
          <g key={`m${x}`}>
            <use href={`#${id(i % 2 ? 'mgO' : 'mgY')}`} x={x - 12} y={-3} width="24" height="24" />
            <use href={`#${id(i % 2 ? 'mgY' : 'mgO')}`} x={x + 48} y={-3} width="24" height="24" />
          </g>
        ))}
      </svg>
    </div>
  );
}

export default memo(Toran);
