import { Geography } from '@vnedyalk0v/react19-simple-maps';
import { m, useReducedMotion } from 'motion/react';

interface MapInvitationProps {
  geography: any;
}

/**
 * Shown only while the atlas is completely empty: one country breathes gently
 * to suggest where to start. It stops for good the moment anything is marked,
 * so it can never become a tic.
 *
 * The pulse is carried by the stroke rather than the fill, because the
 * invitation is often a small country — the Netherlands is a couple of pixels
 * of fill at world zoom, but its outline still reads.
 *
 * Safe to animate as a second node because it exists only in the zero-country
 * state, where nothing else on the map is moving.
 */
export function MapInvitation({ geography }: MapInvitationProps) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <m.g
      style={{ pointerEvents: 'none' }}
      animate={{ opacity: [0.25, 1, 0.25] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Geography
        geography={geography}
        style={{
          default: {
            fill: 'var(--color-primary)',
            fillOpacity: 0.35,
            stroke: 'var(--color-primary)',
            strokeWidth: 2.5,
            strokeLinejoin: 'round',
            paintOrder: 'stroke',
            outline: 'none',
          },
          hover: { outline: 'none' },
          pressed: { outline: 'none' },
        }}
      />
    </m.g>
  );
}
