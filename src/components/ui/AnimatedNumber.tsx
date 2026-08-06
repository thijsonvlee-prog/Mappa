import { useEffect } from 'react';
import { m, useSpring, useTransform, useReducedMotion } from 'motion/react';

interface AnimatedNumberProps {
  value: number;
  /** Decimal places to show. Defaults to whole numbers. */
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A number that rolls up to its new value like a mechanical counter.
 *
 * The spring drives the DOM directly through a MotionValue child, so counting
 * from 0 to 195 costs zero React re-renders.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  className,
  style,
}: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion();

  const spring = useSpring(value, { stiffness: 90, damping: 20 });
  const text = useTransform(spring, (latest) => latest.toFixed(decimals));

  useEffect(() => {
    if (reduceMotion) {
      spring.jump(value);
      return;
    }
    spring.set(value);
  }, [spring, value, reduceMotion]);

  return (
    <m.span className={className} style={style}>
      {text}
    </m.span>
  );
}
