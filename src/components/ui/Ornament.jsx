import Blossom from './Blossom.jsx';
import { C } from '../../theme.js';

/** Festive divider: red–gold lines, green diamonds, marigold dots and a blossom. */
export default function Ornament({ className = '', light = false }) {
  const line = light ? 'via-marigold-200' : 'via-sindoor-400';
  return (
    <div className={`flex items-center justify-center gap-2.5 ${className}`} aria-hidden="true">
      <span className={`h-[2px] w-14 rounded-full bg-gradient-to-r from-transparent ${line} to-marigold-400 sm:w-24`} />
      <span className="h-2 w-2 rotate-45 bg-leaf-500" />
      <span className="h-1.5 w-1.5 rounded-full bg-marigold-400" />
      <Blossom size={24} color={C.ornament[0]} center={C.ornament[1]} />
      <span className="h-1.5 w-1.5 rounded-full bg-marigold-400" />
      <span className="h-2 w-2 rotate-45 bg-leaf-500" />
      <span className={`h-[2px] w-14 rounded-full bg-gradient-to-l from-transparent ${line} to-marigold-400 sm:w-24`} />
    </div>
  );
}
