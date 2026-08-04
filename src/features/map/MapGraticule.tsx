// Subtle gridlines for latitude/longitude reference
// Renders at 30° intervals when map is zoomed out (zoom < 4)

export function MapGraticule({ zoom }: { zoom: number }) {
  // Don't show graticule when zoomed in
  if (zoom > 4) return null;

  const lines = [];
  
  // Latitude lines (every 30°)
  for (let lat = -60; lat <= 60; lat += 30) {
    lines.push(
      <line
        key={`lat-${lat}`}
        x1="0"
        y1={((lat + 90) / 180) * 100 + '%'}
        x2="100%"
        y2={((lat + 90) / 180) * 100 + '%'}
        stroke="var(--color-map-graticule)"
        strokeWidth="0.5"
        opacity="0.4"
      />
    );
  }

  // Longitude lines (every 30°)
  for (let lng = -180; lng <= 180; lng += 30) {
    lines.push(
      <line
        key={`lng-${lng}`}
        x1={((lng + 180) / 360) * 100 + '%'}
        y1="0"
        x2={((lng + 180) / 360) * 100 + '%'}
        y2="100%"
        stroke="var(--color-map-graticule)"
        strokeWidth="0.5"
        opacity="0.4"
      />
    );
  }

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {lines}
    </svg>
  );
}
