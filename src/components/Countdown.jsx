import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarPlus, PartyPopper } from 'lucide-react';
import config from '../config/weddingConfig.js';
import useCountdown from '../hooks/useCountdown.js';
import { formatWeddingDate, formatWeddingTime, getGoogleCalendarUrl, weddingDate } from '../utils/wedding.js';
import SectionHeading from './ui/SectionHeading.jsx';
import Button from './ui/Button.jsx';
import Reveal from './ui/Reveal.jsx';
import Toran from './ui/Toran.jsx';
import { isPastel } from '../theme.js';

// One colour per tile: bold gradients (festive) or soft glass with coloured numbers (pastel).
const TILES = isPastel
  ? [
      { box: 'border-sindoor-200 from-white/85 to-sindoor-50/85', num: 'text-sindoor-600', label: 'text-sindoor-500' },
      { box: 'border-marigold-200 from-white/85 to-marigold-50/85', num: 'text-marigold-600', label: 'text-marigold-600' },
      { box: 'border-gold-300/70 from-white/85 to-cream/85', num: 'text-gold-600', label: 'text-gold-600' },
      { box: 'border-sakura-200 from-white/85 to-sakura-50/85', num: 'text-sakura-600', label: 'text-sakura-500' },
    ]
  : [
      { box: 'border-white/60 from-sindoor-400/85 to-sindoor-700/80', num: 'text-white', label: 'text-white' },
      { box: 'border-white/60 from-marigold-300/85 to-marigold-600/80', num: 'text-white', label: 'text-white' },
      { box: 'border-white/60 from-leaf-300/85 to-leaf-600/80', num: 'text-white', label: 'text-white' },
      { box: 'border-white/60 from-sakura-300/85 to-sakura-600/80', num: 'text-white', label: 'text-white' },
    ];

function Unit({ value, label, index }) {
  const reduceMotion = useReducedMotion();
  const text = String(value).padStart(2, '0');
  return (
    <Reveal delay={index * 0.1} y={24}>
      <div className={`relative flex w-[clamp(4.4rem,20vw,8.5rem)] flex-col items-center rounded-2xl border-2 bg-gradient-to-b ${TILES[index % TILES.length].box} px-2 pt-4 pb-3 shadow-[0_20px_40px_-20px_rgba(51,24,39,0.7)] backdrop-blur-md sm:rounded-3xl sm:pt-6 sm:pb-4`}>
        <div className={`absolute inset-x-3 top-1/2 h-px ${isPastel ? 'bg-gold-300/40' : 'bg-white/20'}`} aria-hidden="true" />
        <div className={`relative h-[1.15em] overflow-hidden font-serif text-[clamp(2.2rem,8vw,4.5rem)] leading-none font-semibold tabular-nums ${TILES[index % TILES.length].num} ${isPastel ? '' : 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]'}`}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={text}
              className="block"
              initial={reduceMotion ? { opacity: 0 } : { y: '-100%', opacity: 0, rotateX: -60 }}
              animate={{ y: '0%', opacity: 1, rotateX: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { y: '100%', opacity: 0, rotateX: 60 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {text}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className={`mt-2 font-sans text-[0.6rem] font-semibold tracking-[0.3em] uppercase sm:text-xs ${TILES[index % TILES.length].label}`}>
          {label}
        </span>
      </div>
    </Reveal>
  );
}

/** Screen 5 — live countdown to the wedding. */
export default function Countdown() {
  const { days, hours, minutes, seconds, isOver } = useCountdown(weddingDate);
  const calendarUrl = getGoogleCalendarUrl();

  return (
    <section id="countdown" className="relative overflow-hidden px-4 pt-32 pb-24 sm:px-6 sm:pt-36">
      <img
        src={config.media.images.celebration || config.media.images.background}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          isPastel ? 'from-ivory/85 via-blush/75 to-cream/90' : 'from-sindoor-800/80 via-[#c2410c]/45 to-[#4a0b0b]/85'
        }`}
      />
      <Toran className="absolute inset-x-0 top-0 h-[62px] sm:h-[92px]" />

      <div className="relative mx-auto max-w-4xl text-center">
        <SectionHeading eyebrow="Save the date" title="Counting Down to Forever" light={!isPastel} />

        {isOver ? (
          <Reveal className="mt-12">
            <PartyPopper className={`mx-auto h-12 w-12 ${isPastel ? 'text-sindoor-400' : 'text-marigold-200'}`} aria-hidden="true" />
            <p className={`mt-4 font-script text-5xl ${isPastel ? 'text-rose-gradient' : 'text-white'}`}>The big day is here!</p>
            <p className={`mt-2 font-serif text-lg italic ${isPastel ? 'text-plum-600' : 'text-marigold-100'}`}>Thank you for celebrating with us.</p>
          </Reveal>
        ) : (
          <div className="mt-12 flex justify-center gap-[clamp(0.5rem,2.5vw,1.5rem)]" role="timer" aria-live="off">
            <Unit value={days} label="Days" index={0} />
            <Unit value={hours} label="Hours" index={1} />
            <Unit value={minutes} label="Minutes" index={2} />
            <Unit value={seconds} label="Seconds" index={3} />
          </div>
        )}

        <Reveal delay={0.3}>
          <p className={`mt-10 font-serif text-xl italic ${isPastel ? 'text-plum-700' : 'text-marigold-100'}`}>
            {formatWeddingDate()} · {formatWeddingTime()}
          </p>
        </Reveal>
        {calendarUrl && !isOver && (
          <Reveal delay={0.4}>
            <Button variant={isPastel ? 'ghost' : 'light'} href={calendarUrl} icon={CalendarPlus} className="mt-6">
              Add to Google Calendar
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
