import { motion } from 'framer-motion';

/** Fade-and-rise when the element scrolls into view. */
export default function Reveal({ children, className = '', delay = 0, y = 32, as = 'div', once = true }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
