import { AppearanceSection } from './AppearanceSection';
import { PreferencesSection } from './PreferencesSection';
import { DataSection } from './DataSection';
import { AboutSection } from './AboutSection';

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 p-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <AppearanceSection />

      <hr className="border-border" />

      <PreferencesSection />

      <hr className="border-border" />

      <DataSection />

      <hr className="border-border" />

      <AboutSection />
    </div>
  );
}
