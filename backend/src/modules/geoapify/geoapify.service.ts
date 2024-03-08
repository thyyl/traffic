import {
  Coordinates,
  TrafficLocationResponseBody
} from '@modules/traffic/dto/traffic.dto';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  GeoApifyResponse,
  PostReverseResponseBody,
  ReverseLocationResponse
} from './dto/geoapify.dto';
import { UtilsHelper } from '@app/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetReadAsideCachedData } from '@modules/cache/cqrs/cache.cqrs.input';
import {
  GeoApifyCommandException,
  GeoApifyQueryException
} from '@app/common/exceptions/geo-apify.exception';

@Injectable()
export class GeoApifyService {
  constructor(
    private readonly configService: ConfigService,
    private readonly queryBus: QueryBus
  ) {}

  async postReverseGeocodingRequest(coordinates: Coordinates[]): Promise<any> {
    try {
      Logger.log('[GeoApifyService] Sending Post Request');
      const coordinatesParams = this.buildCoordinatesParams(coordinates);

      const { data } = await axios.post<PostReverseResponseBody>(
        `${
          this.configService.get('geoApify').api
        }/v1/batch/geocode/reverse?apiKey=${
          this.configService.get('geoApify').apiKey
        }`,
        coordinatesParams
      );

      Logger.log('[GeoApifyService] Data is successfully requested:');

      return data;
    } catch (error) {
      Logger.error('[GeoApifyService] Error in sending Post Request');
      throw new GeoApifyCommandException(error.message, '[GeoApifyService]');
    }
  }

  async getLocationFromCoordinatesRequest(
    coordinates: Coordinates[]
  ): Promise<GeoApifyResponse> {
    const { url } = await this.postReverseGeocodingRequest(coordinates);

    Logger.log('[GeoApifyService] Extracting location from url:', url);

    try {
      let response: GeoApifyResponse;

      while (true) {
        const { data } = await axios.get<GeoApifyResponse>(url);

        Logger.log('[GeoApifyService] Data is successfully requested');

        if ('status' in data && data.status === 'pending') {
          Logger.log(
            '[GeoApifyService] Data is processing. Waiting for response'
          );
          await new Promise((resolve) => setTimeout(resolve, 7500));
        } else {
          response = data;
          break;
        }
      }

      return response;
    } catch (error) {
      Logger.error('[GeoApifyService] Error in getting location from url');
      throw new GeoApifyQueryException(error.message, '[GeoApifyService]');
    }
  }

  async getLocationFromCoordinates(
    dateTime: string,
    coordinates: Coordinates[]
  ): Promise<TrafficLocationResponseBody[]> {
    const key = UtilsHelper.buildKey('GEO_APIFY', 'GEO_APIFY_ITEM', dateTime);

    const { data: response } = await this.queryBus.execute(
      new GetReadAsideCachedData<GeoApifyResponse>(
        key,
        () => this.getLocationFromCoordinatesRequest(coordinates),
        dateTime
      )
    );

    return this.extractLocationNamesFromResponse(
      response as ReverseLocationResponse[]
    );
  }

  private buildCoordinatesParams(coordinates: Coordinates[]): number[][] {
    return coordinates.map(({ longitude, latitude }) => [longitude, latitude]);
  }

  private extractLocationNamesFromResponse(
    response: ReverseLocationResponse[]
  ): TrafficLocationResponseBody[] {
    return response.map((res) => ({
      location: res.formatted,
      latitude: res.query.lat,
      longitude: res.query.lon
    }));
  }
}
