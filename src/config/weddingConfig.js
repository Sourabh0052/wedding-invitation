/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WEDDING CONFIGURATION
 *  Everything a guest sees is driven from this one file.
 *  Edit the values below — you never need to touch the React components.
 *
 *  Media files live in /public. A path like "/images/photos/gaurav-sheetal.webp"
 *  means the file at  public/images/photos/gaurav-sheetal.webp
 *
 *  ⚠ Items marked  TODO  are placeholders — replace them before sharing the link.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const weddingConfig = {
  // ── Browser tab title & link-preview text (WhatsApp, iMessage, etc.) ───────
  meta: {
    title: 'Gaurav weds Sheetal & Sourav weds Komal · Wedding Invitation',
    description:
      'Together with our families, we invite you to celebrate our special day — Lagan-Sagai on 7 December and the wedding on 11 December 2026.',
    // Full public URL of the site once deployed (used for link previews & sharing).
    // Leave empty to use whatever URL the guest opened.
    siteUrl: '',
  },

  // ── The couples ────────────────────────────────────────────────────────────
  // Add, remove or reorder couples here. Each one appears on every screen.
  couples: [
    {
      groomName: 'Gaurav', // short name, used in the big script headings
      groomFullName: 'Gaurav', // TODO: full name, e.g. 'Gaurav Kumar'
      groomParents: '', // e.g. 'Son of Mrs. … & Mr. …'  (leave empty to hide)

      brideName: 'Sheetal',
      brideFullName: 'Sheetal', // TODO: full name
      brideParents: '', // e.g. 'Daughter of Mrs. … & Mr. …'

      // Your own photo of this couple (see README → "Add your own photos").
      // Leave empty to use the illustrated couple.
      photo: '',
    },
    {
      groomName: 'Sourav',
      groomFullName: 'Sourav', // TODO: full name
      groomParents: '',

      brideName: 'Komal',
      brideFullName: 'Komal', // TODO: full name
      brideParents: '',

      photo: '',
    },
  ],
  // Between the two names: 'heart' draws a ♥, or use a word such as 'weds', '&', 'संग' …
  coupleJoiner: 'heart',
  // 'bride-first' → "Sheetal ♥ Gaurav";  'groom-first' → "Gaurav ♥ Sheetal"
  nameOrder: 'groom-first',
  hashtag: '', // e.g. '#GauravSheetalSouravKomal'  (leave empty to hide)

  // ── Shri Ganesh vandana — the traditional opening of a Hindu wedding card ──
  // Shown at the top of the welcome screen and the invitation card. enabled: false hides it.
  invocation: {
    enabled: true,
    title: '॥ श्री गणेशाय नमः ॥',
    // "Shri Mangalmurti", Raja Ravi Varma Press (public domain). Swap in your own picture if you like.
    image: '/images/ganesh.webp',
    imageAlt: 'Shri Ganesh ji',
    shloka: ['वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।', 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥'],
    shlokaMeaning: 'O Lord Ganesha, remove every obstacle from all our endeavours, always.', // '' to hide
  },

  // ── Look & feel ────────────────────────────────────────────────────────────
  theme: {
    // 'pastel'  → blush pink, ivory, cream, champagne gold, light peach (soft & dreamy)
    // 'festive' → marigold yellow, sindoor red, leaf green (bright & colourful)
    palette: 'pastel',
  },

  // ── Main wedding date (drives the countdown & calendar button) ─────────────
  wedding: {
    // ISO 8601 date-time WITH the venue's UTC offset (+05:30 = India).
    dateTime: '2026-12-11T19:00:00+05:30', // Shaadi, 7:00 PM
    timeZone: 'Asia/Kolkata', // IANA time zone of the venue
    durationHours: 5, // used for "Add to calendar"
    // Optional: override the automatically formatted date / time text.
    displayDate: '', // e.g. 'Friday, the Eleventh of December'
    displayTime: '', // e.g. 'Seven in the evening'
  },

  // ── Screen 1: welcome ──────────────────────────────────────────────────────
  welcome: {
    eyebrow: 'Shubh Vivah',
    message: 'Together with our families, we invite you to celebrate our special day.',
    buttonText: 'Open Invitation',
    // Guests can be greeted by name: share  https://your-site.com/?guest=Priya
    greetGuestFromUrl: true,
  },

  // ── Screen 3: the invitation text ──────────────────────────────────────────
  invitation: {
    headingHindi: 'शुभ विवाह', // big Devanagari heading on the card ('' to hide)
    heading: 'You are cordially invited',
    subheading: 'to bless the sacred union of',
    message:
      'With the grace of Shri Ganesh ji and the blessings of our elders, two couples will tie the sacred knot of marriage. We humbly request your gracious presence to shower your blessings upon them on this auspicious occasion.',
    blessingHindi: 'विनीत : समस्त परिवार', // "With regards — the entire family" ('' to hide)
    blessing: 'With love and blessings from the entire family', // TODO: e.g. 'With blessings from the … family'
  },

  // ── Screen 4: events ───────────────────────────────────────────────────────
  // icon: sagai | haldi | mehendi | sangeet | wedding | reception | default
  // Add more events (Haldi, Mehendi, Sangeet, Reception…) by copying a block.
  events: [
    {
      id: 'lagan-sagai',
      name: 'Lagan-Sagai',
      icon: 'sagai',
      image: '/images/events/lagan-sagai.webp', // picture at the top of the card (leave '' for none)
      imagePosition: 'center 45%', // which part of the picture to keep when it is cropped
      date: '2026-12-07',
      time: '6:00 PM',
      venue: 'Near Laxminarayan Mandir, Pelak, Palwal',
      description: 'Rings, the Lagan rituals and the blessings of our elders — the first step towards forever.',
      dressCode: '',
    },
    {
      id: 'shaadi',
      name: 'Shaadi · Wedding Ceremony',
      icon: 'wedding',
      image: '/images/events/shaadi.webp',
      imagePosition: 'center 42%',
      date: '2026-12-11',
      time: '7:00 PM', // keep in sync with wedding.dateTime
      venue: 'Near Laxminarayan Mandir, Pelak, Palwal',
      description: 'Saat pheras around the sacred fire, with Agni Dev as witness and the blessings of our elders.',
      dressCode: '',
    },
  ],

  // ── Screen 6: location ─────────────────────────────────────────────────────
  venue: {
    name: 'Near Laxminarayan Mandir', // shown as the venue heading
    address: 'Pelak, Palwal, Haryana', // shown under it; name + address = the full address
    // What Google Maps searches for (the map pin & directions). Leave empty to use name + address.
    mapQuery: 'Laxminarayan Mandir, Pelak, Palwal, Haryana',
    // Link opened by "Get Directions". Leave empty to build one from the address.
    // Tip: open the venue in Google Maps → Share → Copy link, and paste it here.
    googleMapsUrl: '',
    // Embedded map. Leave empty to build one from the address (no API key needed).
    // Or paste the src="..." value from Google Maps → Share → Embed a map.
    mapEmbedUrl: '',
  },

  // ── Media (files in /public) ───────────────────────────────────────────────
  media: {
    video: {
      enabled: true, // false = skip the film screen entirely
      src: '/videos/wedding-invitation.mp4',
      poster: '/images/background.webp', // shown while the video loads
      fallbackImage: '/images/background.webp', // shown if the video cannot play
      // 'contain' never crops your film (blurred backdrop fills the sides).
      // 'cover' fills the whole screen but may crop edges on phones.
      fit: 'contain',
    },
    music: {
      enabled: true,
      src: '/audio/background-music.mp3',
      volume: 0.45, // 0 – 1
    },
    images: {
      // Illustration of both couples (transparent background), used when the couples have no photos.
      // '/images/couple-varmala.webp' is the single-couple version.
      couple: '/images/couples-two.webp',
      background: '/images/background.webp', // welcome-screen landscape
      celebration: '/images/celebration.webp', // background of the countdown & closing screens
    },
  },

  // ── Photo gallery ("Our Moments") — hidden while the list is empty ─────────
  gallery: {
    title: 'Our Moments',
    subtitle: 'A few memories we hold close',
    photos: [
      // { src: '/images/photos/photo-01.webp', caption: 'Our first trip' },
    ],
  },

  // ── Screen 7: RSVP ─────────────────────────────────────────────────────────
  rsvp: {
    enabled: true,
    deadline: '2026-12-04', // shown to guests; leave empty to hide
    maxAttendees: 6,
    /**
     * mode:
     *   'local'         → saved in the guest's browser only (demo / offline)
     *   'formspree'     → https://formspree.io  (endpoint: 'https://formspree.io/f/xxxxxxx')
     *   'google-sheets' → Google Apps Script web app URL (see README)
     *   'webhook'       → any URL that accepts a JSON POST (your future backend)
     * Every response is also kept in localStorage so guests can edit it later.
     */
    mode: 'local',
    endpoint: '',
    storageKey: 'wedding-rsvp',
  },

  // ── Screen 8: closing ──────────────────────────────────────────────────────
  closing: {
    blessingHindi: '॥ शुभम् भवतु ॥', // "may all be auspicious" — shown under the Om ('' to hide)
    message: 'Your presence will make our celebration even more special.',
    shareTitle: 'Gaurav weds Sheetal & Sourav weds Komal',
    shareText: 'You are invited to the weddings of Gaurav & Sheetal and Sourav & Komal — open the invitation:',
  },
};

export default weddingConfig;
