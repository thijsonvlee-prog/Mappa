// Adaptive map scale bar in bottom-left corner

export function MapScale({ zoom }: { zoom: number }) {
  // Calculate scale distance based on zoom level
  // At zoom 1: ~5000km, at zoom 2: ~2500km, etc.
  const scaleKm = Math.round(5000 / zoom);
  const scalePixels = Math.min(80, Math.max(30, scaleKm / 100));

  return (
    <div
      style={{
        position: 'absolute',
        top: '88px',
        right: '16px',
        pointerEvents: 'none',
        opacity: 0.5,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '4px',
          fontSize: '10px',
          color: 'var(--color-foreground-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {/* Scale bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <div
            style={{
              width: scalePixels,
              height: '2px',
              backgroundColor: 'var(--color-foreground-muted)',
              position: 'relative',
              // The bar re-measures itself as you zoom instead of snapping.
              transition: 'width 260ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Left tick */}
            <div
              style={{
                position: 'absolute',
                left: '0',
                top: '-4px',
                width: '1px',
                height: '10px',
                backgroundColor: 'var(--color-foreground-muted)',
              }}
            />
            {/* Right tick */}
            <div
              style={{
                position: 'absolute',
                right: '0',
                top: '-4px',
                width: '1px',
                height: '10px',
                backgroundColor: 'var(--color-foreground-muted)',
              }}
            />
          </div>
        </div>
        {/* Distance label */}
        <div style={{ fontSize: '9px' }}>
          {scaleKm >= 1000
            ? `${(scaleKm / 1000).toFixed(1)}k km`
            : `${scaleKm} km`}
        </div>
      </div>
    </div>
  );
}
