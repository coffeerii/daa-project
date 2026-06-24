function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function haversineDistanceKm(
  userLat: number,
  userLng: number,
  pharmacyLat: number,
  pharmacyLng: number
): number {
  const earthRadiusKm = 6371;

  const latDifference = toRadians(pharmacyLat - userLat);
  const lngDifference = toRadians(pharmacyLng - userLng);

  const userLatRad = toRadians(userLat);
  const pharmacyLatRad = toRadians(pharmacyLat);

  const a =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(userLatRad) *
      Math.cos(pharmacyLatRad) *
      Math.sin(lngDifference / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}