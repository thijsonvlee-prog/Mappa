import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { useCountryStore } from '@/stores/country-store';
import { validateImportFile, readFileAsText } from '@/lib/import-utils';
import type { ImportValidationResult } from '@/lib/import-utils';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const [validation, setValidation] = useState<ImportValidationResult | null>(null);
  const [mode, setMode] = useState<'merge' | 'replace'>('merge');
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importData = useCountryStore((s) => s.importData);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await readFileAsText(file);
    const result = validateImportFile(text);
    setValidation(result);
  }

  async function handleImport() {
    if (!validation?.valid || !validation.data) return;

    setImporting(true);
    try {
      await importData(validation.data, mode);
      onOpenChange(false);
      setValidation(null);
    } finally {
      setImporting(false);
    }
  }

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setValidation(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gegevens importeren</DialogTitle>
          <DialogDescription>
            Importeer reisgegevens uit een eerder geëxporteerd JSON-bestand.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Bestand selecteren
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="mt-1.5 block w-full text-sm text-foreground-muted file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground file:cursor-pointer hover:file:bg-primary-hover"
            />
          </div>

          {validation && !validation.valid && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-3">
              <p className="text-sm font-medium text-destructive">
                Ongeldig bestand
              </p>
              <ul className="mt-1 list-inside list-disc text-sm text-destructive">
                {validation.errors?.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {validation?.valid && validation.summary && (
            <>
              <div className="rounded-md border border-border bg-background-secondary p-3">
                <p className="text-sm font-medium text-foreground">
                  Bestandsinhoud
                </p>
                <ul className="mt-1 space-y-0.5 text-sm text-foreground-muted">
                  <li>{validation.summary.countryVisits} landen</li>
                  <li>{validation.summary.tags} tags</li>
                  <li>{validation.summary.photos} foto's</li>
                </ul>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Importmodus
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('merge')}
                    className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      mode === 'merge'
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-border text-foreground-secondary hover:bg-background-secondary'
                    }`}
                  >
                    Samenvoegen
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('replace')}
                    className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      mode === 'replace'
                        ? 'border-destructive bg-destructive/10 text-destructive'
                        : 'border-border text-foreground-secondary hover:bg-background-secondary'
                    }`}
                  >
                    Vervangen
                  </button>
                </div>
                {mode === 'replace' && (
                  <p className="text-sm text-destructive">
                    Dit verwijdert alle bestaande gegevens en vervangt ze door het geïmporteerde bestand.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => handleClose(false)}>
            Annuleren
          </Button>
          <Button
            onClick={handleImport}
            disabled={!validation?.valid || importing}
          >
            <Upload className="h-4 w-4" />
            {importing ? 'Bezig met importeren...' : 'Importeer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
