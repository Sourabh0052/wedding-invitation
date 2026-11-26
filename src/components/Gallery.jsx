import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import config from '../config/weddingConfig.js';
import SectionHeading from './ui/SectionHeading.jsx';

/** "Our Moments" — the couples' own photos, with a tap-to-enlarge lightbox. Hidden when empty. */
export default function Gallery() {
  const { title, subtitle, photos = [] } = config.gallery ?? {};
  const [active, setActive] = useState(null); // index of the open photo
  const [broken, setBroken] = useState({});

  const visible = photos.filter((p, i) => p?.src && !broken[i]);
  const count = visible.length;

  const close = useCallback(() => setActive(null), []);
  const step = useCallback((dir) => setActive((i) => (i === null ? i : (i + dir + count) % count)), [count]);

  useEffect(() => {
    if (active === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [active, close, step]);

  if (!count) return null;
  const current = active !== null ? visible[active] : null;

  return (
    <section id="gallery" className="relative overflow-hidden bg-gradient-to-b from-leaf-50 via-ivory to-marigold-50 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Memories" title={title || 'Our Moments'} subtitle={subtitle} />

        <div className="mt-12 columns-2 gap-3 sm:gap-5 md:columns-3">
          {photos.map((photo, i) =>
            !photo?.src || broken[i] ? null : (
              <motion.button
                key={photo.src}
                type="button"
                onClick={() => setActive(visible.indexOf(photo))}
                className="group relative mb-3 block w-full overflow-hidden rounded-2xl border-4 border-ivory shadow-dreamy break-inside-avoid sm:mb-5"
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                aria-label={photo.caption ? `Open photo: ${photo.caption}` : 'Open photo'}
              >
                <img
                  src={photo.src}
                  alt={photo.caption || ''}
                  loading="lazy"
                  decoding="async"
                  className="w-full transition-transform duration-700 group-hover:scale-105"
                  onError={() => setBroken((b) => ({ ...b, [i]: true }))}
                />
                {photo.caption && (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum-900/70 to-transparent px-3 pt-8 pb-2 text-left font-serif text-sm text-ivory italic">
                    {photo.caption}
                  </span>
                )}
              </motion.button>
            ),
          )}
        </div>
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-plum-900/92 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={current.src}
                src={current.src}
                alt={current.caption || ''}
                className="max-h-[80dvh] max-w-full rounded-xl border-4 border-ivory object-contain shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                drag={count > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) step(1);
                  else if (info.offset.x > 60) step(-1);
                }}
              />
            </AnimatePresence>
            {current.caption && <p className="mt-4 font-serif text-lg text-ivory italic">{current.caption}</p>}
            {count > 1 && (
              <>
                <p className="mt-2 font-sans text-xs tracking-widest text-ivory/70">
                  {active + 1} / {count}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  className="absolute top-1/2 left-2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:left-6"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  className="absolute top-1/2 right-2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:right-6"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
