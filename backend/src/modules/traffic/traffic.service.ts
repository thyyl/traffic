import { HTTPClient } from '@app/common/helpers/http-client.helper';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Coordinates,
  TrafficTransportImagesResponseBody
} from './dto/traffic.dto';
import {
  TrafficLocationCode,
  TrafficLocationStrategy
} from './strategy/traffic-location.strategy';
import { QueryBus } from '@nestjs/cqrs';
import { GetReadAsideCachedData } from '@modules/cache/cqrs/cache.cqrs.input';
import { UtilsHelper } from '@app/common';

@Injectable()
export class TrafficService {
  private client: HTTPClient;
  private readonly trafficLocationStrategy: {
    [code: string]: TrafficLocationStrategy;
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly queryBus: QueryBus
  ) {
    this.client = new HTTPClient({
      baseURL: this.configService.get('sgApi').traffic
    });
    this.trafficLocationStrategy = (
      this.configService.get('strategy').locations as TrafficLocationStrategy[]
    ).reduce(
      (hash, strategy) =>
        Array.isArray(strategy.code)
          ? strategy.code.map((subCode) => ({ ...hash, [subCode]: strategy }))
          : { ...hash, [strategy.code]: strategy },
      {}
    );
  }

  async getAllAvailableLocations(dateTime: string): Promise<string[]> {
    const key = UtilsHelper.buildKey('TRAFFIC', 'TRAFFIC_ITEM', dateTime);

    const { data: trafficResponse } = await this.queryBus.execute(
      new GetReadAsideCachedData<TrafficTransportImagesResponseBody>(
        key,
        () => this.sendTransportTrafficRequest(dateTime),
        dateTime
      )
    );

    const coordinates = this.extractCoordinatesFromResponse(trafficResponse);

    const strategy =
      this.trafficLocationStrategy[TrafficLocationCode.GEO_APIFY];

    const locationsAvailable = await strategy.getLocationsFromCoordinates(
      dateTime,
      coordinates
    );

    return Array.from(new Set<string>(locationsAvailable)).sort();
  }

  // TODO: WRAP IN TRY CATCH
  private async sendTransportTrafficRequest(
    dateTime: string
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
