import { useState, useCallback, useMemo } from 'react';
import { ComposableMap, ZoomableGroup, Geographies } from '@vnedyalk0v/react19-simple-maps';
import worldData from '@/data/world-110m.json';
import { resolveIsoCode } from '@/data/iso-topojson-map';
import { MapGeography, type MapPoint } from './MapGeography';
import { MapTooltip } from './MapTooltip';
import { MapControls } from './MapControls';
import { MapLegend } from './MapLegend';
import { MapGraticule } from './MapGraticule';
import { MapCompass } from './MapCompass';
import { MapScale } from './MapScale';
import { CountryQuickPanel } from './CountryQuickPanel';
import { CountryInkBloom } from './CountryInkBloom';
import { MapInvitation } from './MapInvitation';
import { useMapInteraction } from './hooks/useMapInteraction';
import { bearingTo } from './hooks/useCompassBearing';
import { useCountryColor } from './hooks/useCountryColor';
import { useSettingsStore } from '@/stores/settings-store';
import { useCountryStore } from '@/stores/country-store';
import { getCountry } from '@/data/countries-lookup';
import { cn } from '@/lib/utils';

interface HoverState {
  code: string | null;
  position: { x: number; y: number };
  name: string;
}

interface ClickState {
  code: string | null;
  position: { x: number; y: number };
}

interface WorldMapProps {
  className?: string;
}

export function WorldMap({ className }: WorldMapProps) {
  const { position, handleMoveEnd, zoomIn, zoomOut, resetView } = useMapInteraction();
  const mapProjection = useSettingsStore((s) => s.mapProjection);
  const lastMarked = useCountryStore((s) => s.lastMarked);
  // Scalar selector: flips exactly once, on the very first country marked.
  const isAtlasEmpty = useCountryStore((s) => s.visits.size === 0);
  const homeCountry = useSettingsStore((s) => s.homeCountry);
  const { getFill } = useCountryColor();

  const [hover, setHover] = useState<HoverState>({
    code: null,
    position: { x: 0, y: 0 },
    name: '',
  });

  const [click, setClick] = useState<ClickState>({
    code: null,
    position: { x: 0, y: 0 },
  });

  // Where the ink starts. Null when the mark came from the country list or the
  // detail sheet rather than a tap, in which case the bloom falls back to the
  // country's own centre.
  const [inkOrigin, setInkOrigin] = useState<MapPoint | null>(null);

  const handleHover = useCallback(
    (code: string | null, geo: any, event: React.MouseEvent) => {
      if (code) {
        setHover({
          code,
          position: { x: event.clientX, y: event.clientY },
          name: String(geo.properties?.name ?? ''),
        });
      } else {
        setHover((prev) => ({ ...prev, code: null }));
      }
    },
    [],
  );

  const handleClick = useCallback(
    (code: string, _geo: any, event: React.MouseEvent, point: MapPoint | null) => {
      setInkOrigin(point);
      setClick({
        code,
        position: { x: event.clientX, y: event.clientY },
      });
    },
    [],
  );

  const handleClosePanel = useCallback(() => {
    setClick({ code: null, position: { x: 0, y: 0 } });
  }, []);

  // Only hand-made marks animate — bulk writes from onboarding or import must
  // never bloom or swing the needle.
  const activeMark = lastMarked?.origin === 'user' ? lastMarked : null;

  const bearing = useMemo(() => {
    if (!activeMark) return null;
    const country = getCountry(activeMark.countryCode);
    if (!country) return null;
    return bearingTo(position.center as [number, number], country.coordinates);
  }, [activeMark, position.center]);

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      <ComposableMap
        projection={mapProjection}
        projectionConfig={{ scale: 147 }}
        style={{ width: '100%', height: '100%', background: 'var(--color-map-water)' }}
      >
        <ZoomableGroup
          center={position.center as any}
          zoom={position.zoom}
          onMoveEnd={handleMoveEnd as any}
        >
          <Geographies geography={worldData as any}>
            {({ geographies }: { geographies: any[] }) => {
              const nodes: React.ReactNode[] = geographies.map((geo) => {
                const isoCode = resolveIsoCode(geo);
                if (!isoCode) return null;
                return (
                  <MapGeography
                    key={geo.rsmKey}
                    geography={geo}
                    countryCode={isoCode}
                    onHover={handleHover}
                    onClick={handleClick}
                  />
                );
              });

              // An empty atlas gets a single breathing country as an
              // invitation to start. Only ever present in the zero-country
              // state, so it never competes with the marking animation.
              if (isAtlasEmpty) {
                const invite = geographies.find(
                  (geo) => resolveIsoCode(geo) === (homeCountry ?? 'NL'),
                );
                if (invite) {
                  nodes.push(<MapInvitation key="invitation" geography={invite} />);
                }
              }

              // Exactly one animated node, drawn over the plain geographies.
              // Rendered inside this render prop so it inherits the same
              // projection context as the paths underneath it.
              if (activeMark) {
                const markedGeo = geographies.find(
                  (geo) => resolveIsoCode(geo) === activeMark.countryCode,
                );
                if (markedGeo) {
                  nodes.push(
                    <CountryInkBloom
                      key={`ink-${activeMark.countryCode}-${activeMark.at}`}
                      geography={markedGeo}
                      fill={getFill(activeMark.status)}
                      origin={inkOrigin}
                    />,
                  );
                }
              }

              return nodes;
            }}
          </Geographies>
          <MapGraticule zoom={position.zoom} />
        </ZoomableGroup>
      </ComposableMap>

      <MapCompass bearing={bearing} />
      <MapScale zoom={position.zoom} />

      <MapControls onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />
      <MapLegend />

      <MapTooltip
        countryCode={hover.code}
        position={hover.position}
        countryName={hover.name}
      />

      <CountryQuickPanel
        countryCode={click.code}
        position={click.position}
        onClose={handleClosePanel}
      />
    </div>
  );
}
