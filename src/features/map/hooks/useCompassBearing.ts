const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/**
 * Initial great-circle bearing from the map's centre to a target point, in
 * degrees clockwise from north.
 *
 * Computed in geographic space rather than screen space, so it stays correct
 * across all three map projections the app offers.
 *
 * @param center Map centre as d3 gives it: [longitude, latitude]
 * @param target Country coordinates as the data stores them: [latitude, longitude]
 */
export function bearingTo(
  center: [number, number] | undefined | null,
  target: [number, number] | undefined | null,
): number | null {
  // A decorative needle must never be able to take the map down with it.
  if (!Array.isArray(center) || !Array.isArray(target)) return null;

  const [lon1, lat1] = center;
  const [lat2, lon2] = target;
  if ([lon1, lat1, lat2, lon2].some((n) => typeof n !== 'number' || !Number.isFinite(n))) {
    return null;
  }

  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaLambda = toRad(lon2 - lon1);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}
