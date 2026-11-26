import config from '../config/weddingConfig.js';

const LOCALE = 'en-GB';
const { wedding, venue } = config;

/** All couples from the config (supports one or many). */
export const couples = config.couples ?? [];
export const coupleJoiner = config.coupleJoiner || 'weds';
export const brideFirst = config.nameOrder === 'bride-first';

/** The couple's two names in display order (bride first when nameOrder is 'bride-first'). */
export const orderedNames = (c) => (brideFirst ? [c.brideName, c.groomName] : [c.groomName, c.brideName]);

// Plain-text joiner for titles, calendar entries and alt text ('heart' is drawn, not written).
const textJoiner = coupleJoiner === 'heart' ? 'weds' : coupleJoiner;

/** "Gaurav weds Sheetal" */
export const coupleTitle = (c, joiner = textJoiner) => `${c.groomName} ${joiner} ${c.brideName}`;

/** "Gaurav weds Sheetal & Sourav weds Komal" */
export const allCouplesTitle = (joiner = textJoiner) => couples.map((c) => coupleTitle(c, joiner)).join(' & ');

/** True when at least one couple has their own photo set. */
export const hasCouplePhotos = couples.some((c) => c.photo);

/** "2027-02-12" → Date at local noon (avoids time-zone day shifts). */
export function parseDateOnly(ymd) {
  const [y, m, d] = String(ymd).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12);
}

export function formatEventDate(ymd) {
  const date = parseDateOnly(ymd);
  if (Number.isNaN(date.getTime())) return ymd;
  return new Intl.DateTimeFormat(LOCALE, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export function formatEventDay(ymd) {
  const date = parseDateOnly(ymd);
  if (Number.isNaN(date.getTime())) return { day: '', month: '' };
  return {
    day: new Intl.DateTimeFormat(LOCALE, { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat(LOCALE, { month: 'short' }).format(date),
    weekday: new Intl.DateTimeFormat(LOCALE, { weekday: 'long' }).format(date),
  };
}

export const weddingDate = new Date(wedding.dateTime);

const tzOptions = () => (wedding.timeZone ? { timeZone: wedding.timeZone } : {});

export function formatWeddingDate() {
  if (wedding.displayDate) return wedding.displayDate;
  if (Number.isNaN(weddingDate.getTime())) return '';
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', ...tzOptions(),
  }).format(weddingDate);
}

export function formatWeddingTime() {
  if (wedding.displayTime) return wedding.displayTime;
  if (Number.isNaN(weddingDate.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', ...tzOptions() }).format(weddingDate);
}

/** "14 · 02 · 2027" */
export function formatShortDate() {
  if (Number.isNaN(weddingDate.getTime())) return '';
  const parts = new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric', ...tzOptions() })
    .formatToParts(weddingDate)
    .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});
  return `${parts.day} · ${parts.month} · ${parts.year}`;
}

/** Initials per couple for the wax seal, e.g. ["GS", "SK"]. */
export function getMonograms() {
  return couples.map((c) => `${c.groomName?.[0] ?? ''}${c.brideName?.[0] ?? ''}`);
}

/** Personal greeting from ?guest=Name in the URL (sanitised). */
export function getGuestName() {
  if (!config.welcome.greetGuestFromUrl || typeof window === 'undefined') return '';
  try {
    const raw = new URLSearchParams(window.location.search).get('guest') || '';
    return raw.replace(/[<>{}[\]\\/"'`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 40);
  } catch {
    return '';
  }
}

const mapQuery = () => venue.mapQuery || `${venue.name}, ${venue.address}`;

export function getDirectionsUrl() {
  if (venue.googleMapsUrl) return venue.googleMapsUrl;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery())}`;
}

export function getMapEmbedUrl() {
  if (venue.mapEmbedUrl) return venue.mapEmbedUrl;
  return `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery())}&z=15&output=embed`;
}

const toCalStamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function getGoogleCalendarUrl() {
  if (Number.isNaN(weddingDate.getTime())) return '';
  const end = new Date(weddingDate.getTime() + (wedding.durationHours || 4) * 3600 * 1000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Wedding: ${allCouplesTitle()}`,
    dates: `${toCalStamp(weddingDate)}/${toCalStamp(end)}`,
    details: config.invitation.message,
    location: `${venue.name}, ${venue.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getShareUrl() {
  if (config.meta.siteUrl) return config.meta.siteUrl;
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.searchParams.delete('guest'); // don't forward someone else's personal greeting
  return url.toString();
}
