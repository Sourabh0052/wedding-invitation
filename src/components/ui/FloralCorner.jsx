import { memo } from 'react';
import { C } from '../../theme.js';
import { BlossomGlyph } from './Blossom.jsx';

/** A small layered rose for drawing inside an SVG. `tone` = [outer, middle, swirl]. */
export function RoseGlyph({ x = 0, y = 0, size = 24, tone = C.roses[0], rotate = 0 }) {
  const [outer, middle, swirl] = tone;
  return (
    <g transform={`translate(${x},${y}) scale(${size / 24}) rotate(${rotate})`}>
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="0" cy="-5.2" rx="6.4" ry="7" fill={outer} transform={`rotate(${r})`} />
      ))}
      <circle r="7.6" fill={middle} />
      <path
        d="M-4.2,1 C-4.4,-4.2 4.4,-5.2 4.8,0 C5.2,4.4 -1.2,5.8 -2.8,2.2 C-3.8,-1 1.6,-2.6 2.1,0.6"
        fill="none"
        stroke={swirl}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path d="M-5.6,-3.4 C-4.6,-6 -2,-7.2 0.4,-7" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="1" strokeLinecap="round" />
    </g>
  );
}

const Leaf = ({ x, y, r, s = 1, fill }) => (
  <path d="M0,0 C5,-5 14,-5 19,0 C14,5 5,5 0,0 Z" fill={fill} transform={`translate(${x},${y}) rotate(${r}) scale(${s})`} />
);

const TRANSFORMS = { tl: undefined, tr: 'scaleX(-1)', bl: 'scaleY(-1)', br: 'scale(-1, -1)' };
const POSITIONS = { tl: 'top-0 left-0', tr: 'top-0 right-0', bl: 'bottom-0 left-0', br: 'bottom-0 right-0' };

/**
 * Delicate corner spray — blush, ivory & peach roses on a champagne vine with small leaves,
 * blossoms and pearl buds. Drawn for the top-left corner; `corner` mirrors it to the others.
 * Position it with `className` (it is absolutely positioned and ignores pointer events).
 */
function FloralCorner({ corner = 'tl', className = '' }) {
  const [blush, ivory, peach] = C.roses;
  const [leafDark, leafLight] = C.leaves;
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute z-[1] ${POSITIONS[corner] ?? ''} ${className}`}>
      <svg viewBox="0 0 200 200" className="block h-auto w-full overflow-visible" style={{ transform: TRANSFORMS[corner] }} focusable="false">
        {/* vines along both edges */}
        <path d="M4,22 C40,12 70,30 110,14 C135,4 160,10 192,2" fill="none" stroke={C.vine} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M22,4 C12,40 30,70 14,110 C4,135 10,160 2,192" fill="none" stroke={C.vine} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M60,22 C70,36 84,40 98,36" fill="none" stroke={C.vine} strokeWidth="1.1" strokeLinecap="round" />
        <path d="M22,60 C36,70 40,84 36,98" fill="none" stroke={C.vine} strokeWidth="1.1" strokeLinecap="round" />

        {/* leaves */}
        <Leaf x={74} y={24} r={-30} fill={leafDark} />
        <Leaf x={96} y={18} r={20} s={0.85} fill={leafLight} />
        <Leaf x={126} y={10} r={-20} s={0.8} fill={leafDark} />
        <Leaf x={150} y={8} r={15} s={0.7} fill={leafLight} />
        <Leaf x={24} y={74} r={120} fill={leafDark} />
        <Leaf x={18} y={96} r={70} s={0.85} fill={leafLight} />
        <Leaf x={10} y={126} r={110} s={0.8} fill={leafDark} />
        <Leaf x={8} y={150} r={75} s={0.7} fill={leafLight} />
        <Leaf x={44} y={52} r={45} s={1.1} fill={leafLight} />
        <Leaf x={52} y={44} r={-5} s={0.9} fill={leafDark} />

        {/* the rose cluster in the corner */}
        <RoseGlyph x={62} y={20} size={24} tone={ivory} rotate={20} />
        <RoseGlyph x={20} y={62} size={24} tone={peach} rotate={-15} />
        <RoseGlyph x={30} y={30} size={40} tone={blush} rotate={10} />
        <RoseGlyph x={100} y={36} size={14} tone={blush} rotate={40} />
        <RoseGlyph x={36} y={100} size={14} tone={ivory} rotate={-30} />

        {/* small blossoms & pearl buds along the vines */}
        <BlossomGlyph x={140} y={14} size={13} color={C.blossoms[0][0]} center={C.blossoms[0][1]} rotate={12} />
        <BlossomGlyph x={14} y={140} size={13} color={C.blossoms[1][0]} center={C.blossoms[1][1]} rotate={-8} />
        <BlossomGlyph x={84} y={6} size={9} color={C.blossoms[4][0]} center={C.blossoms[4][1]} />
        <BlossomGlyph x={6} y={84} size={9} color={C.blossoms[3][0]} center={C.blossoms[3][1]} />
        {[
          [172, 6, 3],
          [186, 3, 2.2],
          [6, 172, 3],
          [3, 186, 2.2],
          [116, 24, 2],
          [24, 116, 2],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={ivory[1]} stroke={C.vine} strokeWidth=".6" />
        ))}
      </svg>
    </div>
  );
}

export default memo(FloralCorner);
