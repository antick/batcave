import {
  BAT_FLAP_DURATION_MS,
  BAT_FLAP_MAX_DELAY_MS,
  BAT_FLAP_MIN_DELAY_MS,
} from './bats';
import { REDUCED_MOTION_MEDIA_QUERY } from './accessibility';

/** One idle timer for the pair; no polling, flight, or per-frame JavaScript. */
export function initBatMotion(container: HTMLElement): () => void {
  const bats = [
    ...container.querySelectorAll<HTMLElement>('[data-hanging-bat]'),
  ];
  const reducedMotion = window.matchMedia(REDUCED_MOTION_MEDIA_QUERY);
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  let flapTimer: ReturnType<typeof setTimeout> | undefined;
  let activeBat: HTMLElement | undefined;

  const canFlap = () =>
    !document.hidden &&
    !reducedMotion.matches &&
    getComputedStyle(container).display !== 'none';

  function stop() {
    clearTimeout(idleTimer);
    clearTimeout(flapTimer);
    idleTimer = undefined;
    flapTimer = undefined;
    activeBat?.removeAttribute('data-flapping');
    activeBat = undefined;
  }

  function schedule() {
    if (!canFlap() || idleTimer !== undefined) return;
    const delay =
      BAT_FLAP_MIN_DELAY_MS +
      Math.random() * (BAT_FLAP_MAX_DELAY_MS - BAT_FLAP_MIN_DELAY_MS);
    idleTimer = setTimeout(() => {
      idleTimer = undefined;
      if (!canFlap()) return;
      const resting = bats.filter((bat) => !bat.matches(':hover'));
      activeBat = resting[Math.floor(Math.random() * resting.length)];
      activeBat?.setAttribute('data-flapping', '');
      flapTimer = setTimeout(() => {
        activeBat?.removeAttribute('data-flapping');
        activeBat = undefined;
        flapTimer = undefined;
        schedule();
      }, BAT_FLAP_DURATION_MS);
    }, delay);
  }

  function sync() {
    stop();
    schedule();
  }

  const themeObserver = new MutationObserver(sync);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  // A resize or print/forced-color change can hide the margin decorations.
  window.addEventListener('resize', sync);
  window.addEventListener('beforeprint', stop);
  window.addEventListener('afterprint', sync);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', sync);
  schedule();

  return () => {
    stop();
    themeObserver.disconnect();
    document.removeEventListener('visibilitychange', sync);
    reducedMotion.removeEventListener('change', sync);
    window.removeEventListener('resize', sync);
    window.removeEventListener('beforeprint', stop);
    window.removeEventListener('afterprint', sync);
    window.removeEventListener('pagehide', stop);
    window.removeEventListener('pageshow', sync);
  };
}
