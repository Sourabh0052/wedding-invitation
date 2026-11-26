import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import config from '../../config/weddingConfig.js';
import Blossom from './Blossom.jsx';
import { allCouplesTitle, getMonograms } from '../../utils/wedding.js';

/**
 * The couple illustration from weddingConfig.media.images.couple,
 * gently floating, with an elegant fallback if the image is missing.
 */
export default function CoupleArt({ className = '', eager = false, float = true }) {
  const [failed, setFailed] = useState(!config.media.images.couple);
  const reduceMotion = useReducedMotion();
  const title = allCouplesTitle('and');

  return (
    <motion.div
      className={`relative ${className}`}
      animate={float && !reduceMotion ? { y: [0, -10, 0] } : undefined}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {failed ? (
        <div
          className="grid aspect-[600/760] h-full place-items-center rounded-full bg-[radial-gradient(circle,#fffaf0_0%,#ffe7c6_45%,#fbc3d2_80%,transparent_100%)]"
          role="img"
          aria-label={title}
        >
          <div className="flex items-center gap-2 font-script text-5xl text-plum-600">
            <Blossom size={28} /> {getMonograms().join(' · ')} <Blossom size={28} />
          </div>
        </div>
      ) : (
        <img
          src={config.media.images.couple}
          alt={`Illustration of ${title}`}
          className="h-full w-full object-contain drop-shadow-[0_20px_40px_rgba(122,61,95,0.25)]"
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : 'auto'}
          onError={() => setFailed(true)}
          draggable="false"
        />
      )}
    </motion.div>
  );
}
