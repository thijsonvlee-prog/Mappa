import { useState, useCallback } from 'react';

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const ZOOM_STEP = 2;
const DEFAULT_CENTER: [number, number] = [20, 0];

interface MapPosition {
  center: [number, number];
  zoom: number;
}

export function useMapInteraction(initialCenter?: [number, number], initialZoom?: number) {
  const [position, setPosition] = useState<MapPosition>({
    center: initialCenter ?? DEFAULT_CENTER,
    zoom: initialZoom ?? MIN_ZOOM,
  });

  const handleMoveEnd = useCallback((pos: MapPosition) => {
    setPosition(pos);
  }, []);

  const zoomIn = useCallback(() => {
    setPosition((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom * ZOOM_STEP, MAX_ZOOM),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setPosition((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom / ZOOM_STEP, MIN_ZOOM),
    }));
  }, []);

  const resetView = useCallback(() => {
    setPosition({
      center: initialCenter ?? DEFAULT_CENTER,
      zoom: MIN_ZOOM,
    });
  }, [initialCenter]);

  return {
    position,
    handleMoveEnd,
    zoomIn,
    zoomOut,
    resetView,
  };
}
