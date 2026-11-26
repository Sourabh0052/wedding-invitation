import { motion, useReducedMotion } from 'framer-motion';

/**
 * Reveals text word-by-word (soft blur + rise).
 * `trigger="view"` animates when scrolled into view, `"mount"` immediately.
 */
export default function TextReveal({ text, as = 'p', className = '', delay = 0, stagger = 0.06, trigger = 'view' }) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as] ?? motion.p;
  const words = String(text).split(' ');

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : stagger, delayChildren: delay } },
  };
  const word = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: '0.45em', filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  const triggerProps =
    trigger === 'mount'
      ? { initial: 'hidden', animate: 'show' }
      : { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.4 } };

  return (
    <Tag className={className} variants={container} {...triggerProps} aria-label={text}>
      {words.map((w, i) => (
        <motion.span key={`${w}-${i}`} variants={word} className="inline-block whitespace-pre" aria-hidden="true">
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </Tag>
  );
}
