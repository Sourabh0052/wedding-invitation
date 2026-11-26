import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Maximize, Minimize, Pause, Play, RotateCcw, SkipForward, Volume2, VolumeX } from 'lucide-react';
import config from '../config/weddingConfig.js';
import { useMusic } from '../context/MusicContext.jsx';
import OmSeal from './ui/OmSeal.jsx';
import Blossom from './ui/Blossom.jsx';
import CoupleNames from './ui/CoupleNames.jsx';

const fmt = (s) => {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

const IconButton = ({ label, onClick, children, className = '' }) => (
  <motion.button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.92 }}
    className={`grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25 ${className}`}
  >
    {children}
  </motion.button>
);

/** Screen 2 — full-screen wedding film with custom controls. */
export default function WeddingVideo({ onFinish }) {
  const cfg = config.media.video;
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hideTimer = useRef();
  const { suspend, resume } = useMusic();

  const [status, setStatus] = useState(cfg.src ? 'loading' : 'error'); // loading | ready | error
  const [buffering, setBuffering] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [soundHint, setSoundHint] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Try to start with sound (the "Open Invitation" tap counts as a gesture).
  // If the browser refuses, start muted and offer a "tap for sound" hint.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || status === 'error') return;
    v.muted = false;
    v.play()?.catch(() => {
      v.muted = true;
      setMuted(true);
      setSoundHint(true);
      v.play()?.catch(() => setPlaying(false));
    });
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Background music steps aside whenever the film is audible.
  useEffect(() => {
    if (playing && !muted) suspend();
    else resume();
  }, [playing, muted, suspend, resume]);
  useEffect(() => () => resume(), [resume]);

  // Auto-hide controls while playing.
  const pokeControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 2800);
  }, []);
  useEffect(() => {
    if (!playing) {
      clearTimeout(hideTimer.current);
      setControlsVisible(true);
    } else pokeControls();
    return () => clearTimeout(hideTimer.current);
  }, [playing, pokeControls]);

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      setEnded(false);
      v.play()?.catch(() => {});
    } else v.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    setSoundHint(false);
  }, []);

  const replay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setEnded(false);
    v.play()?.catch(() => {});
  }, []);

  const finish = useCallback(() => {
    videoRef.current?.pause();
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    onFinish();
  }, [onFinish]);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    const v = videoRef.current;
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    else if (el?.requestFullscreen) el.requestFullscreen().catch(() => {});
    else v?.webkitEnterFullscreen?.(); // iOS Safari
  }, []);

  const seek = (e) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Number(e.target.value);
    setTime(v.currentTime);
  };

  // Keyboard: space/k = play, m = mute, ←/→ = seek, f = fullscreen, esc/s = skip
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, select')) return;
      const v = videoRef.current;
      if (!v) return;
      const key = e.key.toLowerCase();
      if (key === ' ' || key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (key === 'm') toggleMute();
      else if (key === 'f') toggleFullscreen();
      else if (key === 'arrowright') v.currentTime = Math.min(v.duration || 0, v.currentTime + 5);
      else if (key === 'arrowleft') v.currentTime = Math.max(0, v.currentTime - 5);
      else if (key === 's' || (key === 'escape' && !document.fullscreenElement)) finish();
      pokeControls();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, toggleMute, toggleFullscreen, finish, pokeControls]);

  const progress = duration ? (time / duration) * 100 : 0;
  const showChrome = controlsVisible || !playing;

  return (
    <motion.section
      ref={containerRef}
      className="fixed inset-0 z-40 overflow-hidden bg-plum-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      transition={{ duration: 1 }}
      onPointerMove={pokeControls}
      onTouchStart={pokeControls}
      style={{ cursor: showChrome ? 'auto' : 'none' }}
      aria-label="Wedding invitation film"
    >
      {/* blurred backdrop fills the letterbox when fit = contain */}
      <img
        src={cfg.poster || cfg.fallbackImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
      />

      {status !== 'error' ? (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full ${cfg.fit === 'cover' ? 'object-cover' : 'object-contain'}`}
          src={cfg.src}
          poster={cfg.poster}
          playsInline
          webkit-playsinline="true"
          preload="auto"
          disablePictureInPicture
          onClick={togglePlay}
          onLoadedMetadata={(e) => {
            setDuration(e.currentTarget.duration);
            setStatus('ready');
          }}
          onDurationChange={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onPlaying={() => setBuffering(false)}
          onWaiting={() => setBuffering(true)}
          onCanPlay={() => setBuffering(false)}
          onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
          onEnded={() => {
            setEnded(true);
            setPlaying(false);
          }}
          onError={() => {
            console.warn(`[Video] Could not load ${cfg.src} — showing fallback image.`);
            setStatus('error');
            setPlaying(false);
          }}
        />
      ) : (
        <FallbackScene image={cfg.fallbackImage} onContinue={finish} />
      )}

      {/* cinematic vignette + letterbox gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(51,24,39,0.55)_100%)]" />

      {/* loading spinner */}
      <AnimatePresence>
        {status !== 'error' && buffering && !ended && (
          <motion.div
            className="pointer-events-none absolute inset-0 grid place-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}>
              <Blossom size={56} color="#f8c27a" center="#e0943e" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* top bar */}
      <AnimatePresence>
        {showChrome && status !== 'error' && (
          <motion.div
            className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-plum-900/70 to-transparent px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-10 sm:px-8"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <div className="flex items-center gap-3 text-white">
              <OmSeal size={34} />
              <div>
                <p className="font-serif text-[0.65rem] tracking-[0.35em] text-gold-200 uppercase">Our story</p>
                <CoupleNames size="xs" light align="start" className="leading-none" />
              </div>
            </div>
            <motion.button
              type="button"
              onClick={finish}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/25"
            >
              Skip Video <SkipForward className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* tap-for-sound hint (when the browser forced muted autoplay) */}
      <AnimatePresence>
        {soundHint && muted && !ended && status !== 'error' && (
          <motion.button
            type="button"
            onClick={toggleMute}
            className="absolute top-24 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-ivory/90 px-5 py-2.5 text-sm font-semibold text-plum-700 shadow-dreamy"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: [0, -4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ y: { duration: 1.6, repeat: Infinity } }}
          >
            <Volume2 className="h-4 w-4" aria-hidden="true" /> Tap for sound
          </motion.button>
        )}
      </AnimatePresence>

      {/* bottom controls */}
      <AnimatePresence>
        {showChrome && status !== 'error' && !ended && (
          <motion.div
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum-900/80 to-transparent px-4 pt-12 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={time}
              onChange={seek}
              aria-label="Seek"
              className="range-sakura w-full"
              style={{ '--fill': `${progress}%` }}
            />
            <div className="mt-2 flex items-center gap-2 sm:gap-3">
              <IconButton label={playing ? 'Pause' : 'Play'} onClick={togglePlay}>
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-px" />}
              </IconButton>
              <IconButton label="Replay video" onClick={replay}>
                <RotateCcw className="h-5 w-5" />
              </IconButton>
              <IconButton label={muted ? 'Unmute' : 'Mute'} onClick={toggleMute}>
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </IconButton>
              <span className="ml-1 font-sans text-xs text-white/80 tabular-nums">
                {fmt(time)} / {fmt(duration)}
              </span>
              <IconButton label={fullscreen ? 'Exit full screen' : 'Full screen'} onClick={toggleFullscreen} className="ml-auto">
                {fullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </IconButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* end card */}
      <AnimatePresence>
        {ended && (
          <motion.div
            className="absolute inset-0 grid place-items-center bg-plum-900/50 px-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card gold-frame w-full max-w-sm rounded-3xl px-8 py-10 text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <OmSeal size={40} />
              <p className="mt-4 font-script text-4xl text-rose-gradient">With love,</p>
              <CoupleNames size="sm" className="mt-2" />
              <div className="mt-6 flex flex-col gap-3">
                <motion.button
                  type="button"
                  onClick={finish}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sakura-500 to-gold-400 px-6 py-3 font-semibold text-white shadow-dreamy"
                >
                  Open the Invitation <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={replay}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-400/60 px-6 py-3 font-semibold text-plum-700"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" /> Replay Video
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/** Shown when the film can't load: a slow Ken Burns pan over the fallback image. */
function FallbackScene({ image, onContinue }) {
  return (
    <div className="absolute inset-0">
      {image && (
        <motion.img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.15 }}
          transition={{ duration: 14, ease: 'linear' }}
        />
      )}
      <div className="absolute inset-0 bg-ivory/30" />
      <div className="absolute inset-0 grid place-items-center px-6">
        <motion.div
          className="glass-card gold-frame max-w-sm rounded-3xl px-8 py-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <OmSeal size={40} />
          <CoupleNames size="md" className="mt-4" />
          <p className="mt-2 font-serif text-plum-600 italic">Our invitation film couldn’t load on this connection.</p>
          <motion.button
            type="button"
            onClick={onContinue}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sakura-500 to-gold-400 px-6 py-3 font-semibold text-white shadow-dreamy"
          >
            Continue to Invitation <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
