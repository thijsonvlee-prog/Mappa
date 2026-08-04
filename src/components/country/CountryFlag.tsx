import { cn } from '@/lib/utils';

const sizeClasses = {
  sm: 'text-base',
  md: 'text-2xl',
  lg: 'text-4xl',
} as const;

interface CountryFlagProps {
  flag: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CountryFlag({ flag, size = 'md', className }: CountryFlagProps) {
  return (
    <span
      role="img"
      aria-label="country flag"
      className={cn('inline-flex items-center justify-center leading-none', sizeClasses[size], className)}
    >
      {flag}
    </span>
  );
}
