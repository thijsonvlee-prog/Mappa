import type { Transition } from 'motion/react';

/**
 * Mappa's motion vocabulary.
 *
 * Every animation in the app uses one of these five transitions, so the whole
 * interface moves like a single physical object rather than a pile of
 * unrelated effects. If a new animation doesn't fit one of these, it probably
 * doesn't belong.
 */

/** Fast, clear overshoot. Marking a country, chips, nav icons. */
export const springPop: Transition = {
  type: 'spring',
  stiffness: 520,
  damping: 16,
};

/** Heavy, decisive thud. The passport stamp landing. */
export const springSlam: Transition = {
  type: 'spring',
  stiffness: 700,
  damping: 22,
  mass: 1.4,
};

/** Smooth, no overshoot. Sheets, panels, layout shifts. */
export const springGlide: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
};

/** Loose and oscillating, so the compass needle reads as magnetic. */
export const needleSwing: Transition = {
  type: 'spring',
  stiffness: 90,
  damping: 9,
};

/** Decelerating soak. Ink spreading into paper. */
export const inkSpread: Transition = {
  type: 'tween',
  duration: 0.45,
  ease: [0.22, 0.61, 0.36, 1],
};

/** How long the ink bloom takes, in ms — for timers that must outlast it. */
export const INK_SPREAD_MS = 450;

/** How long a passport stamp stays on screen before fading, in ms. */
export const STAMP_HOLD_MS = 1200;
