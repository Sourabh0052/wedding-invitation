import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Music, Volume1, Volume2, VolumeX } from 'lucide-react';
import { useMusic } from '../context/MusicContext.jsx';

function Equalizer({ active }) {
  const reduceMotion = useReducedMotion();
  return (
    <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
      {[0.9, 0.5, 1, 0.65].map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-white"
          style={{ height: '100%', originY: 1 }}
          animate={active && !reduceMotion ? { scaleY: [h * 0.3, h, h * 0.45, h * 0.85, h * 0.3] } : { scaleY: 0.25 }}
          transition={active ? { duration: 1.1 + i * 0.15, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
        />
      ))}
    </span>
  );
}

/** Floating music control: play / pause + volume. Music itself lives in MusicContext. */
export default function BackgroundMusic() {
  const { available, isPlaying, toggle, volume, setVolume, volumeSupported } = useMusic();
  const [open, setOpen] = useState(false);

  if (!available) return null;

  const VolIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <motion.div
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex items-center gap-1 rounded-full border border-white/50 bg-gradient-to-r from-sindoor-500/90 to-marigold-600/90 p-1.5 shadow-dreamy backdrop-blur-md sm:right-6 sm:bottom-6"
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <AnimatePresence initial={false}>
        {open && volumeSupported && (
          <motion.div
            className="flex items-center overflow-hidden"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 112, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Music volume"
              className="range-sakura mx-3 w-[88px]"
              style={{ '--fill': `${volume * 100}%` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {volumeSupported && (
        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          whileTap={{ scale: 0.9 }}
          className="hidden h-10 w-10 place-items-center rounded-full text-white hover:bg-white/15 sm:grid"
          aria-label={open ? 'Hide volume' : 'Show volume'}
          aria-expanded={open}
        >
          <VolIcon className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      )}

      <motion.button
        type="button"
        onClick={toggle}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        className="relative grid h-11 w-11 place-items-center rounded-full bg-white/20 text-white"
        aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
        aria-pressed={isPlaying}
      >
        {isPlaying ? <Equalizer active /> : <Music className="h-5 w-5" aria-hidden="true" />}
      </motion.button>
    </motion.div>
  );
}
