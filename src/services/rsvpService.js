/**
 * RSVP service — the only place that knows where responses go.
 * Swap `mode` in weddingConfig.rsvp to send responses somewhere else;
 * components only ever call submitRsvp() / getSavedRsvp().
 */
import config from '../config/weddingConfig.js';

const { rsvp } = config;

function storage() {
  try {
    return window.localStorage;
  } catch {
    return null; // private mode / blocked storage
  }
}

export function getSavedRsvp() {
  try {
    const raw = storage()?.getItem(rsvp.storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocal(entry) {
  try {
    storage()?.setItem(rsvp.storageKey, JSON.stringify(entry));
  } catch {
    /* storage unavailable — the remote submission (if any) still counts */
  }
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`RSVP endpoint responded ${res.status}`);
  return res;
}

/**
 * @param {{name: string, attendees: number, attending: 'yes'|'no', message?: string}} data
 * @returns {Promise<object>} the stored entry
 */
export async function submitRsvp(data) {
  const entry = {
    name: data.name.trim(),
    attending: data.attending,
    attendees: data.attending === 'yes' ? Number(data.attendees) || 1 : 0,
    message: (data.message || '').trim(),
    submittedAt: new Date().toISOString(),
  };

  const needsEndpoint = rsvp.mode !== 'local';
  if (needsEndpoint && !rsvp.endpoint) {
    console.warn(`[RSVP] mode "${rsvp.mode}" needs rsvp.endpoint in weddingConfig.js — saving locally only.`);
  } else if (rsvp.mode === 'formspree' || rsvp.mode === 'webhook') {
    await postJson(rsvp.endpoint, entry);
  } else if (rsvp.mode === 'google-sheets') {
    // Apps Script web apps don't send CORS headers; a simple no-cors POST still delivers the data.
    await fetch(rsvp.endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(entry),
    });
  }

  saveLocal(entry);
  return entry;
}
