import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Geography } from '@vnedyalk0v/react19-simple-maps';
import { useCountryStore } from '@/stores/country-store';
import { useCountryColor } from './hooks/useCountryColor';
import { INK_SPREAD_MS } from '@/lib/motion';

export interface MapPoint {
  x: number;
  y: number;
}

interface MapGeographyProps {
  geography: any;
  countryCode: string;
  onHover: (code: string | null, geo: any, event: React.MouseEvent) => void;
  onClick: (code: string, geo: any, event: React.MouseEvent, point: MapPoint | null) => void;
}

/**
 * Converts a pointer event into the coordinate space of the element it hit —
 * for a geography that is the zoom group's user space, the same space the ink
 * bloom overlay measures itself in.
 */
function toUserSpace(event: React.MouseEvent): MapPoint | null {
  const el = event.currentTarget as SVGGraphicsElement;
  const ctm = typeof el.getScreenCTM === 'function' ? el.getScreenCTM() : null;
  if (!ctm) return null;
  const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse());
  return { x: point.x, y: point.y };
}

export const MapGeography = React.memo(function MapGeography({
  geography,
  countryCode,
  onHover,
  onClick,
}: MapGeographyProps) {
  const status = useCountryStore(
    useCallback((s) => s.visits.get(countryCode)?.status, [countryCode]),
  );

  // A scalar selector, so marking re-renders at most the two countries whose
  // blooming state actually flipped — not all ~170 geographies on the map.
  const isBlooming = useCountryStore(
    useCallback(
      (s) => s.lastMarked?.countryCode === countryCode && s.lastMarked.origin === 'user',
      [countryCode],
    ),
  );

  const { getFill, getHoverFill } = useCountryColor();
  const [isHovered, setIsHovered] = useState(false);

  // The colour painted underneath the bloom. It deliberately lags the real
  // status for the length of the ink spread: if this repainted immediately the
  // overlay would be laying the new colour onto the same new colour, and the
  // bloom would be invisible.
  const [displayStatus, setDisplayStatus] = useState(status);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      setDisplayStatus(status);
      return;
    }
    if (status === displayStatus) return;

    if (!isBlooming) {
      setDisplayStatus(status);
      return;
    }
    const timer = setTimeout(() => setDisplayStatus(status), INK_SPREAD_MS);
    return () => clearTimeout(timer);
  }, [status, displayStatus, isBlooming]);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent) => {
      setIsHovered(true);
      onHover(countryCode, geography, event);
    },
    [countryCode, geography, onHover],
  );

  const handleMouseLeave = useCallback(
    (event: React.MouseEvent) => {
      setIsHovered(false);
      onHover(null, geography, event);
    },
    [geography, onHover],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      onClick(countryCode, geography, event, toUserSpace(event));
    },
    [countryCode, geography, onClick],
  );

  return (
    <Geography
      geography={geography}
      fill={isHovered ? getHoverFill(displayStatus) : getFill(displayStatus)}
      stroke={isBlooming ? 'var(--color-primary)' : 'var(--color-map-stroke)'}
      strokeWidth={isBlooming ? 1.5 : 0.5}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        default: {
          outline: 'none',
          // The squash-and-pop lives here rather than on the ink overlay: this
          // path carries no mask, so scaling it is cheap, whereas transforming
          // the masked overlay forced a full mask re-rasterisation every frame.
          transition: isBlooming
            ? 'stroke-width 300ms ease-out, stroke 300ms ease-out'
            : 'none',
          animation: isBlooming
            ? 'countryMarkPop 420ms cubic-bezier(0.34, 1.56, 0.64, 1)'
            : 'none',
        },
        hover: { outline: 'none', cursor: 'pointer' },
        pressed: { outline: 'none' },
      }}
    />
  );
});
