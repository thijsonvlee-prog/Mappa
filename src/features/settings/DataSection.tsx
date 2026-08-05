import { useState } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ExportDialog } from './ExportDialog';
import { ImportDialog } from './ImportDialog';
import { ResetDialog } from './ResetDialog';

export function DataSection() {
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>Gegevens</h2>
        <p className="text-sm text-foreground-muted">
          Exporteer, importeer of reset je reisgegevens.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Gegevens exporteren</p>
            <p className="text-sm text-foreground-muted">
              Download al je gegevens als JSON-bestand.
            </p>
          </div>
          <Button variant="secondary" onClick={() => setExportOpen(true)}>
            <Download className="h-4 w-4" />
            Exporteer
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Gegevens importeren</p>
            <p className="text-sm text-foreground-muted">
              Herstel gegevens uit een eerder geëxporteerd bestand.
            </p>
          </div>
          <Button variant="secondary" onClick={() => setImportOpen(true)}>
            <Upload className="h-4 w-4" />
            Importeer
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Gegevens resetten</p>
            <p className="text-sm text-foreground-muted">
              Verwijder permanent al je reisgegevens.
            </p>
          </div>
          <Button variant="destructive" onClick={() => setResetOpen(true)}>
            <Trash2 className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
      <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
      <ResetDialog open={resetOpen} onOpenChange={setResetOpen} />
    </section>
  );
}
