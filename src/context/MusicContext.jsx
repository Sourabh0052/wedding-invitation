import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import config from '../config/weddingConfig.js';

const MusicContext = createContext(null);
const musicCfg = config.media.music;

/**
 * Owns the single <audio> element for the whole app so music continues
 * seamlessly between sections.
 *
 *  start()   – call from a user gesture (the "Open Invitation" tap) to unlock audio
 *  toggle()  – play / pause button
 *  suspend() – fade out while the wedding film plays with sound
 *  resume()  – fade back in afterwards (only if the guest hadn't paused it)
 */
export function MusicProvider({ children }) {
  const audioRef = useRef(null);
  const fadeRef = useRef(0);
  const startedRef = useRef(false);
  const userPausedRef = useRef(false);
  const suspendedRef = useRef(false);
  const hiddenPausedRef = useRef(false);

  const [available, setAvailable] = useState(Boolean(musicCfg.enabled && musicCfg.src));
  const [started, setStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(() => Math.min(1, Math.max(0, musicCfg.volume ?? 0.5)));
  // iOS ignores audio.volume — hide the slider there instead of showing a dead control.
  const [volumeSupported, setVolumeSupported] = useState(true);

  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  const fadeTo = useCallback((target, ms, onDone) => {
    const a = audioRef.current;
    if (!a) return;
    cancelAnimationFrame(fadeRef.current);
    const from = a.volume;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      a.volume = Math.min(1, Math.max(0, from + (target - from) * k));
      if (k < 1) fadeRef.current = requestAnimationFrame(step);
      else onDone?.();
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  const playWithFade = useCallback(async () => {
    const a = audioRef.current;
    if (!a || !available) return;
    try {
      if (a.paused) a.volume = 0;
      await a.play();
      fadeTo(volumeRef.current, 1400);
    } catch {
      /* autoplay blocked — the music button lets the guest start it */
    }
  }, [available, fadeTo]);

  const pauseWithFade = useCallback(() => {
    const a = audioRef.current;
    if (!a || a.paused) return;
    fadeTo(0, 600, () => a.pause());
  }, [fadeTo]);

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStarted(true);
    userPausedRef.current = false;
    if (!suspendedRef.current) playWithFade();
  }, [playWithFade]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    startedRef.current = true;
    setStarted(true);
    if (a.paused) {
      userPausedRef.current = false;
      playWithFade();
    } else {
      userPausedRef.current = true;
      pauseWithFade();
    }
  }, [playWithFade, pauseWithFade]);

  const suspend = useCallback(() => {
    if (suspendedRef.current) return;
    suspendedRef.current = true;
    pauseWithFade();
  }, [pauseWithFade]);

  const resume = useCallback(() => {
    if (!suspendedRef.current) return;
    suspendedRef.current = false;
    if (startedRef.current && !userPausedRef.current) playWithFade();
  }, [playWithFade]);

  const setVolume = useCallback((v) => {
    const next = Math.min(1, Math.max(0, v));
    setVolumeState(next);
    cancelAnimationFrame(fadeRef.current);
    if (audioRef.current) audioRef.current.volume = next;
  }, []);

  // Detect whether volume can be changed (it can't on iOS Safari).
  useEffect(() => {
    const probe = new Audio();
    probe.volume = 0.5;
    setVolumeSupported(Math.abs(probe.volume - 0.5) < 0.01);
  }, []);

  // Pause when the tab/app goes to the background; resume when it returns.
  useEffect(() => {
    const onVisibility = () => {
      const a = audioRef.current;
      if (!a) return;
      if (document.hidden && !a.paused) {
        hiddenPausedRef.current = true;
        a.pause();
      } else if (!document.hidden && hiddenPausedRef.current) {
        hiddenPausedRef.current = false;
        if (!suspendedRef.current && !userPausedRef.current) playWithFade();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [playWithFade]);

  useEffect(() => () => cancelAnimationFrame(fadeRef.current), []);

  const value = useMemo(
    () => ({ available, started, isPlaying, volume, volumeSupported, start, toggle, suspend, resume, setVolume }),
    [available, started, isPlaying, volume, volumeSupported, start, toggle, suspend, resume, setVolume],
  );

  return (
    <MusicContext.Provider value={value}>
      {available && (
        <audio
          ref={audioRef}
          src={musicCfg.src}
          loop
          preload="none"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            console.warn(`[Music] Could not load ${musicCfg.src} — music controls hidden.`);
            setAvailable(false);
            setIsPlaying(false);
          }}
        />
      )}
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used inside <MusicProvider>');
  return ctx;
}
