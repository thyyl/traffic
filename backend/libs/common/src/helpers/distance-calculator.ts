import { Coordinates } from '@modules/traffic/dto/traffic.dto';
import { AreaMetadata } from '@modules/weather-forecast/dto/weather-forecast.dto';

export class DistanceCalculator {
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private static deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  static getNearestCoordinates(
    currentCoordinate: Coordinates,
    coordinates: AreaMetadata[]
  ): AreaMetadata {
    const { latitude: currentLatitude, longitude: currentLongitude } =
      currentCoordinate;
    let nearestCoordinate: AreaMetadata;
    let shortestDistance = Number.MAX_VALUE;

    for (const coord of coordinates) {
      const distance = this.calculateDistance(
        currentLatitude,
        currentLongitude,
        coord.label_location.latitude,
        coord.label_location.longitude
      );
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestCoordinate = coord;
      }
    }

    return nearestCoordinate;
  }
}
