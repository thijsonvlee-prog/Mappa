interface MapCompassProps {
  size?: number;
}

export function MapCompass({ size = 48 }: MapCompassProps) {
  const strokeWidth = 1;
  const radius = size / 2 - 2;
  const center = size / 2;

  return (
    <div className="absolute bottom-20 right-4 opacity-40 pointer-events-none">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
        }}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-foreground-muted)"
          strokeWidth={strokeWidth}
        />

        <line
          x1={center}
          y1={center - radius + 6}
          x2={center}
          y2={center - 8}
          stroke="var(--color-foreground-muted)"
          strokeWidth={strokeWidth}
        />
        <line
          x1={center + radius - 6}
          y1={center}
          x2={center + 8}
          y2={center}
          stroke="var(--color-foreground-muted)"
          strokeWidth={strokeWidth}
        />
        <line
          x1={center}
          y1={center + radius - 6}
          x2={center}
          y2={center + 8}
          stroke="var(--color-foreground-muted)"
          strokeWidth={strokeWidth}
        />
        <line
          x1={center - radius + 6}
          y1={center}
          x2={center - 8}
          y2={center}
          stroke="var(--color-foreground-muted)"
          strokeWidth={strokeWidth}
        />

        <text
          x={center}
          y={center - radius + 14}
          textAnchor="middle"
          fontSize="8"
          fill="var(--color-foreground-muted)"
          fontFamily="var(--font-mono)"
        >
          N
        </text>
        <text
          x={center + radius - 10}
          y={center + 4}
          textAnchor="middle"
          fontSize="8"
          fill="var(--color-foreground-muted)"
          fontFamily="var(--font-mono)"
        >
          E
        </text>
      </svg>
    </div>
  );
}
