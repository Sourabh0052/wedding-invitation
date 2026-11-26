/**
 * A single falling petal.
 *   shape 'petal'    — sakura / rose petal (any colour)
 *   shape 'marigold' — round, ruffled marigold petal
 *   shape 'leaf'     — small mango / tulsi leaf
 */
export default function Petal({ size = 16, color = '#f9b4c9', shape = 'petal', style, className = '' }) {
  if (shape === 'leaf') {
    return (
      <svg viewBox="0 0 20 24" width={size} height={size * 1.2} style={style} className={className} aria-hidden="true">
        <path d="M10 1 C19 7 19 17 10 23 C1 17 1 7 10 1 Z" fill={color} />
        <path d="M10 3 L10 21 M10 9 L14 6 M10 14 L6 11" stroke="#fff" strokeOpacity=".5" strokeWidth="1" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (shape === 'marigold') {
    return (
      <svg viewBox="-11 -11 22 22" width={size} height={size} style={style} className={className} aria-hidden="true">
        <circle r="7" fill={color} stroke={color} strokeWidth="4" strokeDasharray="2 1.2" />
        <circle r="3.6" fill="#fff" fillOpacity=".35" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 24" width={size} height={size * 1.2} style={style} className={className} aria-hidden="true">
      <path d="M10 23 C2 17 0 9 4 3 C6 0 8.5 1 10 4 C11.5 1 14 0 16 3 C20 9 18 17 10 23 Z" fill={color} />
      <path d="M10 21 C6 16 5 10 7 6" stroke="#fff" strokeOpacity=".55" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
