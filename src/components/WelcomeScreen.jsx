import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MailOpen } from 'lucide-react';
import config from '../config/weddingConfig.js';
import { formatShortDate, getGuestName } from '../utils/wedding.js';
import { useMusic } from '../context/MusicContext.jsx';
import InvitationEnvelope from './InvitationEnvelope.jsx';
import PetalField from './ui/PetalField.jsx';
import CoupleVisual from './ui/CoupleVisual.jsx';
import CoupleNames from './ui/CoupleNames.jsx';
import OmSeal from './ui/OmSeal.jsx';
import GaneshInvocation from './ui/GaneshInvocation.jsx';
import TextReveal from './ui/TextReveal.jsx';
import Toran from './ui/Toran.jsx';
import FloralCorner from './ui/FloralCorner.jsx';

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] },
});

/** Screen 1 — landing scene with the sealed envelope. */
export default function WelcomeScreen({ onOpen }) {
  const { welcome, media } = config;
  const { start } = useMusic();
  const reduceMotion = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const timer = useRef();
  const guest = useMemo(getGuestName, []);

  // Warm up the next screens while the guest admires the envelope.
  useEffect(() => {
    const t = setTimeout(() => import('./InvitationPage.jsx'), 1200);
    return () => {
      clearTimeout(t);
      clearTimeout(timer.current);
    };
  }, []);

  const handleOpen = () => {
    if (opening) return;
    start(); // this tap is the user gesture that unlocks audio on mobile
    setOpening(true);
    timer.current = setTimeout(onOpen, reduceMotion ? 500 : 2500);
  };

  const hideOnOpen = { animate: opening ? { opacity: 0, y: -10 } : undefined, transition: { duration: 0.5 } };

  return (
    <motion.section
      className="relative min-h-dvh overflow-hidden"
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      aria-label="Welcome"
    >
      {/* mandir-on-the-lake scene, slowly settling (Ken Burns) */}
      <motion.img
        src={media.images.background}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.15 }}
        animate={{ scale: opening ? 1.3 : 1 }}
        transition={{ duration: opening ? 2.6 : 9, ease: 'easeOut' }}
        fetchPriority="high"
        draggable="false"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,251,234,0.55)_0%,rgba(255,243,196,0.22)_45%,rgba(255,236,240,0.6)_100%)]" />
      {/* festive colour glows: marigold, red, leaf green */}
      <div className="absolute -top-10 -left-24 h-80 w-80 rounded-full bg-marigold-300/45 blur-3xl" />
      <div className="absolute top-1/3 -right-28 h-80 w-80 rounded-full bg-sindoor-300/25 blur-3xl" />
      <div className="absolute -bottom-16 left-1/4 h-72 w-96 rounded-full bg-leaf-300/40 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-marigold-50/80 to-transparent" />

      <PetalField count={26} />
      <Toran className="absolute inset-x-0 top-0 z-20 h-[54px] sm:h-[92px]" />
      <FloralCorner corner="bl" className="w-28 opacity-90 sm:w-52" />
      <FloralCorner corner="br" className="w-28 opacity-90 sm:w-52" />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center gap-[clamp(0.6rem,2dvh,1.5rem)] px-5 pt-[3.6rem] pb-6 sm:pt-24 md:flex-row md:gap-8 md:pt-24 md:pb-12">
        {/* desktop: couple on the left */}
        <motion.div {...fadeUp(0.3)} className="hidden md:block">
          <motion.div {...hideOnOpen}>
            <CoupleVisual eager artClassName="aspect-[1820/957] w-[min(46vw,640px)]" portraitClassName="w-[min(19vw,250px)]" />
          </motion.div>
        </motion.div>

        <div className="flex w-full max-w-md flex-col items-center text-center md:max-w-xl">
          <motion.div {...fadeUp(0.1)}>
            <motion.div {...hideOnOpen} className="flex flex-col items-center gap-2">
              {config.invocation?.enabled ? <GaneshInvocation size="compact" eager /> : <OmSeal size={40} />}
              <p className="font-serif text-xs font-semibold tracking-[0.45em] text-sindoor-600 uppercase sm:text-sm">{welcome.eyebrow}</p>
            </motion.div>
          </motion.div>

          <motion.h1 {...fadeUp(0.35)} className="mt-1 px-1 pb-1 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
            <motion.span {...hideOnOpen} className="inline-block">
              <CoupleNames size="hero" />
            </motion.span>
          </motion.h1>

          {/* mobile: couple above the envelope */}
          <motion.div {...fadeUp(0.5)} className="md:hidden">
            <motion.div {...hideOnOpen}>
              <CoupleVisual eager artClassName="aspect-[1820/957] h-[clamp(100px,16dvh,190px)]" portraitClassName="w-[clamp(78px,24vw,120px)]" />
            </motion.div>
          </motion.div>

          <motion.div
            className="relative z-20 mt-[clamp(0.5rem,2dvh,1.5rem)] w-[min(74vw,310px,42dvh)]"
            initial={{ opacity: 0, y: 40, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <InvitationEnvelope isOpening={opening} onActivate={handleOpen} />
          </motion.div>

          <motion.div {...hideOnOpen} className="mt-[clamp(0.75rem,3dvh,2rem)] flex flex-col items-center">
            {guest && (
              <motion.p {...fadeUp(0.9)} className="font-script text-3xl text-plum-600">
                Dear {guest},
              </motion.p>
            )}
            <TextReveal
              trigger="mount"
              delay={1.1}
              text={welcome.message}
              className="max-w-sm font-serif text-[clamp(1.05rem,2.2vw,1.3rem)] leading-snug text-plum-700 italic"
            />
            <motion.p {...fadeUp(1.6)} className="mt-2 font-serif text-sm font-semibold tracking-[0.3em] text-marigold-700">
              {formatShortDate()}
            </motion.p>

            <motion.button
              type="button"
              onClick={handleOpen}
              disabled={opening}
              {...fadeUp(1.8)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative mt-[clamp(0.75rem,2.5dvh,1.75rem)] inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-sindoor-600 via-sindoor-500 to-marigold-600 px-8 py-3.5 font-sans text-base font-semibold tracking-wide text-white shadow-[0_18px_40px_-14px_rgba(192,24,24,0.65)] [text-shadow:0_1px_2px_rgb(0_0_0/0.25)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              {!reduceMotion && (
                <motion.span
                  className="absolute inset-0 rounded-full ring-2 ring-marigold-400"
                  animate={{ scale: [1, 1.18], opacity: [0.7, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <MailOpen className="relative h-5 w-5" aria-hidden="true" />
              <span className="relative">{welcome.buttonText}</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* white bloom as the envelope opens */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 bg-ivory"
        initial={{ opacity: 0 }}
        animate={{ opacity: opening ? [0, 0, 1] : 0 }}
        transition={{ duration: reduceMotion ? 0.5 : 2.5, times: [0, 0.72, 1] }}
      />
    </motion.section>
  );
}
