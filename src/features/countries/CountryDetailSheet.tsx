import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { useCountryStore } from '@/stores/country-store';
import { getCountry } from '@/data/countries-lookup';
import { CountryFlag } from '@/components/country/CountryFlag';
import { StatusSelector } from '@/components/country/StatusSelector';
import { CountryOverviewTab } from './CountryOverviewTab';
import { CountryVisitsTab } from './CountryVisitsTab';
import { CountryPhotosTab } from './CountryPhotosTab';
import { cn } from '@/lib/utils';
import type { CountryStatus } from '@/types';

type TabId = 'overview' | 'visits' | 'photos';

const tabs: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'visits', label: 'Visits' },
  { id: 'photos', label: 'Photos' },
];

export function CountryDetailSheet() {
  const isDetailOpen = useUIStore((s) => s.isDetailOpen);
  const selectedCountryCode = useUIStore((s) => s.selectedCountryCode);
  const closeDetail = useUIStore((s) => s.closeDetail);

  const visit = useCountryStore((s) =>
    selectedCountryCode ? s.visits.get(selectedCountryCode) : undefined,
  );
  const setCountryStatus = useCountryStore((s) => s.setCountryStatus);

  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const country = selectedCountryCode ? getCountry(selectedCountryCode) : undefined;
  const status: CountryStatus = visit?.status ?? 'not_visited';

  function handleStatusChange(newStatus: CountryStatus) {
    if (!selectedCountryCode) return;
    setCountryStatus(selectedCountryCode, newStatus);
  }

  return (
    <DialogPrimitive.Root open={isDetailOpen} onOpenChange={(open) => !open && closeDetail()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-overlay backdrop-blur-sm',
            'data-[state=open]:animate-[fadeIn_200ms_ease-out] data-[state=closed]:animate-[fadeOut_150ms_ease-in]',
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed right-0 top-0 z-50 h-full w-full sm:w-[420px]',
            'bg-card border-l border-border shadow-lg',
            'flex flex-col',
            'data-[state=open]:animate-[slideInRight_200ms_ease-out] data-[state=closed]:animate-[slideOutRight_150ms_ease-in]',
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            {country?.name ?? 'Country'} Details
          </DialogPrimitive.Title>

          <div className="flex items-center justify-between p-4 border-b border-border">
            {country && (
              <div className="flex items-center gap-3 min-w-0">
                <CountryFlag flag={country.flag} size="lg" />
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-foreground truncate">
                    {country.name}
                  </h2>
                  <p className="text-sm text-foreground-muted">{country.continent}</p>
                </div>
              </div>
            )}
            <DialogPrimitive.Close
              className={cn(
                'rounded-sm p-1.5 text-foreground-muted opacity-70 hover:opacity-100',
                'transition-opacity cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
            >
              <X className="size-5" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          <div className="px-4 pt-4 pb-2">
            <StatusSelector value={status} onChange={handleStatusChange} className="w-full" />
          </div>

          <div className="flex border-b border-border px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-3 py-2.5 text-sm font-medium',
                  'border-b-2 transition-colors duration-[var(--transition-fast)]',
                  'cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-foreground-muted hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {selectedCountryCode && activeTab === 'overview' && (
              <CountryOverviewTab countryCode={selectedCountryCode} visit={visit} />
            )}
            {selectedCountryCode && activeTab === 'visits' && (
              <CountryVisitsTab countryCode={selectedCountryCode} visit={visit} />
            )}
            {selectedCountryCode && activeTab === 'photos' && (
              <CountryPhotosTab countryCode={selectedCountryCode} visit={visit} />
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
