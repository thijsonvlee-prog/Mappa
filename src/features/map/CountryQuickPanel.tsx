import { useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { getCountry } from '@/data/countries-lookup';
import { useCountryStore } from '@/stores/country-store';
import { useUIStore } from '@/stores/ui-store';
import { CountryFlag } from '@/components/country/CountryFlag';
import { StatusSelector } from '@/components/country/StatusSelector';
import { cn } from '@/lib/utils';
import type { CountryStatus } from '@/types';

interface CountryQuickPanelProps {
  countryCode: string | null;
  position: { x: number; y: number };
  onClose: () => void;
}

export function CountryQuickPanel({ countryCode, position, onClose }: CountryQuickPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const status = useCountryStore((s) =>
    countryCode ? (s.visits.get(countryCode)?.status ?? 'not_visited') : 'not_visited',
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!countryCode) return null;

  const country = getCountry(countryCode);
  if (!country) return null;

  function handleStatusChange(newStatus: CountryStatus) {
    if (!countryCode) return;
    useCountryStore.getState().setCountryStatus(countryCode, newStatus);
  }

  function handleViewDetails() {
    if (!countryCode) return;
    useUIStore.getState().openDetail(countryCode);
    onClose();
  }

  // Clamp position to keep panel on screen
  const panelWidth = 280;
  const panelHeight = 160;
  const x = Math.min(position.x, window.innerWidth - panelWidth - 16);
  const y = Math.min(position.y, window.innerHeight - panelHeight - 16);

  return (
    <div
      ref={panelRef}
      className={cn(
        'fixed z-50',
        'w-[280px] p-4',
        'bg-card border border-border rounded-[var(--radius-lg)]',
        'shadow-lg',
      )}
      style={{ left: x, top: y }}
    >
      <div className="flex items-center gap-2 mb-3">
        <CountryFlag flag={country.flag} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {country.name}
          </h3>
          <p className="text-xs text-foreground-muted">{country.continent}</p>
        </div>
      </div>

      <div className="mb-3">
        <StatusSelector value={status} onChange={handleStatusChange} />
      </div>

      <button
        type="button"
        onClick={handleViewDetails}
        className={cn(
          'w-full flex items-center justify-center gap-1.5',
          'px-3 py-2 text-sm font-medium',
          'text-primary hover:text-primary-hover',
          'bg-primary-light rounded-[var(--radius-md)]',
          'transition-colors duration-[var(--transition-fast)]',
          'cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
        )}
      >
        <ExternalLink className="size-3.5" />
        View Details
      </button>
    </div>
  );
}
