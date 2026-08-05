import { useEffect, useRef } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Globe2, BookOpen, Compass, Settings, Search } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { useCountryStore } from '@/stores/country-store';
import { countries, countryMap } from '@/data/countries-lookup';
import { StatusBadge } from '@/components/country/StatusBadge';
import { CountryFlag } from '@/components/country/CountryFlag';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Atlas', path: '/', icon: Globe2 },
  { label: 'Landen', path: '/countries', icon: BookOpen },
  { label: 'Ontdek', path: '/statistics', icon: Compass },
  { label: 'Instellingen', path: '/settings', icon: Settings },
];

export function CommandPalette() {
  const navigate = useNavigate();
  const open = useUIStore((s) => s.isCommandPaletteOpen);
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const openDetail = useUIStore((s) => s.openDetail);
  const visits = useCountryStore((s) => s.visits);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, setOpen]);

  function handleSelect(value: string) {
    setOpen(false);

    const nav = navItems.find((n) => n.path === value);
    if (nav) {
      navigate(nav.path);
      return;
    }

    if (countryMap.has(value)) {
      openDetail(value);
      navigate('/');
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-overlay backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2">
        <Command
          className="rounded-lg border border-border bg-card shadow-2xl"
          label="Command palette"
        >
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 shrink-0 text-foreground-muted" />
            <Command.Input
              ref={inputRef}
              placeholder="Zoek landen, navigeer..."
              className="flex h-12 w-full bg-transparent text-sm text-foreground placeholder:text-foreground-muted outline-none"
              autoFocus
            />
            <kbd className="hidden shrink-0 rounded border border-border bg-background-secondary px-1.5 py-0.5 text-xs text-foreground-muted sm:inline-block">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-foreground-muted">
              Geen resultaten gevonden.
            </Command.Empty>

            <Command.Group
              heading="Navigatie"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-foreground-muted"
            >
              {navItems.map((item) => (
                <Command.Item
                  key={item.path}
                  value={item.path}
                  onSelect={handleSelect}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground',
                    'cursor-pointer select-none',
                    'data-[selected=true]:bg-background-secondary',
                  )}
                >
                  <item.icon className="h-4 w-4 text-foreground-muted" />
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="my-1.5 h-px bg-border" />

            <Command.Group
              heading="Landen"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-foreground-muted"
            >
              {countries.map((country) => {
                const visit = visits.get(country.code);
                return (
                  <Command.Item
                    key={country.code}
                    value={`${country.code} ${country.name}`}
                    onSelect={() => handleSelect(country.code)}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground',
                      'cursor-pointer select-none',
                      'data-[selected=true]:bg-background-secondary',
                    )}
                  >
                    <CountryFlag flag={country.flag} size="sm" />
                    <span className="flex-1 truncate" style={{ fontFamily: 'var(--font-serif)' }}>
                      {country.name}
                    </span>
                    {visit && <StatusBadge status={visit.status} />}
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
