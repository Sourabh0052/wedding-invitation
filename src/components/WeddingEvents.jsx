import { motion } from 'framer-motion';
import { CalendarDays, CalendarHeart, Clock, Flame, Gem, Hand, MapPin, Music2, Shirt, Sparkles, Sun } from 'lucide-react';
import config from '../config/weddingConfig.js';
import { formatEventDate, formatEventDay } from '../utils/wedding.js';
import SectionHeading from './ui/SectionHeading.jsx';
import PetalField from './ui/PetalField.jsx';
import FloralCorner from './ui/FloralCorner.jsx';

/** Visual theme per event type (icon key from weddingConfig.events[].icon). */
const THEMES = {
  sagai: { Icon: Gem, ring: 'from-marigold-300 via-marigold-500 to-sindoor-500', glow: 'rgba(245,158,11,0.45)', tag: 'bg-marigold-100 text-marigold-700', card: 'from-marigold-50 via-ivory to-leaf-50' },
  haldi: { Icon: Sun, ring: 'from-marigold-200 via-marigold-300 to-marigold-500', glow: 'rgba(245,190,40,0.4)', tag: 'bg-marigold-100 text-marigold-700', card: 'from-marigold-100 via-marigold-50 to-ivory' },
  mehendi: { Icon: Hand, ring: 'from-leaf-200 via-leaf-400 to-leaf-600', glow: 'rgba(95,174,52,0.35)', tag: 'bg-leaf-100 text-leaf-700', card: 'from-leaf-100 via-leaf-50 to-ivory' },
  sangeet: { Icon: Music2, ring: 'from-violet-200 via-fuchsia-200 to-violet-400', glow: 'rgba(160,100,220,0.3)', tag: 'bg-violet-50 text-violet-800', card: 'from-violet-50 to-ivory' },
  wedding: { Icon: Flame, ring: 'from-marigold-400 via-sindoor-500 to-sindoor-700', glow: 'rgba(224,40,40,0.4)', tag: 'bg-sindoor-100 text-sindoor-700', card: 'from-sindoor-50 via-ivory to-marigold-50' },
  reception: { Icon: Sparkles, ring: 'from-gold-200 via-gold-300 to-gold-500', glow: 'rgba(201,154,62,0.35)', tag: 'bg-gold-200/40 text-gold-600', card: 'from-marigold-50 to-ivory' },
  default: { Icon: CalendarHeart, ring: 'from-sakura-100 via-sakura-200 to-gold-300', glow: 'rgba(231,96,143,0.25)', tag: 'bg-sakura-50 text-sakura-700', card: 'from-sakura-50 to-ivory' },
};

function EventCard({ event, index }) {
  const theme = THEMES[event.icon] ?? THEMES.default;
  const { Icon } = theme;
  const { day, month } = formatEventDay(event.date);

  return (
    <motion.article
      className="group relative w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
      initial={{ opacity: 0, y: 60, rotate: index % 2 ? 2 : -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
    >
      <div
        className={`relative h-full overflow-hidden rounded-[1.75rem] border border-marigold-300/70 bg-gradient-to-br ${theme.card} p-6 pt-8 shadow-[0_24px_50px_-24px_var(--glow)] transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-16px_var(--glow)]`}
        style={{ '--glow': theme.glow }}
      >
        {/* festive red · yellow · green · pink band */}
        <div className="festive-stripe absolute inset-x-0 top-0 z-10 h-2" aria-hidden="true" />
        {/* soft corner wash */}
        <div className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${theme.ring} opacity-25 blur-2xl`} />

        {event.image && (
          <div className="relative -mx-6 -mt-8 aspect-[16/10] overflow-hidden">
            <img
              src={event.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: event.imagePosition || 'center' }}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/70 to-transparent" />
          </div>
        )}

        <div className={`relative flex items-start justify-between ${event.image ? '-mt-8' : ''}`}>
          <motion.div
            className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${theme.ring} shadow-lg`}
            whileHover={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="h-8 w-8 text-white drop-shadow" aria-hidden="true" />
          </motion.div>
          {day && (
            <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-marigold-400 bg-white/90 px-3 py-1.5 text-center">
              <span className="font-serif text-3xl leading-none font-semibold text-sindoor-600">{day}</span>
              <span className="font-sans text-[0.65rem] font-semibold tracking-[0.2em] text-leaf-600 uppercase">{month}</span>
            </div>
          )}
        </div>

        <h3 className="relative mt-5 font-serif text-[1.7rem] leading-tight font-semibold text-plum-800">{event.name}</h3>
        {event.description && <p className="relative mt-2 font-serif text-lg leading-snug text-plum-600 italic">{event.description}</p>}

        <div className="relative my-4 h-px bg-gradient-to-r from-sindoor-400 via-marigold-300 to-leaf-300" />

        <ul className="relative space-y-2.5 font-sans text-sm text-plum-700">
          <li className="flex items-start gap-2.5">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-sindoor-500" aria-hidden="true" />
            <span>{formatEventDate(event.date)}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-marigold-600" aria-hidden="true" />
            <span>{event.time}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" aria-hidden="true" />
            <span>{event.venue}</span>
          </li>
        </ul>

        {event.dressCode && (
          <span className={`relative mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${theme.tag}`}>
            <Shirt className="h-3.5 w-3.5" aria-hidden="true" /> {event.dressCode}
          </span>
        )}
      </div>
    </motion.article>
  );
}

/** Screen 4 — one card per ceremony. */
export default function WeddingEvents() {
  return (
    <section
      id="events"
      className="relative overflow-hidden bg-gradient-to-b from-marigold-50 via-ivory to-leaf-50 px-4 py-24 sm:px-6"
    >
      <PetalField count={10} className="pointer-events-none absolute inset-0 overflow-hidden" />
      <FloralCorner corner="tl" className="w-28 sm:w-48" />
      <FloralCorner corner="tr" className="w-28 sm:w-48" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Celebrations"
          title="Wedding Festivities"
          subtitle="Join us for every colour of our celebration"
        />
        <div className="mt-14 flex flex-wrap justify-center gap-6">
          {config.events.map((event, i) => (
            <EventCard key={event.id ?? event.name} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
