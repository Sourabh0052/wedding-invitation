import { motion, useReducedMotion } from 'framer-motion';
import config from '../../config/weddingConfig.js';

const inv = config.invocation ?? {};

/**
 * Shri Ganesh ji in a temple-arch frame — the traditional opening of a Hindu wedding card.
 *
 *   size="full"    "॥ श्री गणेशाय नमः ॥", the framed picture and the Vakratunda shloka (invitation card)
 *   size="compact" the invocation line over a small round picture (welcome screen)
 */
export default function GaneshInvocation({ size = 'full', className = '', eager = false }) {
  const reduceMotion = useReducedMotion();
  if (!inv.enabled) return null;

  const title = inv.title && <p className="font-deva text-[1.05em] leading-snug text-sindoor-600">{inv.title}</p>;

  if (size === 'compact') {
    return (
      <div className={`flex flex-col items-center gap-1.5 ${className}`}>
        {inv.image && (
          <span className="relative inline-block">
            <span className="absolute -inset-3 rounded-full bg-[radial-gradient(closest-side,rgba(255,224,150,0.9),transparent)] blur-[2px]" aria-hidden="true" />
            <img
              src={inv.image}
              alt={inv.imageAlt}
              width="64"
              height="64"
              loading={eager ? 'eager' : 'lazy'}
              className="relative h-[clamp(48px,7dvh,64px)] w-[clamp(48px,7dvh,64px)] rounded-full border-[3px] border-gold-300 object-cover object-[50%_18%] shadow-gold"
            />
          </span>
        )}
        <div className="text-[clamp(0.95rem,2.4vw,1.15rem)]">{title}</div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="text-[clamp(1.2rem,3.6vw,1.6rem)]">{title}</div>

      {inv.image && (
        <div className="relative mt-5">
          {/* diya-like halo that breathes softly */}
          <motion.span
            aria-hidden="true"
            className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,226,150,0.85),rgba(255,214,130,0.25)_60%,transparent)]"
            animate={reduceMotion ? undefined : { opacity: [0.7, 1, 0.7], scale: [0.97, 1.03, 0.97] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative rounded-t-[999px] rounded-b-xl border-2 border-gold-300 bg-ivory p-2 shadow-gold">
            <img
              src={inv.image}
              alt={inv.imageAlt}
              width="460"
              height="575"
              loading={eager ? 'eager' : 'lazy'}
              className="aspect-[4/5] w-[min(44vw,190px)] rounded-t-[999px] rounded-b-lg border-[3px] border-gold-400 object-cover object-top"
            />
          </div>
          {/* marigold at the top of the arch */}
          <span
            aria-hidden="true"
            className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full border-[5px] border-dotted border-marigold-300 bg-marigold-400"
          />
        </div>
      )}

      {inv.shloka?.length > 0 && (
        <div className="mt-6 font-deva text-[clamp(1.05rem,3vw,1.3rem)] leading-relaxed text-plum-700">
          {inv.shloka.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
      {inv.shlokaMeaning && <p className="mt-2 max-w-md font-serif text-base text-plum-500 italic">{inv.shlokaMeaning}</p>}
    </div>
  );
}
