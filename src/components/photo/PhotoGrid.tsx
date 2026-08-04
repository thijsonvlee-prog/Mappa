import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { PhotoThumbnail } from '@/components/photo/PhotoThumbnail';

interface PhotoGridProps {
  photoIds: string[];
  countryCode: string;
  onPhotoClick?: (photoId: string) => void;
  onPhotoDelete?: (photoId: string) => void;
  className?: string;
}

export function PhotoGrid({
  photoIds,
  countryCode: _countryCode,
  onPhotoClick,
  onPhotoDelete,
  className,
}: PhotoGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  if (photoIds.length === 0) return null;

  const colsPerRow = 4;
  const rowCount = Math.ceil(photoIds.length / colsPerRow);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 2,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  return (
    <div
      ref={parentRef}
      className={cn('w-full overflow-y-auto', className)}
      style={{ height: '500px' }}
    >
      <div
        style={{
          height: `${totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const startIndex = virtualItem.index * colsPerRow;
          const rowPhotos = photoIds.slice(startIndex, startIndex + colsPerRow);

          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 p-2"
            >
              {rowPhotos.map((id) => (
                <PhotoThumbnail
                  key={id}
                  photoId={id}
                  onClick={() => onPhotoClick?.(id)}
                  onDelete={onPhotoDelete ? () => onPhotoDelete(id) : undefined}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
