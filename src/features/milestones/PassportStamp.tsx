import { m, useReducedMotion } from 'motion/react';
import { springSlam } from '@/lib/motion';
import type { Milestone } from './detectMilestone';

interface PassportStampProps {
  milestone: Milestone;
}

function today(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
}

/**
 * A passport stamp pressed onto the page when the user crosses a milestone.
 *
 * Travel's own artifact rather than the stock celebration: it lands rotated
 * and oversized, overshoots down past its resting size, and settles at a tilt,
 * the way a rubber stamp actually hits paper.
 */
export function PassportStamp({ milestone }: PassportStampProps) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      className="pointer-events-none select-none"
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 1.7, rotate: 25 }
      }
      animate={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, scale: [1.7, 0.92, 1], rotate: -8 }
      }
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      transition={reduceMotion ? { duration: 0 } : springSlam}
      style={{
        color: 'var(--color-planned)',
        opacity: 0.85,
      }}
    >
      <div
        className="relative px-8 py-5"
        style={{
          border: '3px solid currentColor',
          borderRadius: '10px',
          // The inner rule is what makes it read as a stamp rather than a card.
          boxShadow: 'inset 0 0 0 1.5px currentColor',
        }}
      >
        <div
          className="text-center text-xl font-bold leading-tight tracking-[0.12em]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {milestone.label}
        </div>
        <div
          className="mt-1.5 text-center text-[10px] tracking-[0.3em]"
          style={{ fontFamily: 'var(--font-mono)', opacity: 0.8 }}
        >
          MAPPA · {today()}
        </div>
      </div>
    </m.div>
  );
}
