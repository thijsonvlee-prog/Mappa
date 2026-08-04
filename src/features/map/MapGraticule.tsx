interface MapGraticuleProps {
  projection?: string;
  zoom: number;
}

export function MapGraticule({ zoom }: MapGraticuleProps) {
  if (zoom > 4) return null;

  const lines = [];
  const step = 30;
  const opacity = 0.15 - (zoom * 0.03);

  for (let lat = -90; lat <= 90; lat += step) {
    lines.push(
      <line
        key={`lat-${lat}`}
        x1="-180"
        y1={lat}
        x2="180"
        y2={lat}
        stroke="var(--color-map-graticule)"
        strokeWidth="0.5"
        opacity={Math.max(0.05, opacity)}
      />
    );
  }

  for (let lng = -180; lng <= 180; lng += step) {
    lines.push(
      <line
        key={`lng-${lng}`}
        x1={lng}
        y1="-90"
        x2={lng}
        y2="90"
        stroke="var(--color-map-graticule)"
        strokeWidth="0.5"
        opacity={Math.max(0.05, opacity)}
      />
    );
  }

  return (
    <svg
      viewBox="-180 -90 360 180"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <g>{lines}</g>
    </svg>
  );
}
