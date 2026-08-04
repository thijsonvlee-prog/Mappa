import { useState } from 'react';
import { Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { useCountryStore } from '@/stores/country-store';
import { downloadAsJson } from '@/lib/export-utils';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const [includePhotos, setIncludePhotos] = useState(false);
  const [exporting, setExporting] = useState(false);
  const exportData = useCountryStore((s) => s.exportData);
  const photos = useCountryStore((s) => s.photos);

  async function handleExport() {
    setExporting(true);
    try {
      const data = await exportData(includePhotos);
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadAsJson(data, `mappa-export-${timestamp}.json`);
      onOpenChange(false);
    } finally {
      setExporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Download all your travel data as a JSON file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Include photos
              </p>
              <p className="text-sm text-foreground-muted">
                {photos.size > 0
                  ? `${photos.size} photo${photos.size === 1 ? '' : 's'} will be embedded. This may significantly increase file size.`
                  : 'No photos to include.'}
              </p>
            </div>
            <Switch
              checked={includePhotos}
              onCheckedChange={setIncludePhotos}
              disabled={photos.size === 0}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={exporting}>
            <Download className="h-4 w-4" />
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
