import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CitiesEditorProps {
  cities: string[];
  onChange: (cities: string[]) => void;
}

export function CitiesEditor({ cities, onChange }: CitiesEditorProps) {
  const [input, setInput] = useState('');

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      const city = input.trim();
      if (!cities.includes(city)) {
        onChange([...cities, city]);
      }
      setInput('');
    }
  }

  function handleRemove(city: string) {
    onChange(cities.filter((c) => c !== city));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {cities.map((city) => (
          <span
            key={city}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1',
              'bg-primary-light text-primary text-xs font-medium',
            )}
          >
            {city}
            <button
              type="button"
              onClick={() => handleRemove(city)}
              className="text-primary/60 hover:text-primary cursor-pointer"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a city and press Enter"
        className={cn(
          'flex h-9 w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground',
          'placeholder:text-foreground-muted',
          'transition-colors duration-[var(--transition-fast)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        )}
      />
    </div>
  );
}
