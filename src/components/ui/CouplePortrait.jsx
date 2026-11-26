import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { coupleTitle } from '../../utils/wedding.js';
import Blossom from './Blossom.jsx';

/**
 * A couple's own photo in an arched, gold-trimmed frame (like a shrine window).
 * Falls back to a blossom panel with initials when the photo is missing.
 */
export default function CouplePortrait({ couple, className = '', eager = false, float = true, delay = 0, caption = false }) {
  const [failed, setFailed] = useState(!couple.photo);
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      className={`relative ${className}`}
      animate={float && !reduceMotion ? { y: [0, -8, 0] } : undefined}
      transition={{ duration: 6, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-3xl border-[5px] border-ivory bg-sakura-100 shadow-gold">
        {failed ? (
          <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_50%_35%,#fffaf0,#ffe7c6_45%,#fbc3d2)]">
            <span className="font-script text-[clamp(1.6rem,6vw,3rem)] text-plum-600">
              {couple.groomName?.[0]}&amp;{couple.brideName?.[0]}
            </span>
          </div>
        ) : (
          <img
            src={couple.photo}
            alt={coupleTitle(couple)}
            className="h-full w-full object-cover"
            style={{ objectPosition: couple.photoPosition || 'center 30%' }}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setFailed(true)}
            draggable="false"
          />
        )}
        {/* soft inner glow + gold inner line */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_30px_rgba(255,236,200,0.55)]" />
        <div className="pointer-events-none absolute inset-2 rounded-t-[999px] rounded-b-2xl border border-gold-300/70" />
      </div>
      <Blossom size={34} className="absolute -top-1 -left-2 drop-shadow" rotate={12} />
      <Blossom size={26} className="absolute -right-2 bottom-6 drop-shadow" color="#f6d79a" center="#c99a3e" />
      {caption && (
        <figcaption className="mt-2 text-center font-script text-2xl text-plum-600">
          {couple.groomName} &amp; {couple.brideName}
        </figcaption>
      )}
    </motion.figure>
  );
}
