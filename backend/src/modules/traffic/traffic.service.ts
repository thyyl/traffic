import { HTTPClient } from '@app/common/helpers/http-client.helper';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Coordinates,
  TrafficTransportImagesResponseBody
} from './dto/traffic.dto';
import { WeatherForecastService } from '@modules/weather-forecast/weather-forecast.service';
import { GeoApifyService } from '@modules/geoapify/geoapify.service';

@Injectable()
export class TrafficService {
  private client: HTTPClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly weatherForecastService: WeatherForecastService,
    private readonly geoApifyService: GeoApifyService
  ) {
    this.client = new HTTPClient({
      baseURL: this.configService.get('sgApi').traffic
    });
  }

  async getAllAvailableLocations(dateTime?: string): Promise<string[]> {
    const trafficResponse = await this.sendTransportTrafficRequest(dateTime);

    const coordinates = this.extractCoordinatesFromResponse(trafficResponse);

    const test = await this.geoApifyService.getLocationFromCoordinates(
      coordinates
    );

    console.log(test);

    const locationsAvailable =
      await this.weatherForecastService.geoDecodeCoordinatesToLocations(
        coordinates,
        dateTime
      );

    return Array.from(new Set<string>(locationsAvailable)).sort();
  }

  // TODO: WRAP IN TRY CATCH
  private async sendTransportTrafficRequest(
    dateTime?: string
  ): Promise<TrafficTransportImagesResponseBody> {
    Logger.log('[TrafficService] Sending Get Request with:', dateTime);

    const { data } =
      await this.client.instance.get<TrafficTransportImagesResponseBody>(
        `${this.configService.get('sgApi').traffic}/traffic-images`,
        { params: { date_time: dateTime } }
      );

    Logger.log('[TrafficService] Data is successfully requested:');

    return data;
  }

  private extractCoordinatesFromResponse({
    items
  }: TrafficTransportImagesResponseBody): Coordinates[] {
    Logger.log('[TrafficService] Extracting coordinates from response');

    return items
      .map((item) => item.cameras)
      .flat()
      .map((camera) => camera.location)
      .map((location) => location);
  }
}
