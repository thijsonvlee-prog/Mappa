import { Sun, Moon, Monitor } from 'lucide-react';
import { useSettingsStore } from '@/stores/settings-store';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import type { ThemeMode, MapProjection } from '@/types';

const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

const projectionOptions: { value: MapProjection; label: string }[] = [
  { value: 'geoEqualEarth', label: 'Equal Earth' },
  { value: 'geoMercator', label: 'Mercator' },
  { value: 'geoNaturalEarth1', label: 'Natural Earth' },
];

export function AppearanceSection() {
  const theme = useSettingsStore((s) => s.theme);
  const mapProjection = useSettingsStore((s) => s.mapProjection);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
        <p className="text-sm text-foreground-muted">
          Customize how Mappa looks and feels.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Theme</label>
          <div className="flex gap-2">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateSettings({ theme: opt.value })}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium',
                  'transition-colors duration-[var(--transition-fast)] cursor-pointer',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  theme === opt.value
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-border text-foreground-secondary hover:bg-background-secondary',
                )}
              >
                <opt.icon className="h-4 w-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Map Projection
          </label>
          <Select
            value={mapProjection}
            onValueChange={(v: MapProjection) =>
              updateSettings({ mapProjection: v })
            }
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {projectionOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
