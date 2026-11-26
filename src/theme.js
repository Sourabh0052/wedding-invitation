import config from './config/weddingConfig.js';

/**
 * Colour sets for the hand-drawn SVG decorations (garland, petals, flowers, envelope).
 * The Tailwind colour tokens switch in index.css via <html data-palette="…">.
 *
 *   'pastel'  — blush pink, ivory, cream, champagne gold, light peach (soft & dreamy)
 *   'festive' — marigold yellow, sindoor red, leaf green (bright & colourful)
 */
export const palette = config.theme?.palette === 'festive' ? 'festive' : 'pastel';
export const isPastel = palette === 'pastel';

const FESTIVE = {
  toran: {
    flower1: ['#fbbf24', '#ffd23f', '#ffd23f', '#f59e0b', '#e07a06'], // fill, ruffle, inner, inner ruffle, centre
    flower2: ['#f59e0b', '#fb923c', '#fbbf24', '#e07a06', '#b45309'],
    bud: ['#e02828', '#f45555', '#9b1414'],
    leafA: ['#a3dd78', '#468a25'],
    leafB: ['#c5eca6', '#5fae34'],
    rope: ['#e02828', '#7a1212'],
    twist: '#f6e3b4',
    string: '#b45309',
    bell: ['#e0b866', '#a37a2b'],
  },
  petals: [
    { shape: 'petal', color: '#f9b4c9' },
    { shape: 'marigold', color: '#fbbf24' },
    { shape: 'petal', color: '#e02828' },
    { shape: 'leaf', color: '#8fd45f' },
    { shape: 'marigold', color: '#f59e0b' },
    { shape: 'petal', color: '#f597b6' },
    { shape: 'marigold', color: '#ffd23f' },
    { shape: 'petal', color: '#f45555' },
    { shape: 'leaf', color: '#b5e48c' },
  ],
  // [petal colour, centre colour] used on blossom branches & ornaments
  blossoms: [
    ['#ffd23f', '#e07a06'],
    ['#f45555', '#9b1414'],
    ['#fbbf24', '#c2410c'],
    ['#ff8a8a', '#c01818'],
    ['#ffe58a', '#e07a06'],
  ],
  ornament: ['#ffd23f', '#e02828'],
  leaves: ['#7fc94f', '#a3dd78'],
  roses: [
    ['#f45555', '#e02828', '#9b1414'], // outer, middle, swirl
    ['#ffe58a', '#fbbf24', '#e07a06'],
    ['#f9b4c9', '#f597b6', '#c94673'],
  ],
  vine: '#7fa85a',
  heart: ['#f45555', '#c01818'],
  heartStroke: '#e0b866',
  envelope: {
    body: 'linear-gradient(135deg, #c01818, #d42a2a 50%, #9b1414)',
    liner: '#fff3c4',
    linerGlyphs: [
      ['#f59e0b', '#c01818'],
      ['#f9b4c9', '#e02828'],
    ],
    pocket: ['#e63232', '#b51616'],
    pocketSide: ['#b51616', '#d62626'],
    line: ['#e0b866', '#fff3c4'],
    edge: '#f6e3b4',
    flap: ['#c81e1e', '#ec4040'],
    decor: [
      ['#ffd23f', '#e07a06'],
      ['#f9b4c9', '#e0709a'],
      ['#fbbf24', '#c01818'],
    ],
    leaves: ['#7fc94f', '#a3dd78'],
    seal: 'radial-gradient(circle at 35% 30%, #fff3c4, #fbbf24 45%, #e07a06 80%, #b45309)',
    sealText: '#7a1212',
    sealRing: 'rgb(155 20 20 / 0.5)',
  },
};

const PASTEL = {
  toran: {
    flower1: ['#f8cfb4', '#fbe0cc', '#fde7d6', '#efb796', '#dc9b74'], // peach
    flower2: ['#f5c1cc', '#fad6de', '#fbe0e6', '#e9a3b3', '#cf8197'], // blush
    bud: ['#fff6ea', '#f6e6cf', '#e4c79c'], // ivory bud
    leafA: ['#dbead0', '#9dbb88'],
    leafB: ['#e6f0dc', '#b1cb9c'],
    rope: ['#f6e3bd', '#d6b277'],
    twist: '#fffaf0',
    string: '#d9bd8a',
    bell: ['#ecd29e', '#b8955a'],
  },
  petals: [
    { shape: 'petal', color: '#f9c6d3' },
    { shape: 'petal', color: '#fbd5c0' },
    { shape: 'petal', color: '#f3dfc3' },
    { shape: 'leaf', color: '#cfe0c0' },
    { shape: 'petal', color: '#fbdbe3' },
    { shape: 'petal', color: '#f8c7b0' },
    { shape: 'petal', color: '#f5d9bd' },
    { shape: 'petal', color: '#f7b9c8' },
    { shape: 'leaf', color: '#dbe8cf' },
  ],
  blossoms: [
    ['#fbd5c0', '#e3a07c'],
    ['#fff4e6', '#e2c08e'],
    ['#f7c6d0', '#d98799'],
    ['#fde3d3', '#e7a585'],
    ['#fff8ee', '#ddb981'],
  ],
  ornament: ['#f7c6d0', '#d6a65e'],
  leaves: ['#bcd5a8', '#d6e6c8'],
  roses: [
    ['#f9cfd8', '#f3b3c2', '#d98799'], // blush pink
    ['#fff8ee', '#f6e7d2', '#d9bf9b'], // ivory
    ['#fcd9c4', '#f6c0a2', '#e09a74'], // peach
  ],
  vine: '#c9b48a',
  heart: ['#f6b6c4', '#e0889f'],
  heartStroke: '#d9b46e',
  envelope: {
    body: 'linear-gradient(135deg, #f8dde5, #f6d3dd 50%, #efc2d0)',
    liner: '#fdf1e6',
    linerGlyphs: [
      ['#f6b7cb', '#e0709a'],
      ['#f8d2b4', '#dc9b74'],
    ],
    pocket: ['#fdeef2', '#f7d6df'],
    pocketSide: ['#f9e2e8', '#fdf1f4'],
    line: ['#c99a3e', '#f6e3b4'],
    edge: '#e8b9c7',
    flap: ['#f6d0dc', '#fbe4eb'],
    decor: [
      ['#f7b2c8', '#e0709a'],
      ['#fff4e6', '#d9b46e'],
      ['#fbd5c0', '#e09a74'],
    ],
    leaves: ['#bcd5a8', '#d6e6c8'],
    seal: 'radial-gradient(circle at 35% 30%, #fff6e0, #f0d49a 45%, #d4ad62 80%, #b08a45)',
    sealText: '#7a3d5f',
    sealRing: 'rgb(122 61 95 / 0.35)',
  },
};

export const C = isPastel ? PASTEL : FESTIVE;
