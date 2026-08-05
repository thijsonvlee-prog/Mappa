import { useSettingsStore } from '@/stores/settings-store';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/Select';
import { formatDate } from '@/lib/date-utils';
import type { DateFormat } from '@/types';

const dateFormatOptions: { value: DateFormat; label: string }[] = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
];

export function PreferencesSection() {
  const dateFormat = useSettingsStore((s) => s.dateFormat);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const preview = formatDate(new Date().toISOString(), dateFormat);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>Voorkeuren</h2>
        <p className="text-sm text-foreground-muted">
          Configureer hoe gegevens worden weergegeven.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Datumnotatie
        </label>
        <Select
          value={dateFormat}
          onValueChange={(v: DateFormat) =>
            updateSettings({ dateFormat: v })
          }
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateFormatOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-foreground-muted">
          Voorbeeld: {preview}
        </p>
      </div>
    </section>
  );
}
