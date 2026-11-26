import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { formatShortDate, getMonograms } from '../utils/wedding.js';
import CoupleNames from './ui/CoupleNames.jsx';
import OmSeal from './ui/OmSeal.jsx';
import { BlossomGlyph } from './ui/Blossom.jsx';
import { C } from '../theme.js';

const E = C.envelope;

const EASE = [0.65, 0, 0.35, 1];

/**
 * A 3D paper envelope with a wax seal.
 * When `isOpening` turns true: seal breaks → flap swings open → letter slides out.
 * Total ≈ 2.1s.
 */
export default function InvitationEnvelope({ isOpening = false, onActivate, className = '' }) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const monograms = getMonograms();
  const speed = reduceMotion ? 0.25 : 1;

  return (
    <motion.div
      className={`relative aspect-[3/2] cursor-pointer select-none ${className}`}
      style={{ perspective: 1200 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onActivate}
      aria-hidden="true"
      animate={
        isOpening
          ? { y: 0, scale: reduceMotion ? 1 : [1, 1.04, 1.04, 1.1] }
          : reduceMotion
            ? undefined
            : { y: [0, -8, 0] }
      }
      transition={
        isOpening
          ? { duration: 2.2 * speed, times: [0, 0.2, 0.7, 1], ease: 'easeInOut' }
          : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      {/* soft glow */}
      <div className="absolute -inset-6 rounded-[40%] bg-[radial-gradient(closest-side,rgba(255,236,200,0.85),transparent)] blur-xl" />

      {/* back of the envelope + liner */}
      <div className="absolute inset-0 overflow-hidden rounded-lg shadow-dreamy" style={{ background: E.body }}>
        <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            <pattern id="liner" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
              <rect width="28" height="28" fill={E.liner} />
              <BlossomGlyph x={7} y={7} size={9} color={E.linerGlyphs[0][0]} center={E.linerGlyphs[0][1]} />
              <BlossomGlyph x={21} y={21} size={7} color={E.linerGlyphs[1][0]} center={E.linerGlyphs[1][1]} />
            </pattern>
          </defs>
          <path d="M8,6 L292,6 L150,112 Z" fill="url(#liner)" />
        </svg>
      </div>

      {/* the letter */}
      <motion.div
        className="absolute inset-x-[7%] top-[6%] bottom-[6%] z-[2] flex flex-col items-center justify-center rounded-md border border-marigold-400/70 bg-[linear-gradient(180deg,#fffdf5,#fff8e1)] px-3 text-center shadow-[0_10px_30px_-10px_rgba(122,61,95,0.35)]"
        initial={false}
        animate={isOpening ? { y: '-68%' } : { y: hovered ? '-4%' : '0%' }}
        transition={isOpening ? { delay: 1.0 * speed, duration: 1.0 * speed, ease: EASE } : { duration: 0.4 }}
      >
        <div className="absolute inset-1.5 rounded-sm border border-gold-300/60" />
        <OmSeal size={22} />
        <p className="mt-1.5 font-serif text-[0.6rem] tracking-[0.3em] text-sindoor-600 uppercase sm:text-xs">
          You are invited
        </p>
        <CoupleNames size="xxs" className="my-0.5" />
        <p className="font-serif text-[0.65rem] tracking-[0.2em] text-plum-500 sm:text-xs">{formatShortDate()}</p>
      </motion.div>

      {/* front pocket */}
      <svg
        viewBox="0 0 300 200"
        preserveAspectRatio="none"
        className="absolute inset-0 z-[3] h-full w-full drop-shadow-[0_-2px_4px_rgba(122,61,95,0.08)]"
      >
        <defs>
          <linearGradient id="pocket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={E.pocket[0]} />
            <stop offset="1" stopColor={E.pocket[1]} />
          </linearGradient>
          <linearGradient id="pocketSide" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={E.pocketSide[0]} />
            <stop offset=".5" stopColor={E.pocketSide[1]} />
            <stop offset="1" stopColor={E.pocketSide[0]} />
          </linearGradient>
          <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={E.line[0]} />
            <stop offset=".5" stopColor={E.line[1]} />
            <stop offset="1" stopColor={E.line[0]} />
          </linearGradient>
        </defs>
        <path d="M0,4 L150,108 L300,4 L300,196 Q300,200 296,200 L4,200 Q0,200 0,196 Z" fill="url(#pocketSide)" />
        <path d="M0,200 L150,100 L300,200 Z" fill="url(#pocket)" />
        <path d="M0,200 L150,100 L300,200" fill="none" stroke="url(#goldLine)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <path d="M0,4 L150,108 L300,4" fill="none" stroke={E.edge} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d="M24,182 C30,176 40,176 46,182 C40,188 30,188 24,182 Z" fill={E.leaves[0]} />
        <path d="M262,186 C268,180 278,180 284,186 C278,192 268,192 262,186 Z" fill={E.leaves[1]} />
        <BlossomGlyph x={36} y={176} size={16} color={E.decor[0][0]} center={E.decor[0][1]} />
        <BlossomGlyph x={52} y={186} size={10} color={E.decor[1][0]} center={E.decor[1][1]} />
        <BlossomGlyph x={266} y={178} size={14} color={E.decor[2][0]} center={E.decor[2][1]} />
      </svg>

      {/* top flap — swings open in 3D */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[58%]"
        style={{ transformOrigin: '50% 0%', transformStyle: 'preserve-3d' }}
        initial={false}
        animate={
          isOpening
            ? { rotateX: 180, zIndex: 1 }
            : { rotateX: hovered ? 18 : 0, zIndex: 4 }
        }
        transition={
          isOpening
            ? {
                rotateX: { delay: 0.35 * speed, duration: 0.8 * speed, ease: EASE },
                zIndex: { delay: 0.75 * speed, duration: 0 },
              }
            : { duration: 0.45, ease: 'easeOut' }
        }
      >
        <svg viewBox="0 0 300 116" preserveAspectRatio="none" className="h-full w-full drop-shadow-[0_4px_6px_rgba(122,61,95,0.18)]">
          <defs>
            <linearGradient id="flap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={E.flap[0]} />
              <stop offset="1" stopColor={E.flap[1]} />
            </linearGradient>
          </defs>
          <path d="M0,0 L300,0 L156,112 Q150,116 144,112 Z" fill="url(#flap)" />
          <path d="M0,0 L144,112 Q150,116 156,112 L300,0" fill="none" stroke="url(#goldLine)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
        </svg>
      </motion.div>

      {/* wax seal */}
      <motion.div
        className="absolute top-[58%] left-1/2 z-[5] -translate-x-1/2 -translate-y-1/2"
        initial={false}
        animate={isOpening ? { scale: [1, 1.18, 0], opacity: [1, 1, 0], rotate: [0, -8, 20] } : { scale: hovered ? 1.08 : 1 }}
        transition={isOpening ? { duration: 0.45 * speed, ease: 'easeIn' } : { type: 'spring', stiffness: 300, damping: 15 }}
      >
        <div className="relative grid h-14 w-14 place-items-center rounded-full shadow-[0_6px_14px_rgba(122,37,70,0.4),inset_0_-3px_6px_rgba(0,0,0,0.2)] sm:h-16 sm:w-16" style={{ background: E.seal }}>
          <div className="absolute inset-1.5 rounded-full border border-dashed" style={{ borderColor: E.sealRing }} />
          <span className="flex flex-col items-center font-script leading-[0.95]" style={{ color: E.sealText }}>
            {monograms.map((m) => (
              <span key={m} className={monograms.length > 1 ? 'text-sm sm:text-base' : 'text-xl sm:text-2xl'}>
                {m}
              </span>
            ))}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
