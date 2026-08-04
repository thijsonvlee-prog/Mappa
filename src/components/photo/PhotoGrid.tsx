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
  if (photoIds.length === 0) return null;

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4',
        className,
      )}
    >
      {photoIds.map((id) => (
        <PhotoThumbnail
          key={id}
          photoId={id}
          onClick={() => onPhotoClick?.(id)}
          onDelete={onPhotoDelete ? () => onPhotoDelete(id) : undefined}
        />
      ))}
    </div>
  );
}
