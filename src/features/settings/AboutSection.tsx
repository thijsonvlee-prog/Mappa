import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

declare const __APP_VERSION__: string;

export function AboutSection() {
  const [storageInfo, setStorageInfo] = useState<{
    used: string;
    quota: string;
  } | null>(null);

  useEffect(() => {
    async function getStorage() {
      if (!navigator.storage?.estimate) return;
      const est = await navigator.storage.estimate();
      const format = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      };
      setStorageInfo({
        used: format(est.usage ?? 0),
        quota: format(est.quota ?? 0),
      });
    }
    getStorage();
  }, []);

  const version =
    typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0';

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">About</h2>
        <p className="text-sm text-foreground-muted">
          Mappa v{version}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-border p-4">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Privacy First
            </p>
            <p className="text-sm text-foreground-muted">
              All data is stored locally in your browser. No accounts, no
              tracking, no external connections. Your travel data never leaves
              your device.
            </p>
          </div>
        </div>

        {storageInfo && (
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium text-foreground">
              Storage Usage
            </p>
            <p className="text-sm text-foreground-muted">
              {storageInfo.used} used of {storageInfo.quota} available
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
