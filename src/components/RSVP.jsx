import { useId, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, HeartCrack, LoaderCircle, Minus, PenLine, Plus, Send } from 'lucide-react';
import config from '../config/weddingConfig.js';
import { submitRsvp, getSavedRsvp } from '../services/rsvpService.js';
import { formatEventDate, getGuestName } from '../utils/wedding.js';
import SectionHeading from './ui/SectionHeading.jsx';
import Reveal from './ui/Reveal.jsx';
import Button from './ui/Button.jsx';
import Petal from './ui/Petal.jsx';
import FloralCorner from './ui/FloralCorner.jsx';
import { C } from '../theme.js';

const inputCls =
  'w-full rounded-2xl border-2 border-marigold-200 bg-white/90 px-4 py-3 font-sans text-base text-plum-800 placeholder:text-plum-500/50 transition focus:border-marigold-500 focus:ring-4 focus:ring-marigold-200/70 focus:outline-none';

const BURST = C.petals;

function PetalBurst() {
  const petals = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 360,
        y: -Math.random() * 220 - 60,
        r: Math.random() * 540,
        s: 10 + Math.random() * 12,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute top-1/3 left-1/2" aria-hidden="true">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 260], opacity: [1, 1, 0], rotate: p.r, scale: 1 }}
          transition={{ duration: 2.4, ease: 'easeOut' }}
        >
          <Petal size={p.s} {...BURST[p.id % BURST.length]} />
        </motion.div>
      ))}
    </div>
  );
}

