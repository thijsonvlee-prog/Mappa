// Subtle compass rose in bottom-right corner
// Shows cardinal directions (N, O, Z, W)

export function MapCompass() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '80px',
        right: '20px',
        width: '60px',
        height: '60px',
        pointerEvents: 'none',
        opacity: 0.3,
      }}
    >
      <svg
        viewBox="0 0 60 60"
        width="100%"
        height="100%"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
      >
        {/* Outer circle */}
        <circle cx="30" cy="30" r="28" fill="none" stroke="var(--color-foreground-muted)" strokeWidth="0.5" />

        {/* Cardinal points */}
        <line x1="30" y1="8" x2="30" y2="14" stroke="var(--color-foreground-muted)" strokeWidth="1" />
        <line x1="52" y1="30" x2="46" y2="30" stroke="var(--color-foreground-muted)" strokeWidth="1" />
        <line x1="30" y1="52" x2="30" y2="46" stroke="var(--color-foreground-muted)" strokeWidth="1" />
        <line x1="8" y1="30" x2="14" y2="30" stroke="var(--color-foreground-muted)" strokeWidth="1" />

        {/* Text labels */}
        <text x="30" y="22" textAnchor="middle" fontSize="8" fill="var(--color-foreground-muted)" fontWeight="500">
          N
        </text>
        <text x="40" y="33" textAnchor="middle" fontSize="7" fill="var(--color-foreground-muted)" fontWeight="400">
          O
        </text>
        <text x="30" y="43" textAnchor="middle" fontSize="8" fill="var(--color-foreground-muted)" fontWeight="500">
          Z
        </text>
        <text x="20" y="33" textAnchor="middle" fontSize="7" fill="var(--color-foreground-muted)" fontWeight="400">
          W
        </text>

        {/* Center dot */}
        <circle cx="30" cy="30" r="2" fill="var(--color-foreground-muted)" />
      </svg>
    </div>
  );
}
