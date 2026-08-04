interface MapScaleProps {
  zoom: number;
}

export function MapScale({ zoom }: MapScaleProps) {
  const pixelsPerDegree = 147 * Math.pow(2, zoom) / 360;
  const degreesPerUnit = 1 / pixelsPerDegree;
  const kmPerDegree = 111.32;

  let targetKm = 1000;
  let unitCount = Math.round((targetKm / kmPerDegree) / degreesPerUnit);

  if (unitCount < 5) {
    targetKm = 100;
    unitCount = Math.round((targetKm / kmPerDegree) / degreesPerUnit);
  } else if (unitCount > 500) {
    targetKm = 5000;
    unitCount = Math.round((targetKm / kmPerDegree) / degreesPerUnit);
  }

  const width = unitCount * pixelsPerDegree;
  const label = targetKm >= 1000 ? `${(targetKm / 1000).toFixed(0)}k` : `${targetKm}`;

  return (
    <div className="absolute bottom-20 left-4 flex flex-col items-start gap-1 opacity-60 pointer-events-none">
      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-start' }}>
        <div style={{ width: `${width}px`, height: '1px', backgroundColor: 'var(--color-foreground-muted)' }} />
      </div>
      <span
        className="text-xs font-mono"
        style={{ color: 'var(--color-foreground-muted)' }}
      >
        {label} km
      </span>
    </div>
  );
}
