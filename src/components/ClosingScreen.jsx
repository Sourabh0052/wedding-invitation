import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Heart, MessageCircle, Share2 } from 'lucide-react';
import config from '../config/weddingConfig.js';
import { formatShortDate, formatWeddingDate, getShareUrl } from '../utils/wedding.js';
import CoupleVisual from './ui/CoupleVisual.jsx';
import CoupleNames from './ui/CoupleNames.jsx';
import OmSeal from './ui/OmSeal.jsx';
import Ornament from './ui/Ornament.jsx';
import PetalField from './ui/PetalField.jsx';
import Reveal from './ui/Reveal.jsx';
import TextReveal from './ui/TextReveal.jsx';
import Button from './ui/Button.jsx';
import Toran from './ui/Toran.jsx';
import FloralCorner from './ui/FloralCorner.jsx';
import { isPastel } from '../theme.js';

/** Screen 8 — farewell scene with sharing. */
export default function ClosingScreen() {
  const { closing, media, hashtag } = config;
  const [toast, setToast] = useState('');

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  const share = async () => {
    const url = getShareUrl();
    const data = { title: closing.shareTitle, text: closing.shareText, url };
    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(`${closing.shareText} ${url}`);
      flash('Invitation link copied!');
    } catch (err) {
      if (err?.name === 'AbortError') return; // guest closed the share sheet
      window.prompt('Copy this link to share the invitation:', url);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${closing.shareText} ${getShareUrl()}`)}`;

  return (
    <section id="closing" className="relative isolate flex min-h-dvh items-center overflow-hidden px-4 pt-28 pb-32 sm:px-6 sm:pt-32">
      <motion.img
        src={media.images.celebration || media.images.background}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 6, ease: 'easeOut' }}
      />
      <div
        className={`absolute inset-0 -z-10 bg-gradient-to-b ${
          isPastel ? 'from-ivory/90 via-blush/85 to-sakura-100/90' : 'from-marigold-50/75 via-marigold-50/45 to-[#4a0b0b]/80'
        }`}
      />
      <Toran className="absolute inset-x-0 top-0 h-[62px] sm:h-[92px]" />
      <PetalField count={16} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Reveal>
          <CoupleVisual artClassName="aspect-[1820/957] w-[min(88vw,480px)]" portraitClassName="w-[min(34vw,170px)]" />
        </Reveal>

        <Reveal delay={0.1} className="glass-card gold-frame relative -mt-6 w-full rounded-[2rem] px-6 pt-12 pb-10 sm:px-12">
          <FloralCorner corner="tr" className="-top-3 -right-3 w-24 sm:w-36" />
          <FloralCorner corner="bl" className="-bottom-3 -left-3 w-24 sm:w-36" />
          <OmSeal size={40} />
          {closing.blessingHindi && <p className="mt-3 font-deva text-xl text-sindoor-600">{closing.blessingHindi}</p>}
          <TextReveal
            text={closing.message}
            stagger={0.05}
            className="mx-auto mt-6 max-w-xl font-serif text-[clamp(1.5rem,4.5vw,2.25rem)] leading-snug text-plum-800 italic"
          />
          <Ornament className="my-6" />
          <p>
            <CoupleNames size="lg" />
          </p>
          <p className="mt-1 font-serif text-lg font-semibold tracking-[0.3em] text-marigold-700">{formatShortDate()}</p>
          <p className="mt-1 font-serif text-plum-600 italic">{formatWeddingDate()}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button icon={Share2} onClick={share}>
              Share Invitation
            </Button>
            <Button variant="ghost" icon={MessageCircle} href={whatsappUrl}>
              Send on WhatsApp
            </Button>
          </div>
          {hashtag && <p className="mt-6 font-sans text-sm font-semibold tracking-wider text-sindoor-600">{hashtag}</p>}
        </Reveal>

        <p className={`mt-10 flex items-center gap-1.5 font-sans text-xs tracking-wider ${isPastel ? 'text-plum-600' : 'text-ivory/90'}`}>
          Made with <Heart className="h-3.5 w-3.5 fill-sindoor-400 text-sindoor-400" aria-hidden="true" /> for our favourite people
        </p>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="fixed bottom-24 left-1/2 z-50 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-sindoor-700 px-5 py-3 text-sm font-semibold text-ivory shadow-dreamy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Check className="h-4 w-4 text-gold-300" aria-hidden="true" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
