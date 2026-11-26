// Rounded petal pointing up from the centre.
const PETAL = 'M0,0 C-3.6,-2.4 -3.8,-8.2 0,-10 C3.8,-8.2 3.6,-2.4 0,0 Z';
const OUTER = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
const INNER = [15, 60, 105, 150, 195, 240, 285, 330];

function Petals({ color, center }) {
  return (
    <>
      {OUTER.map((r) => (
        <path key={r} d={PETAL} fill={color} transform={`rotate(${r})`} />
      ))}
      {INNER.map((r) => (
        <path key={`i${r}`} d={PETAL} fill={center} fillOpacity=".45" transform={`rotate(${r}) scale(.62)`} />
      ))}
      <circle r="2.4" fill={center} />
    </>
  );
}

/** Genda (marigold) flower — inline SVG that scales with `size`. */
export default function Blossom({ size = 24, color = '#f8c27a', center = '#e0943e', className = '', style, rotate = 0 }) {
  return (
    <svg
      viewBox="-11 -11 22 22"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <g transform={`rotate(${rotate})`}>
        <Petals color={color} center={center} />
      </g>
    </svg>
  );
}

/** Same flower as an SVG <g>, for drawing inside another SVG. */
export function BlossomGlyph({ x = 0, y = 0, size = 22, color = '#f8c27a', center = '#e0943e', rotate = 0 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${size / 22}) rotate(${rotate})`}>
      <Petals color={color} center={center} />
    </g>
  );
}
