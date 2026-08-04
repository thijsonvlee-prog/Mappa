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
        <h2 className="text-lg font-semibold text-foreground">Data</h2>
        <p className="text-sm text-foreground-muted">
          Export, import, or reset your travel data.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Export Data</p>
            <p className="text-sm text-foreground-muted">
              Download all your data as a JSON file.
            </p>
          </div>
          <Button variant="secondary" onClick={() => setExportOpen(true)}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Import Data</p>
            <p className="text-sm text-foreground-muted">
              Restore data from a previously exported file.
            </p>
          </div>
          <Button variant="secondary" onClick={() => setImportOpen(true)}>
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Reset Data</p>
            <p className="text-sm text-foreground-muted">
              Permanently delete all your travel data.
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
