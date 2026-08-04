import { useState, useCallback, useRef, type DragEvent } from 'react';
import { Upload, Trash2, ImageIcon } from 'lucide-react';
import { useCountryStore } from '@/stores/country-store';
import { db } from '@/db/database';
import { useObjectUrl } from '@/hooks/useObjectUrl';
import { cn } from '@/lib/utils';
import type { CountryVisit } from '@/types';

interface PhotoThumbnailProps {
  photoId: string;
  onRemove: (id: string) => void;
}

function PhotoThumbnail({ photoId, onRemove }: PhotoThumbnailProps) {
  const [blob, setBlob] = useState<Blob>();
  const url = useObjectUrl(blob);

  useState(() => {
    db.photos.get(photoId).then((photo) => {
      if (photo?.thumbnailBlob) setBlob(photo.thumbnailBlob);
      else if (photo?.blob) setBlob(photo.blob);
    });
  });

  return (
    <div className="group relative aspect-square rounded-[var(--radius-md)] overflow-hidden bg-background-secondary">
      {url ? (
        <img src={url} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <ImageIcon className="size-6 text-foreground-muted" />
        </div>
      )}
      <button
        type="button"
        onClick={() => onRemove(photoId)}
        className={cn(
          'absolute top-1.5 right-1.5 p-1.5',
          'rounded-full bg-overlay text-white',
          'opacity-0 group-hover:opacity-100',
          'transition-opacity cursor-pointer',
        )}
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

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
              onRemove={removePhoto}
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
