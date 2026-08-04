import { useState, useCallback } from 'react';
import { ComposableMap, ZoomableGroup, Geographies } from '@vnedyalk0v/react19-simple-maps';
import worldData from '@/data/world-110m.json';
import { resolveIsoCode } from '@/data/iso-topojson-map';
import { MapGeography } from './MapGeography';
import { MapTooltip } from './MapTooltip';
import { MapControls } from './MapControls';
import { MapLegend } from './MapLegend';
import { CountryQuickPanel } from './CountryQuickPanel';
import { useMapInteraction } from './hooks/useMapInteraction';
import { useSettingsStore } from '@/stores/settings-store';
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

  const [hover, setHover] = useState<HoverState>({
    code: null,
    position: { x: 0, y: 0 },
    name: '',
  });

  const [click, setClick] = useState<ClickState>({
    code: null,
    position: { x: 0, y: 0 },
  });

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

  const handleClick = useCallback((code: string, _geo: any, event: React.MouseEvent) => {
    setClick({
      code,
      position: { x: event.clientX, y: event.clientY },
    });
  }, []);

  const handleClosePanel = useCallback(() => {
    setClick({ code: null, position: { x: 0, y: 0 } });
  }, []);

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
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo) => {
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
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

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
