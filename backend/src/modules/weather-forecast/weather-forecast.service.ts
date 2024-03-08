import { HTTPClient } from '@app/common/helpers/http-client.helper';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AreaMetadata,
  Coordinates,
  WeatherForecastResponseBody
} from './dto/weather-forecast.dto';

@Injectable()
export class WeatherForecastService {
  private client: HTTPClient;

  constructor(private readonly configService: ConfigService) {
    this.client = new HTTPClient({
      baseURL: this.configService.get('sgApi').weatherForecast
    });
  }

  // TODO: WRAP IN TRY CATCH
  async sendWeatherForecastRequest(
    dateTime?: string
  ): Promise<WeatherForecastResponseBody> {
    Logger.log('[WeatherForecastService] Sending Get Request');

    const { data } =
      await this.client.instance.get<WeatherForecastResponseBody>(
        '/v1/environment/2-hour-weather-forecast',
        { params: dateTime && { date_time: dateTime } }
      );

    Logger.log('[WeatherForecastService] Data is successfully requested:');

    return data;
  }

  async geoDecodeCoordinatesToLocations(
    coordinates: Coordinates[],
    dateTime?: string
  ): Promise<string[]> {
    Logger.log('[WeatherForecastService] Extracting coordinates from response');

    const weatherData = await this.sendWeatherForecastRequest(dateTime);

    const areaMetadata = this.extractCoordinatesFromResponse(weatherData);

    return coordinates.map((coordinate) => {
      const area = this.getNearestCoordinates(coordinate, areaMetadata);

      if (area) {
        const { name } = area;
        return name;
      }
    });
  }

  getNearestCoordinates(
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

  private extractCoordinatesFromResponse({
    area_metadata
  }: WeatherForecastResponseBody): AreaMetadata[] {
    Logger.log('[WeatherForecastService] Extracting coordinates from response');
    return area_metadata.map((area) => area);
  }

  private calculateDistance(
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

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
