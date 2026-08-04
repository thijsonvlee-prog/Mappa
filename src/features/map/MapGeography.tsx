import React, { useCallback, useState } from 'react';
import { Geography } from '@vnedyalk0v/react19-simple-maps';
import { useCountryStore } from '@/stores/country-store';
import { useCountryColor } from './hooks/useCountryColor';

interface MapGeographyProps {
  geography: any;
  countryCode: string;
  onHover: (code: string | null, geo: any, event: React.MouseEvent) => void;
  onClick: (code: string, geo: any, event: React.MouseEvent) => void;
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

  const { getFill, getHoverFill } = useCountryColor();
  const [isHovered, setIsHovered] = useState(false);

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
      onClick(countryCode, geography, event);
    },
    [countryCode, geography, onClick],
  );

  return (
    <Geography
      geography={geography}
      fill={isHovered ? getHoverFill(status) : getFill(status)}
      stroke="var(--color-map-stroke)"
      strokeWidth={0.5}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        default: { outline: 'none' },
        hover: { outline: 'none', cursor: 'pointer' },
        pressed: { outline: 'none' },
      }}
    />
  );
});
