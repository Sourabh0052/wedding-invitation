/** Round sindoor-and-gold seal with ॐ (Om) — the auspicious mark on a Hindu wedding card. */
export default function OmSeal({ size = 44, className = '' }) {
  return (
    <span
      className={`inline-grid place-items-center rounded-full bg-gradient-to-br from-sindoor-500 to-sindoor-800 font-deva text-marigold-200 shadow-gold ring-2 ring-gold-300 ring-offset-2 ring-offset-transparent ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.56 }}
      role="img"
      aria-label="Om"
    >
      <span className="translate-y-[6%] leading-none" aria-hidden="true">
        ॐ
      </span>
    </span>
  );
}
