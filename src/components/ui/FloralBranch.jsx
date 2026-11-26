import { motion, useReducedMotion } from 'framer-motion';
import { BlossomGlyph } from './Blossom.jsx';
import { C, isPastel } from '../../theme.js';

const [b0, b1, b2, b3, b4] = C.blossoms;
const [l0, l1] = C.leaves;
// marigold (genda) tones mixed with the palette's accent flowers
const GENDA = isPastel ? ['#f8c27a', '#e0943e'] : ['#ffb020', '#d9650b'];
// [x, y, size, petal colour, centre colour]
const FLOWERS = [
  [232, 34, 30, ...GENDA], [196, 48, 24, ...b0], [160, 22, 26, ...GENDA], [138, 62, 22, ...b1],
  [96, 82, 26, ...b2], [62, 98, 20, ...GENDA], [212, 8, 16, ...b3], [178, 76, 16, ...GENDA],
  [118, 34, 18, ...b4], [28, 112, 20, ...GENDA],
];
// [x, y, rotation, colour] — mango leaves
const LEAVES = [
  [214, 52, 40, l0], [176, 40, -30, l1], [150, 82, 70, l0], [120, 62, 120, l1],
  [78, 104, 60, l0], [44, 92, -20, l1], [186, 12, -60, l0], [250, 52, 20, l1],
];
const BARK = isPastel ? '#a98579' : '#7a4a58';

/** Decorative branch of marigolds and mango leaves that sways gently. Anchor it to a corner. */
export default function FloralBranch({ className = '', flip = false, delay = 0, width = 260 }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{ width }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: 'easeOut' }}
    >
      <div style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
        <motion.svg
          viewBox="0 0 260 140"
          className="h-auto w-full overflow-visible"
          style={{ transformOrigin: '0% 100%' }}
          animate={reduceMotion ? undefined : { rotate: [0, 2.2, -1.2, 0] }}
          transition={{ duration: 7, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M-10,135 C60,112 120,70 250,40" stroke={BARK} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M110,88 C130,66 148,46 168,20" stroke={BARK} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M60,108 C66,90 80,80 96,80" stroke={BARK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {LEAVES.map(([x, y, r, c], i) => (
            <path key={`leaf${i}`} d="M0,0 C7,-6 22,-6 30,0 C22,5 7,5 0,0 Z" fill={c} transform={`translate(${x},${y}) rotate(${r})`} />
          ))}
          {FLOWERS.map(([x, y, s, c, center], i) => (
            <BlossomGlyph key={i} x={x} y={y} size={s} color={c} center={center} rotate={i * 23} />
          ))}
        </motion.svg>
      </div>
    </motion.div>
  );
}
