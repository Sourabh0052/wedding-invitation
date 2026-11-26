import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarHeart, ChevronDown, Clapperboard, Clock, MapPin } from 'lucide-react';
import config from '../config/weddingConfig.js';
import {
  brideFirst,
  couples,
  coupleJoiner,
  formatWeddingDate,
  formatWeddingTime,
  getGuestName,
  hasCouplePhotos,
} from '../utils/wedding.js';
import CoupleArt from './ui/CoupleArt.jsx';
import CouplePortrait from './ui/CouplePortrait.jsx';
import GaneshInvocation from './ui/GaneshInvocation.jsx';
import Ornament from './ui/Ornament.jsx';
import Reveal from './ui/Reveal.jsx';
import FloralBranch from './ui/FloralBranch.jsx';
import TextReveal from './ui/TextReveal.jsx';
import Blossom from './ui/Blossom.jsx';
import Toran from './ui/Toran.jsx';
import HeartMark from './ui/HeartMark.jsx';
import FloralCorner from './ui/FloralCorner.jsx';
import { C } from '../theme.js';

// Each fact card gets its own festive colour.
const FACT_STYLES = [
  { card: 'border-sindoor-200 bg-gradient-to-b from-sindoor-50 to-ivory', icon: 'text-sindoor-500', label: 'text-sindoor-600' },
  { card: 'border-marigold-300 bg-gradient-to-b from-marigold-50 to-ivory', icon: 'text-marigold-600', label: 'text-marigold-700' },
  { card: 'border-leaf-200 bg-gradient-to-b from-leaf-50 to-ivory', icon: 'text-leaf-600', label: 'text-leaf-700' },
];

function Person({ fullName, parents }) {
  return (
    <span className="block text-center">
      <span className="block px-2 font-script text-[clamp(2.3rem,7vw,3.4rem)] leading-tight text-rose-gradient">{fullName}</span>
      {parents && <span className="mt-0.5 block font-serif text-base text-plum-500 italic">{parents}</span>}
    </span>
  );
}

/** One couple: optional photo, then both names joined by a heart (or the configured word). */
function CoupleBlock({ couple, index, withPhoto }) {
  const groom = <Person fullName={couple.groomFullName || couple.groomName} parents={couple.groomParents} />;
  const bride = <Person fullName={couple.brideFullName || couple.brideName} parents={couple.brideParents} />;
  return (
    <Reveal delay={0.1 + index * 0.15} className="flex flex-col items-center">
      {withPhoto && <CouplePortrait couple={couple} delay={index * 0.8} className="mb-6 w-[min(62vw,250px)]" />}
      {brideFirst ? bride : groom}
      {coupleJoiner === 'heart' ? (
        <HeartMark className="my-1.5 h-7 w-8" />
      ) : (
        <span className="my-1 font-serif text-sm font-semibold tracking-[0.35em] text-leaf-600 uppercase italic">{coupleJoiner}</span>
      )}
      {brideFirst ? groom : bride}
    </Reveal>
  );
}

