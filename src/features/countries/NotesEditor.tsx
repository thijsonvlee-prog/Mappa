import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface NotesEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function NotesEditor({ value, onChange }: NotesEditorProps) {
  const [text, setText] = useState(value);
  const debouncedText = useDebounce(text, 500);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (debouncedText !== value) {
      onChange(debouncedText);
    }
  }, [debouncedText, onChange, value]);

  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Add notes about this country..."
      rows={4}
      className={cn(
        'flex w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground',
        'placeholder:text-foreground-muted resize-y min-h-[100px]',
        'transition-colors duration-[var(--transition-fast)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
    />
  );
}
