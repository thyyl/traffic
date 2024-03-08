import { Injector } from '@app/common/helpers/injector.helper';
import { Coordinates, TrafficLocationResponseBody } from '../dto/traffic.dto';
import { Logger } from '@nestjs/common';

let weatherForecastService: import('@modules/weather-forecast/weather-forecast.service').WeatherForecastService;
let geoApifyService: import('@modules/geoapify/geoapify.service').GeoApifyService;

export enum TrafficLocationCode {
  SG_DATA = 'SG_DATA',
  GEO_APIFY = 'GEO_APIFY'
}

interface TrafficLocationStrategyInterface {
  readonly code: TrafficLocationCode;
  readonly init: (injector: Injector) => void;
  readonly getLocationsFromCoordinates: (
    dateTime: string,
    coordinates: Coordinates[]
  ) => Promise<TrafficLocationResponseBody[]>;
}

export class TrafficLocationStrategy {
  readonly code: TrafficLocationCode;

  constructor(readonly config: TrafficLocationStrategyInterface) {
    this.code = config.code;
  }

  async init(injector: Injector) {
    this.config.init(injector);
  }

  async getLocationsFromCoordinates(
    dateTime: string,
    coordinates: Coordinates[]
  ): Promise<TrafficLocationResponseBody[]> {
    return this.config.getLocationsFromCoordinates(dateTime, coordinates);
  }
}

const WeatherForecastTrafficLocationStrategy = new TrafficLocationStrategy({
  code: TrafficLocationCode.SG_DATA,

  async init(injector: Injector) {
    const { WeatherForecastService } = await import(
      '@modules/weather-forecast/weather-forecast.service'
    );
    const { GeoApifyService } = await import(
      '@modules/geoapify/geoapify.service'
    );
    weatherForecastService = injector.get(WeatherForecastService);
    geoApifyService = injector.get(GeoApifyService);
  },

  async getLocationsFromCoordinates(
    dateTime: string,
    coordinates: Coordinates[]
  ) {
    try {
      return weatherForecastService.geoDecodeCoordinatesToLocations(
        dateTime,
        coordinates
      );
    } catch (error) {
      Logger.error(
        '[WeatherForecastTrafficLocationStrategy] Error in getting location from coordinates'
      );

      return geoApifyService.getLocationFromCoordinates(dateTime, coordinates);
    }
  }
});

const GeoApifyTrafficLocationStrategy = new TrafficLocationStrategy({
  code: TrafficLocationCode.GEO_APIFY,

  async init(injector: Injector) {
    const { GeoApifyService } = await import(
      '@modules/geoapify/geoapify.service'
    );
    geoApifyService = injector.get(GeoApifyService);
  },

  async getLocationsFromCoordinates(
    dateTime: string,
    coordinates: Coordinates[]
  ) {
    return await geoApifyService.getLocationFromCoordinates(
      dateTime,
      coordinates
    );
  }
});

export const TrafficLocationStrategies = [
  WeatherForecastTrafficLocationStrategy,
  GeoApifyTrafficLocationStrategy
];
