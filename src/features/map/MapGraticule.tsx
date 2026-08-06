// Subtle gridlines for latitude/longitude reference.
// Renders at 30° intervals when the map is zoomed out (zoom < 4).

const SWEEP_MS = 700;

export function MapGraticule({ zoom }: { zoom: number }) {
  // Don't show graticule when zoomed in
  if (zoom > 4) return null;

  const lines = [];

  // Latitude lines (every 30°). Delay grows with distance from the equator so
  // the grid plots itself outward from the middle, like a chart being surveyed.
  for (let lat = -60; lat <= 60; lat += 30) {
    const y = ((lat + 90) / 180) * 100 + '%';
    lines.push(
      <line
        key={`lat-${lat}`}
        x1="0"
        y1={y}
        x2="100%"
        y2={y}
        stroke="var(--color-map-graticule)"
        strokeWidth="0.5"
        opacity="0.4"
        className="graticule-line"
        style={{ animationDelay: `${(Math.abs(lat) / 60) * 220}ms` }}
      />,
    );
  }

  // Longitude lines (every 30°)
  for (let lng = -180; lng <= 180; lng += 30) {
    const x = ((lng + 180) / 360) * 100 + '%';
    lines.push(
      <line
        key={`lng-${lng}`}
        x1={x}
        y1="0"
        x2={x}
        y2="100%"
        stroke="var(--color-map-graticule)"
        strokeWidth="0.5"
        opacity="0.4"
        className="graticule-line"
        style={{ animationDelay: `${(Math.abs(lng) / 180) * 220}ms` }}
      />,
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
        ['--graticule-sweep-ms' as string]: `${SWEEP_MS}ms`,
      }}
    >
      {lines}
    </svg>
  );
}
