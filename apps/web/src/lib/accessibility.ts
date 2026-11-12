export const REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion: reduce)';

export function getPreferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia(REDUCED_MOTION_MEDIA_QUERY).matches
    ? 'auto'
    : 'smooth';
}
