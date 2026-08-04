import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { db } from '@/db/database';
import { useObjectUrl } from '@/hooks/useObjectUrl';

interface PhotoThumbnailProps {
  photoId: string;
  onClick: () => void;
  onDelete?: () => void;
  className?: string;
}

export function PhotoThumbnail({ photoId, onClick, onDelete, className }: PhotoThumbnailProps) {
  const [thumbnailBlob, setThumbnailBlob] = useState<Blob>();
  const url = useObjectUrl(thumbnailBlob);

  useEffect(() => {
    let cancelled = false;
    db.photos.get(photoId).then((photo) => {
      if (!cancelled && photo) {
        setThumbnailBlob(photo.thumbnailBlob);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [photoId]);

  return (
    <div
      className={cn(
        'group relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-background-secondary',
        'transition-colors duration-[var(--transition-fast)]',
        'cursor-pointer',
        className,
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {url ? (
        <img
          src={url}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-border" />
        </div>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={cn(
            'absolute right-1 top-1 rounded-[var(--radius-md)] bg-background/80 p-1 text-foreground-muted opacity-0',
            'transition-opacity duration-[var(--transition-fast)]',
            'group-hover:opacity-100',
            'hover:text-destructive',
            'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'cursor-pointer',
          )}
          aria-label="Delete photo"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  );
}
