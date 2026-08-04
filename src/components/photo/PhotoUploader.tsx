import { useState, useRef, useCallback, type DragEvent } from 'react';
import { Upload, ImagePlus, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCountryStore } from '@/stores/country-store';
import { validatePhotoFile } from '@/lib/photo-utils';

type UploadState = 'idle' | 'dragging' | 'uploading' | 'success' | 'error';

interface PhotoUploaderProps {
  countryCode: string;
  onUpload?: () => void;
  className?: string;
}

export function PhotoUploader({ countryCode, onUpload, className }: PhotoUploaderProps) {
  const addPhoto = useCountryStore((s) => s.addPhoto);
  const [state, setState] = useState<UploadState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      for (const file of fileArray) {
        const validationError = validatePhotoFile(file);
        if (validationError) {
          setState('error');
          setErrorMessage(validationError);
          return;
        }
      }

      setState('uploading');
      setErrorMessage('');

      try {
        for (const file of fileArray) {
          await addPhoto(countryCode, file);
        }
        setState('success');
        onUpload?.();
        setTimeout(() => setState('idle'), 2000);
      } catch {
        setState('error');
        setErrorMessage('Failed to upload photo');
      }
    },
    [addPhoto, countryCode, onUpload],
  );

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setState('dragging');
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    setState('idle');
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    processFiles(e.dataTransfer.files);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border-2 border-dashed p-8',
        'transition-colors duration-[var(--transition-fast)]',
        'cursor-pointer',
        state === 'dragging' && 'border-primary bg-primary/5',
        state === 'error' && 'border-destructive bg-destructive/5',
        state === 'success' && 'border-success bg-success/5',
        state === 'idle' && 'border-border hover:border-border-strong hover:bg-background-secondary',
        state === 'uploading' && 'border-border pointer-events-none opacity-70',
        className,
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {state === 'uploading' && (
        <>
          <Upload className="h-8 w-8 text-foreground-muted animate-pulse" />
          <p className="text-sm text-foreground-muted">Uploading...</p>
        </>
      )}

      {state === 'success' && (
        <>
          <Check className="h-8 w-8 text-success" />
          <p className="text-sm text-success">Upload complete</p>
        </>
      )}

      {state === 'error' && (
        <>
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-destructive">{errorMessage}</p>
        </>
      )}

      {(state === 'idle' || state === 'dragging') && (
        <>
          <ImagePlus className="h-8 w-8 text-foreground-muted" />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {state === 'dragging' ? 'Drop photos here' : 'Drop photos or click to upload'}
            </p>
            <p className="mt-1 text-xs text-foreground-muted">
              JPEG, PNG, or WebP up to 10 MB
            </p>
          </div>
        </>
      )}
    </div>
  );
}
