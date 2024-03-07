import { HTTPClient } from '@app/common/helpers/http-client.helper';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Coordinates,
  TrafficTransportImagesResponseBody
} from './dto/traffic.dto';

@Injectable()
export class TrafficService {
  private client: HTTPClient;

  constructor(private readonly configService: ConfigService) {
    this.client = new HTTPClient({
      baseURL: this.configService.get('sgApi').traffic
    });
  }

  async getAllAvailableLocations(dateTime?: Date): Promise<string[]> {
    const trafficResponse = await this.sendTransportTrafficRequest(dateTime);

    const coordinates = this.extractCoordinatesFromResponse(trafficResponse);

    return [];
  }

  // TODO: WRAP IN TRY CATCH
  private async sendTransportTrafficRequest(
    dateTime?: Date
  ): Promise<TrafficTransportImagesResponseBody> {
    Logger.log('[TrafficService] Sending Get Request with:', dateTime);

    const { data } =
      await this.client.instance.get<TrafficTransportImagesResponseBody>(
        '/v1/transport/traffic-images',
        { params: dateTime && { date_time: dateTime } }
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
