import { couples, hasCouplePhotos } from '../../utils/wedding.js';
import CoupleArt from './CoupleArt.jsx';
import CouplePortrait from './CouplePortrait.jsx';

/**
 * Shows each couple's own photo when photos are set in the config,
 * otherwise the shared illustrated couple.
 */
export default function CoupleVisual({ artClassName = '', portraitClassName = '', className = '', eager = false, caption = false }) {
  if (!hasCouplePhotos) return <CoupleArt eager={eager} className={`${artClassName} ${className}`} />;
  return (
    <div className={`flex items-end justify-center gap-[clamp(0.5rem,2vw,1.5rem)] ${className}`}>
      {couples.map((c, i) => (
        <CouplePortrait
          key={`${c.groomName}-${c.brideName}`}
          couple={c}
          eager={eager}
          caption={caption}
          delay={i * 0.8}
          className={`${portraitClassName} ${i % 2 ? 'mb-[6%]' : ''}`}
        />
      ))}
    </div>
  );
}
