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
          <AlertDialogTitle>Reset All Data</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete all your travel data including
            countries, notes, photos, and tags. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Input
            label='Type "DELETE" to confirm'
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="DELETE"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReset}
            disabled={confirmation !== 'DELETE'}
            className="bg-destructive text-destructive-foreground hover:bg-destructive-hover disabled:pointer-events-none disabled:opacity-50"
          >
            Reset Everything
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
