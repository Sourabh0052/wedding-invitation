import { useEffect, useState } from 'react';

function diff(target) {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
    isOver: ms === 0,
  };
}

/** Live countdown to `targetDate`, ticking once per second (aligned to the wall clock). */
export default function useCountdown(targetDate) {
  const target = targetDate instanceof Date ? targetDate.getTime() : new Date(targetDate).getTime();
  const [state, setState] = useState(() => diff(target));

  useEffect(() => {
    if (Number.isNaN(target)) return undefined;
    let timer;
    const tick = () => {
      const next = diff(target);
      setState(next);
      if (!next.isOver) timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    tick();
    return () => clearTimeout(timer);
  }, [target]);

  return state;
}
