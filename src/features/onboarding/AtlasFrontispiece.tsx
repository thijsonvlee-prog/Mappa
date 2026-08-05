import { ComposableMap, Geographies, Geography } from '@vnedyalk0v/react19-simple-maps';
import worldData from '@/data/world-110m.json';

// Static, non-interactive world silhouette used once as the onboarding
// title-page backdrop — the atlas's own subject matter standing in for a
// generic hero icon.
export function AtlasFrontispiece() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.16]">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 130 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={worldData as any}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: 'var(--color-foreground)',
                    stroke: 'none',
                    outline: 'none',
                  },
                  hover: { fill: 'var(--color-foreground)', outline: 'none' },
                  pressed: { fill: 'var(--color-foreground)', outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
