import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { db } from '@/db/database';
import { useObjectUrl } from '@/hooks/useObjectUrl';

interface PhotoLightboxProps {
  photoId: string | null;
  photoIds: string[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}

function LightboxImage({ photoId }: { photoId: string }) {
  const [blob, setBlob] = useState<Blob>();
  const url = useObjectUrl(blob);

  useEffect(() => {
    let cancelled = false;
    db.photos.get(photoId).then((photo) => {
      if (!cancelled && photo) {
        setBlob(photo.blob);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [photoId]);

  if (!url) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-pulse rounded-full bg-border" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt=""
      className="max-h-[80vh] max-w-full object-contain"
    />
  );
}

export function PhotoLightbox({ photoId, photoIds, onClose, onNavigate }: PhotoLightboxProps) {
  const currentIndex = photoId ? photoIds.indexOf(photoId) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photoIds.length - 1;

  const navigatePrev = useCallback(() => {
    if (hasPrev) {
      onNavigate(photoIds[currentIndex - 1]);
    }
  }, [hasPrev, currentIndex, photoIds, onNavigate]);

  const navigateNext = useCallback(() => {
    if (hasNext) {
      onNavigate(photoIds[currentIndex + 1]);
    }
  }, [hasNext, currentIndex, photoIds, onNavigate]);

  useEffect(() => {
    if (!photoId) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        navigatePrev();
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photoId, navigatePrev, navigateNext]);

  return (
    <Dialog open={photoId !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] border-none bg-transparent p-0 shadow-none sm:max-w-[90vw] [&>button]:text-white [&>button]:hover:text-white/80">
        <div className="relative flex items-center justify-center">
          {hasPrev && (
            <button
              type="button"
              onClick={navigatePrev}
              className={cn(
                'absolute left-2 z-10 rounded-full bg-background/60 p-2 text-foreground',
                'transition-colors duration-[var(--transition-fast)]',
                'hover:bg-background/80',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'cursor-pointer',
              )}
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {photoId && <LightboxImage photoId={photoId} />}

          {hasNext && (
            <button
              type="button"
              onClick={navigateNext}
              className={cn(
                'absolute right-2 z-10 rounded-full bg-background/60 p-2 text-foreground',
                'transition-colors duration-[var(--transition-fast)]',
                'hover:bg-background/80',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'cursor-pointer',
              )}
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {photoIds.length > 1 && (
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-background/60 px-3 py-1 text-xs text-foreground">
              {currentIndex + 1} / {photoIds.length}
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
