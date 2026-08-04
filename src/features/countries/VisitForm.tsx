import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Visit } from '@/types';

interface VisitFormProps {
  visit?: Visit;
  onSubmit: (data: Omit<Visit, 'id'>) => void;
  onCancel: () => void;
}

export function VisitForm({ visit, onSubmit, onCancel }: VisitFormProps) {
  const [startDate, setStartDate] = useState(visit?.startDate ?? '');
  const [endDate, setEndDate] = useState(visit?.endDate ?? '');
  const [notes, setNotes] = useState(visit?.notes ?? '');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (startDate && endDate && endDate < startDate) {
      setError('End date must be on or after start date');
      return;
    }

    onSubmit({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      notes: notes || undefined,
    });
  }

  const inputClass = cn(
    'flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground',
    'transition-colors duration-[var(--transition-fast)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border border-border rounded-[var(--radius-md)] bg-background">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Trip notes..."
          rows={3}
          className={cn(inputClass, 'h-auto resize-y')}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex items-center gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          {visit ? 'Update' : 'Add Visit'}
        </Button>
      </div>
    </form>
  );
}
