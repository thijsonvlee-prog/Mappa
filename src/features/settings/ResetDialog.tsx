import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/AlertDialog';
import { Input } from '@/components/ui/Input';
import { useCountryStore } from '@/stores/country-store';
import { useSettingsStore } from '@/stores/settings-store';

interface ResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResetDialog({ open, onOpenChange }: ResetDialogProps) {
  const [confirmation, setConfirmation] = useState('');
  const clearAllData = useCountryStore((s) => s.clearAllData);
  const resetSettings = useSettingsStore((s) => s.resetSettings);

  async function handleReset() {
    await clearAllData();
    resetSettings();
    setConfirmation('');
    onOpenChange(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setConfirmation('');
    onOpenChange(nextOpen);
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Alle gegevens resetten</AlertDialogTitle>
          <AlertDialogDescription>
            Dit verwijdert permanent al je reisgegevens, inclusief landen,
            notities, foto's en tags. Deze actie kan niet ongedaan worden gemaakt.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Input
            label='Typ "DELETE" om te bevestigen'
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="DELETE"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuleren</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReset}
            disabled={confirmation !== 'DELETE'}
            className="bg-destructive text-destructive-foreground hover:bg-destructive-hover disabled:pointer-events-none disabled:opacity-50"
          >
            Alles resetten
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
