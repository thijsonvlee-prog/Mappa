import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  className?: string;
}

function ControlButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'flex items-center justify-center size-9',
        'bg-card hover:bg-card-hover text-foreground',
        'border border-border rounded-[var(--radius-md)]',
        'shadow-sm transition-colors duration-[var(--transition-fast)]',
        'cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
      )}
    >
      {children}
    </button>
  );
}

export function MapControls({ onZoomIn, onZoomOut, onReset, className }: MapControlsProps) {
  return (
    <div className={cn('absolute top-3 left-3 z-10 flex flex-col gap-1.5', className)}>
      <ControlButton onClick={onZoomIn} label="Inzoomen">
        <ZoomIn className="size-4" />
      </ControlButton>
      <ControlButton onClick={onZoomOut} label="Uitzoomen">
        <ZoomOut className="size-4" />
      </ControlButton>
      <ControlButton onClick={onReset} label="Weergave resetten">
        <Maximize className="size-4" />
      </ControlButton>
    </div>
  );
}
