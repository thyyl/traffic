import { Coordinates } from '@modules/traffic/dto/traffic.dto';
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

@Injectable()
export class GeoApifyService {
  constructor(
    private readonly configService: ConfigService,
    private readonly queryBus: QueryBus
  ) {}

  async postReverseGeocodingRequest(coordinates: Coordinates[]): Promise<any> {
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
  }

  async getLocationFromCoordinatesRequest(
    coordinates: Coordinates[]
  ): Promise<GeoApifyResponse> {
    const { url } = await this.postReverseGeocodingRequest(coordinates);

    Logger.log('[GeoApifyService] Extracting location from url:', url);

    let response: GeoApifyResponse;

    while (true) {
      const { data } = await axios.get<GeoApifyResponse>(url);

      Logger.log('[GeoApifyService] Data is successfully requested');

      if ('status' in data && data.status === 'pending') {
        Logger.log('[GeoApifyService] Waiting for response');
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        response = data;
        break;
      }
    }

    return response;
  }

  async getLocationFromCoordinates(
    dateTime: string,
    coordinates: Coordinates[]
  ): Promise<string[]> {
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
  ): string[] {
    return response.map(
      (res) => res.suburb ?? res.city ?? res.county ?? res.state
    );
  }
}
