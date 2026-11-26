import { Fragment } from 'react';
import { couples, coupleJoiner, orderedNames } from '../../utils/wedding.js';
import HeartMark from './HeartMark.jsx';

const SIZES = {
  hero: 'text-[clamp(2.3rem,10vw,4rem)] md:text-[clamp(2.8rem,4.4vw,4.2rem)]',
  lg: 'text-[clamp(2.2rem,8vw,3.6rem)]',
  md: 'text-[clamp(1.9rem,6vw,2.8rem)]',
  sm: 'text-xl sm:text-2xl',
  xs: 'text-lg sm:text-xl',
  xxs: 'text-base sm:text-lg',
};

/**
 * Every couple on its own line — "Bride ♥ Groom" (or "Groom weds Bride", per the config) —
 * joined by a gold "&".
 * Renders only <span>s so it can sit inside headings.
 */
export default function CoupleNames({ size = 'md', light = false, align = 'center', className = '' }) {
  const nameCls = light ? 'text-white' : 'text-rose-gradient';
  const joinCls = light ? 'text-marigold-200' : 'text-leaf-600';
  const alignCls = align === 'start' ? 'items-start' : 'items-center';

  return (
    <span className={`flex flex-col ${alignCls} ${SIZES[size] ?? SIZES.md} ${className}`}>
      {couples.map((c, i) => (
        <Fragment key={`${c.groomName}-${c.brideName}`}>
          {i > 0 && (
            <span className="font-script text-[0.55em] leading-none text-gold-gradient animate-shimmer" aria-hidden="true">
              &amp;
            </span>
          )}
          <span className="block whitespace-nowrap px-[0.12em] pb-[0.08em] leading-[1.15]">
            <span className={`font-script ${nameCls}`}>{orderedNames(c)[0]}</span>
            {coupleJoiner === 'heart' ? (
              <HeartMark light={light} className="mx-[0.42em] inline-block h-[0.42em] w-[0.46em] -translate-y-[0.06em] align-middle" />
            ) : (
              <span className={`mx-[0.8em] align-middle font-serif text-[0.36em] tracking-[0.15em] uppercase italic ${joinCls}`}>
                {coupleJoiner}
              </span>
            )}
            <span className={`font-script ${nameCls}`}>{orderedNames(c)[1]}</span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}
