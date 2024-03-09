import { HTTPClient } from '@app/common/helpers/http-client.helper';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Coordinates,
  TrafficLocationDetailsResponseBody,
  TrafficLocationResponseBody,
  TrafficTransportImagesResponseBody
} from './dto/traffic.dto';
import {
  TrafficLocationCode,
  TrafficLocationStrategy
} from './strategy/traffic-location.strategy';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetReadAsideCachedData } from '@modules/cache/cqrs/cache.cqrs.input';
import { UtilsHelper } from '@app/common';
import { TrafficTransportQueryException } from '@app/common/exceptions/traffic.exception';
import { CreateOneAuditLogCommand } from '@modules/audit-log/cqrs/audit-log.cqrs.input';

@Injectable()
export class TrafficService {
  private client: HTTPClient;
  private readonly trafficLocationStrategy: {
    [code: string]: TrafficLocationStrategy;
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
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

  async getAllAvailableLocations(
    dateTime: string
  ): Promise<TrafficLocationResponseBody[]> {
    const key = UtilsHelper.buildKey('TRAFFIC', 'TRAFFIC_ITEM', dateTime);

    const { data: trafficResponse } = await this.queryBus.execute(
      new GetReadAsideCachedData<TrafficTransportImagesResponseBody>(
        key,
        () => this.sendTransportTrafficRequest(dateTime),
        dateTime
      )
    );

    const coordinates = this.extractCoordinatesFromResponse(trafficResponse);
    const strategy = this.trafficLocationStrategy[TrafficLocationCode.SG_DATA];
    return strategy.getLocationsFromCoordinates(dateTime, coordinates);
  }

  async getLocationDetails(
    dateTime: string,
    location: string,
    longitude: number,
    latitude: number
  ): Promise<TrafficLocationDetailsResponseBody> {
    const key = UtilsHelper.buildKey('TRAFFIC', 'TRAFFIC_ITEM', dateTime);

    this.fireAuditLogCommand(dateTime, location, longitude, latitude);

    const { data: trafficResponse } = await this.queryBus.execute(
      new GetReadAsideCachedData<TrafficTransportImagesResponseBody>(
        key,
        () => this.sendTransportTrafficRequest(dateTime),
        dateTime
      )
    );

    return this.compareLocationSelectedByCoordinates(trafficResponse, {
      latitude,
      longitude
    });
  }

  private async sendTransportTrafficRequest(
    dateTime: string
  ): Promise<TrafficTransportImagesResponseBody> {
    try {
      Logger.log('[TrafficService] Sending Get Request with:', dateTime);

      const { data } =
        await this.client.instance.get<TrafficTransportImagesResponseBody>(
          `/traffic-images`,
          { params: { date_time: dateTime } }
        );

      Logger.log('[TrafficService] Data is successfully requested:');

      return data;
    } catch (e) {
      Logger.error(`[TrafficService] Error: ${e.message}`);
      throw new TrafficTransportQueryException(e.message, '[TrafficService]');
    }
  }

  private async compareLocationSelectedByCoordinates(
    { items }: TrafficTransportImagesResponseBody,
    { longitude, latitude }: Coordinates
  ): Promise<TrafficLocationDetailsResponseBody> {
    const location = items
      .map((item) => item.cameras)
      .flat()
      .map(({ image, location }) => ({
        image,
        latitude: location.latitude,
        longitude: location.longitude
      }))
      .find(
        ({ latitude: mappedLatitude, longitude: mappedLongitude }) =>
          mappedLongitude === longitude && mappedLatitude === latitude
      );

    if (!location) {
      throw new TrafficTransportQueryException(
        'Location not found',
        '[TrafficService]'
      );
    }

    return location;
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

  private async fireAuditLogCommand(
    dateTime: string,
    location: string,
    longitude: number,
    latitude: number
  ) {
    this.commandBus.execute(
      new CreateOneAuditLogCommand({
        input: {
          dateSearched: new Date(dateTime),
          location,
          latitude,
          longitude
        },
        options: { silence: true }
      })
    );
  }
}