/** Screen 3 — the invitation card itself. */
export default function WeddingDetails({ onReplayVideo }) {
  const { invitation, venue, media } = config;
  const guest = useMemo(getGuestName, []);
  const withPhotos = hasCouplePhotos;

  const facts = [
    { icon: CalendarHeart, label: 'Date', value: formatWeddingDate() },
    { icon: Clock, label: 'Time', value: formatWeddingTime() },
    { icon: MapPin, label: 'Venue', value: venue.name },
  ].filter((f) => f.value);

  const intro = (
    <>
      {guest && (
        <Reveal delay={0.05}>
          <p className="mt-4 font-script text-3xl text-plum-600">Dear {guest},</p>
        </Reveal>
      )}
      {invitation.headingHindi && (
        <Reveal delay={0.08}>
          <p className="mt-4 font-deva text-[clamp(2.2rem,7vw,3.2rem)] leading-tight text-sindoor-600">{invitation.headingHindi}</p>
        </Reveal>
      )}
      <Reveal delay={0.1}>
        <p className="mt-3 font-serif text-sm font-semibold tracking-[0.3em] text-marigold-700 uppercase">{invitation.heading}</p>
      </Reveal>
      <Reveal delay={0.15}>
        <p className="mt-2 font-serif text-lg text-plum-600 italic">{invitation.subheading}</p>
      </Reveal>
    </>
  );

  // Both couples side by side with equal weight (stacked on phones), in the same order as the artwork.
  const couplesBlock = (
    <div className={`relative grid w-full gap-8 sm:grid-cols-2 ${withPhotos ? 'mt-8 gap-12' : 'mt-6'}`}>
      {couples.map((c, i) => (
        <CoupleBlock key={`${c.groomName}-${c.brideName}`} couple={c} index={i} withPhoto={withPhotos} />
      ))}
      {couples.length === 2 && (
        <span
          className="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 font-script text-4xl text-gold-gradient animate-shimmer sm:block"
          aria-hidden="true"
        >
          &amp;
        </span>
      )}
    </div>
  );

  const rest = (
    <>
      <Ornament className="my-8" />

      <div className="grid w-full gap-3 sm:grid-cols-3">
        {facts.map(({ icon: Icon, label, value }, i) => (
          <Reveal key={label} delay={0.1 * i} y={16}>
            <div className={`flex h-full flex-col items-center rounded-2xl border px-3 py-4 ${FACT_STYLES[i % FACT_STYLES.length].card}`}>
              <Icon className={`h-5 w-5 ${FACT_STYLES[i % FACT_STYLES.length].icon}`} aria-hidden="true" />
              <p className={`mt-1 font-sans text-[0.65rem] font-semibold tracking-[0.25em] uppercase ${FACT_STYLES[i % FACT_STYLES.length].label}`}>{label}</p>
              <p className="mt-1 font-serif text-lg leading-snug text-plum-800">{value}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <TextReveal
        text={invitation.message}
        stagger={0.025}
        className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-plum-700 italic"
      />
      {invitation.blessingHindi && (
        <Reveal delay={0.15}>
          <p className="mt-6 font-deva text-xl text-sindoor-600">{invitation.blessingHindi}</p>
        </Reveal>
      )}
      {invitation.blessing && (
        <Reveal delay={0.2}>
          <p className={`${invitation.blessingHindi ? 'mt-1' : 'mt-5'} font-sans text-sm tracking-wide text-plum-500`}>{invitation.blessing}</p>
        </Reveal>
      )}

      {media.video.enabled && onReplayVideo && (
        <Reveal delay={0.3}>
          <motion.button
            type="button"
            onClick={onReplayVideo}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-marigold-300 bg-marigold-50 px-5 py-2.5 text-sm font-semibold text-sindoor-700"
          >
            <Clapperboard className="h-4 w-4 text-sindoor-500" aria-hidden="true" /> Watch our film again
          </motion.button>
        </Reveal>
      )}
    </>
  );

  return (
    <section id="details" className="card-paper relative overflow-hidden px-4 pt-28 pb-24 sm:px-6 md:pt-36">
      <Toran className="absolute inset-x-0 top-0 z-10 h-[62px] sm:h-[92px]" />
      <FloralBranch className="top-10 -left-6 sm:top-14 sm:left-0" width={300} />
      <FloralBranch className="top-10 -right-6 sm:top-14 sm:right-0" width={300} flip delay={0.4} />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-16 left-6 hidden md:block"
        animate={{ y: [0, -12, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Blossom size={46} color={C.blossoms[0][0]} center={C.blossoms[0][1]} />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 bottom-32 hidden md:block"
        animate={{ y: [0, 10, 0], rotate: [0, -16, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Blossom size={34} color={C.blossoms[2][0]} center={C.blossoms[2][1]} />
      </motion.div>

      <div className="relative mx-auto max-w-5xl">
        <Reveal className="glass-card gold-frame relative rounded-[2rem] px-5 py-12 sm:px-10 md:py-16">
          <FloralCorner corner="tl" className="-top-3 -left-3 w-28 sm:w-40" />
          <FloralCorner corner="br" className="-right-3 -bottom-3 w-28 sm:w-40" />
          {/* Hindu card order: Shri Ganesh vandana, the couples' artwork (or portraits), then the invitation. */}
          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            <Reveal y={12}>
              <GaneshInvocation className="mb-8" />
            </Reveal>
            {config.invocation?.enabled && <Ornament className="mb-8" />}
            {!withPhotos && <CoupleArt className="mb-6 aspect-[1820/957] w-[min(84vw,640px)]" />}
            {intro}
            {couplesBlock}
            {rest}
          </div>
        </Reveal>

        <motion.a
          href="#events"
          className="mx-auto mt-10 flex w-max flex-col items-center gap-1 font-serif text-sm font-semibold tracking-[0.3em] text-leaf-700 uppercase"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          The celebrations
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </motion.a>
      </div>
    </section>
  );
}
