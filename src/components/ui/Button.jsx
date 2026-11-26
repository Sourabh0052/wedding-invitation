import { motion } from 'framer-motion';

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-sindoor-600 via-sindoor-500 to-marigold-600 text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.25)] shadow-[0_18px_40px_-16px_rgba(192,24,24,0.6)] hover:shadow-[0_18px_40px_-10px_rgba(224,122,6,0.7)]',
  gold: 'bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 text-plum-900 shadow-gold',
  ghost: 'border-2 border-leaf-400/70 bg-leaf-50/80 text-leaf-700 backdrop-blur hover:bg-leaf-100',
  light: 'border border-white/40 bg-white/15 text-white backdrop-blur-md hover:bg-white/25',
};

/** Animated pill button. Renders an <a> when `href` is given. */
export default function Button({ children, variant = 'primary', className = '', href, icon: Icon, iconClassName = '', ...props }) {
  const Comp = href ? motion.a : motion.button;
  const linkProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { type: props.type ?? 'button' };
  return (
    <Comp
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 font-sans text-sm font-semibold tracking-wide transition-[background,box-shadow] disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...linkProps}
      {...props}
    >
      {Icon && <Icon className={`h-4 w-4 shrink-0 ${iconClassName}`} aria-hidden="true" />}
      <span>{children}</span>
    </Comp>
  );
}
