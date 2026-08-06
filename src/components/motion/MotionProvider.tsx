import type { ReactNode } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import { springGlide } from '@/lib/motion';

interface MotionProviderProps {
  children: ReactNode;
}

/**
 * Single motion root for the app.
 *
 * `LazyMotion` + `domAnimation` ships roughly half the bundle of the full
 * `motion` component set, and `strict` makes the heavy `motion.*` components
 * throw on use — so the full bundle can never sneak back in via an import.
 * Everything downstream uses the lightweight `m.*` components instead.
 *
 * `reducedMotion="user"` makes every animation below honour
 * `prefers-reduced-motion` automatically, including the JS-driven ones that
 * the CSS block in globals.css cannot reach.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={springGlide}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
