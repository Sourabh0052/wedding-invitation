import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, MapPin, Navigation } from 'lucide-react';
import config from '../config/weddingConfig.js';
import { getDirectionsUrl, getMapEmbedUrl } from '../utils/wedding.js';
import SectionHeading from './ui/SectionHeading.jsx';
import Reveal from './ui/Reveal.jsx';
import Button from './ui/Button.jsx';
import Blossom from './ui/Blossom.jsx';
import FloralBranch from './ui/FloralBranch.jsx';
import { C } from '../theme.js';

/** Screen 6 — venue details with an embedded Google Map. */
export default function Location() {
  const { venue } = config;
  const [copied, setCopied] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${venue.name}, ${venue.address}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy the address:', `${venue.name}, ${venue.address}`);
    }
  };

  return (
    <section id="location" className="card-paper relative overflow-hidden px-4 py-24 sm:px-6">
      <FloralBranch className="-right-8 bottom-0 hidden sm:block" width={280} flip />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow="Where" title="The Venue" subtitle="We can’t wait to welcome you" />

        <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="glass-card gold-frame flex flex-col items-center justify-center rounded-[2rem] px-6 py-10 text-center">
            <motion.div
              className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-leaf-300 to-leaf-600 shadow-[0_16px_30px_-12px_rgba(70,138,37,0.6)]"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <MapPin className="h-8 w-8 text-white" aria-hidden="true" />
            </motion.div>
            <h3 className="mt-6 font-serif text-3xl font-semibold text-plum-800">{venue.name}</h3>
            <div className="my-4 flex items-center gap-2" aria-hidden="true">
              <span className="h-[2px] w-10 rounded-full bg-sindoor-400" />
              <Blossom size={18} color={C.ornament[0]} center={C.ornament[1]} />
              <span className="h-[2px] w-10 rounded-full bg-leaf-400" />
            </div>
            <address className="max-w-xs font-serif text-lg leading-relaxed text-plum-600 not-italic">{venue.address}</address>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href={getDirectionsUrl()} icon={Navigation}>
                Get Directions
              </Button>
              <Button variant="ghost" onClick={copyAddress} icon={copied ? Check : Copy} aria-live="polite">
                {copied ? 'Copied!' : 'Copy Address'}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="relative min-h-[340px] overflow-hidden rounded-[2rem] border-4 border-marigold-300 shadow-gold sm:min-h-[420px]">
            {!mapLoaded && (
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-marigold-50 to-leaf-50">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                  <Blossom size={40} />
                </motion.div>
              </div>
            )}
            <iframe
              title={`Map showing ${venue.name}`}
              src={getMapEmbedUrl()}
              className="absolute inset-0 h-full w-full"
              style={{ border: 0, filter: 'saturate(0.9) sepia(0.08)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              onLoad={() => setMapLoaded(true)}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
