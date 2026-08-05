import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  max: number;
  radius?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export function CircularProgress({
  value,
  max,
  radius = 40,
  strokeWidth = 3,
  className,
  children,
}: CircularProgressProps) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const diameter = (radius + strokeWidth) * 2;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={diameter} height={diameter} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="transparent"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="transparent"
          stroke="var(--color-visited)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      {children && <div className="absolute">{children}</div>}
    </div>
  );
}
