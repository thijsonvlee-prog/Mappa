import { m, useReducedMotion } from 'motion/react';
import { needleSwing } from '@/lib/motion';

interface MapCompassProps {
  /**
   * Degrees clockwise from north. The needle swings here and wobbles to rest,
   * pointing at the country the user most recently marked. Null points north.
   */
  bearing?: number | null;
}

/**
 * Compass rose in the top-right of the map.
 *
 * The rose itself is fixed decoration, but the needle is live: mark a country
 * and it swings round to point at it, overshoots, and settles like a real
 * magnetic needle. Users don't expect the decoration to be alive, which is
 * exactly why it lands.
 */
export function MapCompass({ bearing = null }: MapCompassProps) {
  const reduceMotion = useReducedMotion();
  const target = bearing ?? 0;

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        width: '60px',
        height: '60px',
        pointerEvents: 'none',
        opacity: 0.3,
      }}
    >
      <svg
        viewBox="0 0 60 60"
        width="100%"
        height="100%"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
      >
        {/* Outer circle */}
        <circle cx="30" cy="30" r="28" fill="none" stroke="var(--color-foreground-muted)" strokeWidth="0.5" />

        {/* Cardinal points */}
        <line x1="30" y1="8" x2="30" y2="14" stroke="var(--color-foreground-muted)" strokeWidth="1" />
        <line x1="52" y1="30" x2="46" y2="30" stroke="var(--color-foreground-muted)" strokeWidth="1" />
        <line x1="30" y1="52" x2="30" y2="46" stroke="var(--color-foreground-muted)" strokeWidth="1" />
        <line x1="8" y1="30" x2="14" y2="30" stroke="var(--color-foreground-muted)" strokeWidth="1" />

        {/* Text labels */}
        <text x="30" y="22" textAnchor="middle" fontSize="8" fill="var(--color-foreground-muted)" fontWeight="500">
          N
        </text>
        <text x="40" y="33" textAnchor="middle" fontSize="7" fill="var(--color-foreground-muted)" fontWeight="400">
          O
        </text>
        <text x="30" y="43" textAnchor="middle" fontSize="8" fill="var(--color-foreground-muted)" fontWeight="500">
          Z
        </text>
        <text x="20" y="33" textAnchor="middle" fontSize="7" fill="var(--color-foreground-muted)" fontWeight="400">
          W
        </text>

        {/* The live needle */}
        <m.g
          style={{ transformOrigin: '30px 30px' }}
          initial={{ rotate: 0 }}
          animate={{ rotate: target }}
          transition={reduceMotion ? { duration: 0 } : needleSwing}
        >
          <path d="M30 16 L34 30 L30 34 L26 30 Z" fill="var(--color-primary)" opacity="0.9" />
          <path d="M30 44 L26 30 L30 26 L34 30 Z" fill="var(--color-foreground-muted)" opacity="0.6" />
        </m.g>

        {/* Center dot */}
        <circle cx="30" cy="30" r="2" fill="var(--color-foreground-muted)" />
      </svg>
    </div>
  );
}
