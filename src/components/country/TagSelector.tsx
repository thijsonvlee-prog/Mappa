import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCountryStore } from '@/stores/country-store';
import { TagChip } from '@/components/country/TagChip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

const TAG_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#14b8a6',
  '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#64748b',
];

interface TagSelectorProps {
  selectedTagIds: string[];
  onChange: (ids: string[]) => void;
  className?: string;
}

export function TagSelector({ selectedTagIds, onChange, className }: TagSelectorProps) {
  const tags = useCountryStore((s) => s.tags);
  const addTag = useCountryStore((s) => s.addTag);
  const [newTagName, setNewTagName] = useState('');
  const [open, setOpen] = useState(false);

  const allTags = Array.from(tags.values());
  const selectedTags = selectedTagIds
    .map((id) => tags.get(id))
    .filter((t): t is NonNullable<typeof t> => t != null);

  function handleToggle(tagId: string) {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  }

  function handleRemove(tagId: string) {
    onChange(selectedTagIds.filter((id) => id !== tagId));
  }

  async function handleAddNew() {
    const name = newTagName.trim();
    if (!name) return;
    const color = TAG_COLORS[allTags.length % TAG_COLORS.length];
    const tag = await addTag({ name, color });
    onChange([...selectedTagIds, tag.id]);
    setNewTagName('');
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex flex-wrap gap-1.5">
        {selectedTags.map((tag) => (
          <TagChip
            key={tag.id}
            name={tag.name}
            color={tag.color}
            onRemove={() => handleRemove(tag.id)}
          />
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                'inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-0.5 text-xs font-medium text-foreground-muted',
                'transition-colors duration-[var(--transition-fast)]',
                'hover:border-border-strong hover:text-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'cursor-pointer',
              )}
            >
              <Plus className="size-3" />
              Add tag
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="start">
            <div className="flex flex-col gap-1">
              {allTags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleToggle(tag.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 text-sm text-foreground',
                      'transition-colors duration-[var(--transition-fast)]',
                      'hover:bg-background-secondary',
                      'cursor-pointer',
                    )}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="flex-1 text-left">{tag.name}</span>
                    {isSelected && <X className="size-3 text-foreground-muted" />}
                  </button>
                );
              })}
              <div className="mt-1 border-t border-border pt-1">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddNew();
                  }}
                  className="flex items-center gap-1"
                >
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="New tag name..."
                    className={cn(
                      'flex-1 rounded-[var(--radius-md)] border border-border bg-card px-2 py-1 text-sm text-foreground',
                      'placeholder:text-foreground-muted',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    )}
                  />
                  <button
                    type="submit"
                    disabled={!newTagName.trim()}
                    className={cn(
                      'inline-flex items-center justify-center rounded-[var(--radius-md)] bg-primary px-2 py-1 text-xs font-medium text-primary-foreground',
                      'transition-colors duration-[var(--transition-fast)]',
                      'hover:bg-primary-hover',
                      'disabled:pointer-events-none disabled:opacity-50',
                      'cursor-pointer',
                    )}
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