/** Screen 7 — RSVP form (local storage by default, pluggable backend via rsvpService). */
export default function RSVP() {
  const { rsvp } = config;
  const id = useId();
  const saved = useMemo(getSavedRsvp, []);

  const [form, setForm] = useState(() => ({
    name: saved?.name ?? getGuestName(),
    attendees: saved?.attendees || 1,
    attending: saved?.attending ?? 'yes',
    message: saved?.message ?? '',
  }));
  const [status, setStatus] = useState(saved ? 'done' : 'idle'); // idle | sending | done | error
  const [result, setResult] = useState(saved);
  const [errors, setErrors] = useState({});

  if (!rsvp.enabled) return null;

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };
  const setAttendees = (n) => setForm((f) => ({ ...f, attendees: Math.min(rsvp.maxAttendees, Math.max(1, n)) }));

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Please tell us your name.';
    if (form.attending === 'yes' && (form.attendees < 1 || form.attendees > rsvp.maxAttendees))
      next.attendees = `Between 1 and ${rsvp.maxAttendees} guests, please.`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      const entry = await submitRsvp(form);
      setResult(entry);
      setStatus('done');
    } catch (err) {
      console.error('[RSVP]', err);
      setStatus('error');
    }
  };

  return (
    <section id="rsvp" className="relative overflow-hidden bg-gradient-to-b from-leaf-50 via-marigold-50 to-sindoor-50 px-4 py-24 sm:px-6">
      <div className="relative mx-auto max-w-2xl">
        <SectionHeading
          eyebrow="Kindly reply"
          title="RSVP"
          subtitle={rsvp.deadline ? `Please respond by ${formatEventDate(rsvp.deadline)}` : 'We would love to know if you can join us'}
        />

        <Reveal className="glass-card gold-frame relative mt-12 overflow-hidden rounded-[2rem] px-5 py-10 sm:px-10">
          <FloralCorner corner="tr" className="w-20 sm:w-32" />
          <FloralCorner corner="bl" className="w-20 sm:w-32" />
          <AnimatePresence mode="wait" initial={false}>
            {status === 'done' && result ? (
              <motion.div
                key="thanks"
                className="relative py-6 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                role="status"
              >
                {result.attending === 'yes' && <PetalBurst />}
                <motion.div
                  className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-marigold-400 to-sindoor-500 shadow-dreamy"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  {result.attending === 'yes' ? (
                    <Heart className="h-8 w-8 fill-white text-white" aria-hidden="true" />
                  ) : (
                    <HeartCrack className="h-8 w-8 text-white" aria-hidden="true" />
                  )}
                </motion.div>
                <p className="mt-6 font-script text-5xl text-rose-gradient">Thank you, {result.name.split(' ')[0]}!</p>
                <p className="mx-auto mt-3 max-w-md font-serif text-xl text-plum-700 italic">
                  {result.attending === 'yes'
                    ? `We’re overjoyed — ${result.attendees === 1 ? 'one seat is' : `${result.attendees} seats are`} waiting for you.`
                    : 'You will be missed dearly. Thank you for your blessings.'}
                </p>
                <Button variant="ghost" icon={PenLine} className="mt-8" onClick={() => setStatus('idle')}>
                  Edit my response
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                noValidate
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div>
                  <label htmlFor={`${id}-name`} className="mb-2 block font-serif text-lg font-semibold text-plum-700">
                    Your name
                  </label>
                  <input
                    id={`${id}-name`}
                    className={inputCls}
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Full name"
                    autoComplete="name"
                    maxLength={80}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${id}-name-err` : undefined}
                  />
                  {errors.name && (
                    <p id={`${id}-name-err`} className="mt-1.5 text-sm text-sakura-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                <fieldset>
                  <legend className="mb-2 block font-serif text-lg font-semibold text-plum-700">Will you attend?</legend>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'yes', label: 'Joyfully accept', Icon: Heart },
                      { value: 'no', label: 'Regretfully decline', Icon: HeartCrack },
                    ].map(({ value, label, Icon }) => {
                      const active = form.attending === value;
                      return (
                        <label
                          key={value}
                          className={`relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center transition ${
                            active
                              ? (value === 'yes' ? 'border-leaf-400 bg-gradient-to-br from-leaf-50 to-marigold-50' : 'border-sindoor-300 bg-gradient-to-br from-sindoor-50 to-marigold-50') + ' shadow-dreamy'
                              : 'border-marigold-200 bg-white/80 hover:border-marigold-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="attending"
                            value={value}
                            checked={active}
                            onChange={update('attending')}
                            className="sr-only"
                          />
                          <motion.span animate={active ? { scale: [1, 1.25, 1] } : { scale: 1 }} transition={{ duration: 0.4 }}>
                            <Icon
                              className={`h-6 w-6 ${active ? (value === 'yes' ? 'fill-sindoor-500 text-sindoor-600' : 'text-sindoor-500') : 'text-plum-500/60'}`}
                              aria-hidden="true"
                            />
                          </motion.span>
                          <span className={`font-sans text-sm font-semibold ${active ? 'text-plum-800' : 'text-plum-600'}`}>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <AnimatePresence initial={false}>
                  {form.attending === 'yes' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label htmlFor={`${id}-count`} className="mb-2 block font-serif text-lg font-semibold text-plum-700">
                        Number of attendees
                      </label>
                      <div className="flex items-center gap-3">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setAttendees(form.attendees - 1)}
                          disabled={form.attendees <= 1}
                          className="grid h-12 w-12 place-items-center rounded-full border-2 border-marigold-300 bg-marigold-50 text-sindoor-600 disabled:opacity-40"
                          aria-label="One fewer guest"
                        >
                          <Minus className="h-5 w-5" />
                        </motion.button>
                        <input
                          id={`${id}-count`}
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={rsvp.maxAttendees}
                          value={form.attendees}
                          onChange={(e) => setAttendees(Number(e.target.value) || 1)}
                          className={`${inputCls} w-20 text-center text-xl font-semibold`}
                        />
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setAttendees(form.attendees + 1)}
                          disabled={form.attendees >= rsvp.maxAttendees}
                          className="grid h-12 w-12 place-items-center rounded-full border-2 border-marigold-300 bg-marigold-50 text-sindoor-600 disabled:opacity-40"
                          aria-label="One more guest"
                        >
                          <Plus className="h-5 w-5" />
                        </motion.button>
                        <span className="text-sm text-plum-500">including you (max {rsvp.maxAttendees})</span>
                      </div>
                      {errors.attendees && <p className="mt-1.5 text-sm text-sakura-600">{errors.attendees}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label htmlFor={`${id}-msg`} className="mb-2 block font-serif text-lg font-semibold text-plum-700">
                    A note for the couple <span className="font-normal text-plum-500 italic">(optional)</span>
                  </label>
                  <textarea
                    id={`${id}-msg`}
                    rows={4}
                    maxLength={500}
                    className={`${inputCls} resize-none`}
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Wishes, dietary needs, a favourite song for the Sangeet…"
                  />
                </div>

                {status === 'error' && (
                  <p className="rounded-2xl bg-sakura-50 px-4 py-3 text-sm text-sakura-700" role="alert">
                    We couldn’t send your reply just now. Please check your connection and try again.
                  </p>
                )}

                <div className="pt-2 text-center">
                  <Button type="submit" disabled={status === 'sending'} icon={status === 'sending' ? LoaderCircle : Send} className="min-w-52 py-3.5 text-base" iconClassName={status === 'sending' ? 'animate-spin' : ''}>
                    {status === 'sending' ? 'Sending…' : 'Send RSVP'}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
