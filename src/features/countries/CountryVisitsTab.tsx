import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCountryStore } from '@/stores/country-store';
import { Button } from '@/components/ui/Button';
import { VisitForm } from './VisitForm';
import { cn } from '@/lib/utils';
import type { CountryVisit, Visit } from '@/types';

interface CountryVisitsTabProps {
  countryCode: string;
  visit: CountryVisit | undefined;
}

export function CountryVisitsTab({ countryCode, visit }: CountryVisitsTabProps) {
  const addVisit = useCountryStore((s) => s.addVisit);
  const updateVisit = useCountryStore((s) => s.updateVisit);
  const removeVisit = useCountryStore((s) => s.removeVisit);

  const [showForm, setShowForm] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);

  function handleAdd(data: Omit<Visit, 'id'>) {
    addVisit(countryCode, data);
    setShowForm(false);
  }

  function handleUpdate(data: Omit<Visit, 'id'>) {
    if (!editingVisit) return;
    updateVisit(countryCode, editingVisit.id, data);
    setEditingVisit(null);
  }

  function handleDelete(visitId: string) {
    removeVisit(countryCode, visitId);
  }

  if (!visit) {
    return (
      <div className="py-8 text-center text-sm text-foreground-muted">
        Stel een status in om bezoeken bij te houden.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          {visit.visits.length} {visit.visits.length !== 1 ? 'bezoeken' : 'bezoek'}
        </h3>
        {!showForm && !editingVisit && (
          <Button size="sm" variant="secondary" onClick={() => setShowForm(true)}>
            <Plus className="size-4" />
            Bezoek toevoegen
          </Button>
        )}
      </div>

      {showForm && (
        <VisitForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      )}

      {editingVisit && (
        <VisitForm
          visit={editingVisit}
          onSubmit={handleUpdate}
          onCancel={() => setEditingVisit(null)}
        />
      )}

      <div className="flex flex-col gap-2">
        {visit.visits.map((v) => (
          <div
            key={v.id}
            className={cn(
              'flex items-start gap-3 p-3',
              'border border-border rounded-[var(--radius-md)]',
              'bg-background',
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm text-foreground">
                {v.startDate && (
                  <span>{v.startDate}</span>
                )}
                {v.startDate && v.endDate && <span className="text-foreground-muted">-</span>}
                {v.endDate && <span>{v.endDate}</span>}
                {!v.startDate && !v.endDate && (
                  <span className="text-foreground-muted">Geen datums ingesteld</span>
                )}
              </div>
              {v.notes && (
                <p className="mt-1 text-xs text-foreground-muted line-clamp-2">
                  {v.notes}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setEditingVisit(v)}
                className="p-1.5 text-foreground-muted hover:text-foreground rounded-md hover:bg-background-secondary transition-colors cursor-pointer"
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(v.id)}
                className="p-1.5 text-foreground-muted hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {visit.visits.length === 0 && !showForm && (
        <div className="py-6 text-center text-sm text-foreground-muted">
          Nog geen bezoeken geregistreerd.
        </div>
      )}
    </div>
  );
}
