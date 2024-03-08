import { HTTPClient } from '@app/common/helpers/http-client.helper';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AreaMetadata,
  Coordinates,
  WeatherForecastResponseBody
} from './dto/weather-forecast.dto';
import { DistanceCalculator } from '@app/common/helpers/distance-calculator';

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
        '/2-hour-weather-forecast',
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
      const distance = DistanceCalculator.calculateDistance(
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
}