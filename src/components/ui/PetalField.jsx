import { memo, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Petal from './Petal.jsx';
import useMediaQuery from '../../hooks/useMediaQuery.js';
import { C } from '../../theme.js';

// Petal colours & shapes come from the palette (pastel petals, or marigolds, roses & leaves).
const KINDS = C.petals;
const rand = (min, max) => min + Math.random() * (max - min);

/**
 * Drifting petals, marigolds and leaves. Only transforms are animated (GPU friendly),
 * the count drops on phones, and it switches off for reduced-motion users.
 */
function PetalField({ count = 18, className = 'pointer-events-none fixed inset-0 z-[1] overflow-hidden' }) {
  const reduceMotion = useReducedMotion();
  const isPhone = useMediaQuery('(max-width: 640px)');
  const total = reduceMotion ? 0 : isPhone ? Math.ceil(count * 0.55) : count;

  const petals = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => {
        const duration = rand(11, 20);
        return {
          id: i,
          left: rand(-5, 100),
          size: rand(10, 22),
          ...KINDS[i % KINDS.length],
          duration,
          delay: rand(0, duration * 0.8),
          drift: rand(30, 110) * (Math.random() > 0.5 ? 1 : -1),
          spin: rand(240, 720) * (Math.random() > 0.5 ? 1 : -1),
          tilt: rand(40, 75),
          opacity: rand(0.55, 0.95),
        };
      }),
    [total],
  );

  if (!total) return null;

  return (
    <div className={className} aria-hidden="true">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 will-change-transform"
          style={{ left: `${p.left}%`, opacity: p.opacity }}
          initial={{ y: '-8vh', x: 0, rotate: 0 }}
          animate={{
            y: ['-8vh', '108vh'],
            x: [0, p.drift, -p.drift * 0.4, p.drift * 0.7],
            rotate: [0, p.spin],
            rotateX: [0, p.tilt, 0, -p.tilt, 0],
          }}
          transition={{
            y: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' },
            x: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' },
            rotateX: { duration: p.duration / 2, delay: p.delay, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <Petal size={p.size} color={p.color} shape={p.shape} />
        </motion.div>
      ))}
    </div>
  );
}

export default memo(PetalField);
