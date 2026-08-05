export function formatCoordinates([lat, lon]: [number, number]): string {
  const latLabel = lat >= 0 ? 'N' : 'S';
  const lonLabel = lon >= 0 ? 'O' : 'W';
  return `${Math.abs(lat).toFixed(2)}° ${latLabel}, ${Math.abs(lon).toFixed(2)}° ${lonLabel}`;
}
