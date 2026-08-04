import { useState, useCallback, useRef, type DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { useCountryStore } from '@/stores/country-store';
import { PhotoThumbnail } from '@/components/photo/PhotoThumbnail';
import { cn } from '@/lib/utils';
import type { CountryVisit } from '@/types';

interface CountryPhotosTabProps {
  countryCode: string;
  visit: CountryVisit | undefined;
}

export function CountryPhotosTab({ countryCode, visit }: CountryPhotosTabProps) {
  const addPhoto = useCountryStore((s) => s.addPhoto);
  const removePhoto = useCountryStore((s) => s.removePhoto);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          await addPhoto(countryCode, file);
        }
      }
    },
    [countryCode, addPhoto],
  );

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  if (!visit) {
    return (
      <div className="py-8 text-center text-sm text-foreground-muted">
        Set a status to start adding photos.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 p-6',
          'border-2 border-dashed rounded-[var(--radius-md)]',
          'transition-colors duration-[var(--transition-fast)] cursor-pointer',
          isDragging
            ? 'border-primary bg-primary-light/50'
            : 'border-border hover:border-border-strong',
        )}
      >
        <Upload className="size-6 text-foreground-muted" />
        <p className="text-sm text-foreground-muted">
          Drop images here or click to upload
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {visit.photoIds.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {visit.photoIds.map((photoId) => (
            <PhotoThumbnail
              key={photoId}
              photoId={photoId}
              onClick={() => {}}
              onDelete={() => removePhoto(photoId)}
            />
          ))}
        </div>
      )}

      {visit.photoIds.length === 0 && (
        <div className="py-6 text-center text-sm text-foreground-muted">
          No photos yet.
        </div>
      )}
    </div>
  );
}
