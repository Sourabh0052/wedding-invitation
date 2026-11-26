import Reveal from './Reveal.jsx';
import Ornament from './Ornament.jsx';

export default function SectionHeading({ eyebrow, title, subtitle, light = false, className = '' }) {
  return (
    <div className={`mx-auto max-w-2xl text-center ${className}`}>
      {eyebrow && (
        <Reveal y={12}>
          <p className={`font-serif text-sm tracking-[0.35em] uppercase ${light ? 'text-marigold-200' : 'text-leaf-600'}`}>
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.1}>
        <h2
          className={`mt-2 px-2 pb-1 font-script text-5xl leading-tight sm:text-6xl ${light ? 'text-ivory' : 'text-rose-gradient'}`}
        >
          {title}
        </h2>
      </Reveal>
      <Reveal delay={0.2} y={10}>
        <Ornament className="mt-3" light={light} />
      </Reveal>
      {subtitle && (
        <Reveal delay={0.3} y={12}>
          <p className={`mt-4 font-serif text-lg italic ${light ? 'text-sakura-100' : 'text-plum-600'}`}>{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}
