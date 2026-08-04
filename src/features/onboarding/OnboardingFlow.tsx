import { useState, useMemo, useCallback } from 'react';
import { Globe, MapPin, PartyPopper, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { countries, countryMap, TOTAL_COUNTRIES } from '@/data/countries-lookup';
import { useCountryStore } from '@/stores/country-store';
import { useSettingsStore } from '@/stores/settings-store';

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [homeCountry, setHomeCountry] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const setCountryStatus = useCountryStore((s) => s.setCountryStatus);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;
    const q = searchQuery.toLowerCase();
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q,
    );
  }, [searchQuery]);

  const toggleCountry = useCallback((code: string) => {
    setSelectedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }, []);

  const handleComplete = async () => {
    if (homeCountry) {
      updateSettings({ homeCountry });
      await setCountryStatus(homeCountry, 'visited');
    }
    for (const code of selectedCountries) {
      await setCountryStatus(code, 'visited');
    }
    completeOnboarding();
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="w-full max-w-lg px-6">
        {/* Progress */}
        <div className="mb-8 flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                i <= step ? 'bg-primary' : 'bg-border',
              )}
            />
          ))}
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-light">
              <Globe className="h-10 w-10 text-primary" />
            </div>
            <h1 className="mb-3 text-3xl font-bold text-foreground">Welcome to Mappa</h1>
            <p className="mb-2 text-foreground-secondary">
              Track your travels, one country at a time.
            </p>
            <p className="mb-8 text-sm text-foreground-muted">
              All your data stays on this device. No account needed.
            </p>
            <button
              onClick={() => setStep(1)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
            >
              Get Started
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={handleSkip}
              className="mt-3 text-sm text-foreground-muted hover:text-foreground transition-colors"
            >
              Skip setup
            </button>
          </div>
        )}

        {/* Step 1: Home Country */}
        {step === 1 && (
          <div className="flex flex-col">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-light">
              <MapPin className="h-7 w-7 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">Where are you from?</h2>
            <p className="mb-6 text-foreground-secondary">Select your home country</p>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
              {filteredCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setHomeCountry(c.code);
                    setSearchQuery('');
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-background-secondary',
                    homeCountry === c.code && 'bg-primary-light',
                  )}
                >
                  <span className="text-lg">{c.flag}</span>
                  <span className="flex-1 text-foreground">{c.name}</span>
                  {homeCountry === c.code && (
                    <span className="text-xs font-medium text-primary">Selected</span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex items-center gap-1 rounded-lg px-4 py-2.5 text-sm text-foreground-secondary hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Quick Mark */}
        {step === 2 && (
          <div className="flex flex-col">
            <h2 className="mb-2 text-2xl font-bold text-foreground">Where have you been?</h2>
            <p className="mb-4 text-foreground-secondary">
              Tap countries you've visited. You can always change this later.
            </p>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="max-h-72 overflow-y-auto rounded-lg border border-border">
              {filteredCountries.map((c) => {
                const selected = selectedCountries.has(c.code) || homeCountry === c.code;
                return (
                  <button
                    key={c.code}
                    onClick={() => c.code !== homeCountry && toggleCountry(c.code)}
                    disabled={c.code === homeCountry}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors',
                      selected
                        ? 'bg-visited-light'
                        : 'hover:bg-background-secondary',
                      c.code === homeCountry && 'opacity-60',
                    )}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span className="flex-1 text-foreground">{c.name}</span>
                    {selected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-visited text-white text-xs">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-center text-sm text-foreground-muted">
              {selectedCountries.size + (homeCountry ? 1 : 0)} countries selected
            </p>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => { setStep(1); setSearchQuery(''); }}
                className="flex items-center gap-1 rounded-lg px-4 py-2.5 text-sm text-foreground-secondary hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={() => { setStep(3); setSearchQuery(''); }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (() => {
          const total = selectedCountries.size + (homeCountry ? 1 : 0);
          const continents = new Set<string>();
          const allSelected = [...selectedCountries];
          if (homeCountry) allSelected.push(homeCountry);
          for (const code of allSelected) {
            const c = countryMap.get(code);
            if (c) continents.add(c.continent);
          }

          return (
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-visited-light">
                <PartyPopper className="h-10 w-10 text-visited" />
              </div>
              <h1 className="mb-3 text-3xl font-bold text-foreground">You're all set!</h1>
              {total > 0 ? (
                <p className="mb-8 text-foreground-secondary">
                  You've visited {total} {total === 1 ? 'country' : 'countries'} across{' '}
                  {continents.size} {continents.size === 1 ? 'continent' : 'continents'}.
                  That's {((total / TOTAL_COUNTRIES) * 100).toFixed(1)}% of the world!
                </p>
              ) : (
                <p className="mb-8 text-foreground-secondary">
                  Start exploring and mark the countries you've visited.
                </p>
              )}
              <button
                onClick={handleComplete}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
              >
                Explore Your Map
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
