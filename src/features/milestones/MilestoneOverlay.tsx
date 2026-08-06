import { useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { PassportStamp } from './PassportStamp';
import { useMilestones } from './useMilestones';
import { STAMP_HOLD_MS } from '@/lib/motion';

/**
 * Mount point for milestone stamps. Rendered once at the app root.
 */
export function MilestoneOverlay() {
  const { milestone, dismiss } = useMilestones();

  useEffect(() => {
    if (!milestone) return;

    // The thud: the page recoils a few pixels under the stamp and springs back.
    // Applied as a class on the main scroll container rather than plumbed
    // through the router, since the stamp mounts at the app root while the map
    // lives inside a route. The keyframe is disabled by the global
    // prefers-reduced-motion block for free.
    const main = document.getElementById('main-content');
    main?.classList.add('stamp-jolt');
    const jolt = setTimeout(() => main?.classList.remove('stamp-jolt'), 320);
    const hold = setTimeout(dismiss, STAMP_HOLD_MS);

    return () => {
      clearTimeout(jolt);
      clearTimeout(hold);
      main?.classList.remove('stamp-jolt');
    };
  }, [milestone, dismiss]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center">
      <AnimatePresence>
        {milestone && <PassportStamp key={milestone.id} milestone={milestone} />}
      </AnimatePresence>
    </div>
  );
}
