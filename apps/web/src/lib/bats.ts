/** Open wings still fit inside the side gutters at the desktop breakpoint. */
export const HANGING_BATS = [
  { side: 'left', size: 72, drop: 160 },
  { side: 'right', size: 64, drop: 256 },
] as const;

export const BAT_FLAP_MIN_DELAY_MS = 14_000;
export const BAT_FLAP_MAX_DELAY_MS = 32_000;
export const BAT_FLAP_DURATION_MS = 1_200;
