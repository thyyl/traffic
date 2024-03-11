import { HTTPClient } from '@app/common/helpers/http-client.helper';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AreaMetadata,
  Coordinates,
  WeatherForecastResponseBody
} from './dto/weather-forecast.dto';
import { DistanceCalculator } from '@app/common/helpers/distance-calculator';
import { QueryBus } from '@nestjs/cqrs';
import { GetReadAsideCachedData } from '@modules/cache/cqrs/cache.cqrs.input';
import { UtilsHelper } from '@app/common';
import { WeatherForecastQueryException } from '@app/common/exceptions/weather-forecast.exception';
import { TrafficLocationResponseBody } from '@modules/traffic/dto/traffic.dto';

@Injectable()
export class WeatherForecastService {
  private client: HTTPClient;
  private readonly logger = new Logger(WeatherForecastService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly queryBus: QueryBus
  ) {
    this.client = new HTTPClient({
      baseURL: this.configService.get('sgApi').weatherForecast
    });
  }

  async sendWeatherForecastRequest(
    dateTime: string
  ): Promise<WeatherForecastResponseBody> {
    try {
      this.logger.log('[WeatherForecastService] Sending Get Request');

      const { data } =
        await this.client.instance.get<WeatherForecastResponseBody>(
          '/2-hour-weather-forecast',
          { params: dateTime && { date_time: dateTime } }
        );

      this.logger.log(
        '[WeatherForecastService] Data is successfully requested:'
      );

      return data;
    } catch (error) {
      this.logger.error(
        '[WeatherForecastService] Error in sending Get Request'
      );
      throw new WeatherForecastQueryException(
        error.message,
        '[WeatherForecast]'
      );
    }
  }

  async geoDecodeCoordinatesToLocations(
    dateTime: string,
    coordinates: Coordinates[]
  ): Promise<TrafficLocationResponseBody[]> {
    this.logger.log(
      '[WeatherForecastService] Extracting coordinates from response'
    );

    const key = UtilsHelper.buildKey('WEATHER', 'WEATHER_ITEM', dateTime);

    const { data: weatherData } = await this.queryBus.execute(
      new GetReadAsideCachedData<WeatherForecastResponseBody>(
        key,
        () => this.sendWeatherForecastRequest(dateTime),
        dateTime
      )
    );

    const { items } = weatherData;

    const areaMetadata = this.extractCoordinatesFromResponse(weatherData);

    return coordinates.map((coordinate) => {
      const area = DistanceCalculator.getNearestCoordinates(
        coordinate,
        areaMetadata
      );

      if (area) {
        const { name } = area;
        const forecast = items[0].forecasts.find(({ area }) => area === name);
        return {
          location: name,
          ...coordinate,
          weatherForecast: forecast.forecast
        };
      }
    });
  }

  async getWeatherForecast(
    data: TrafficLocationResponseBody[],
    dateTime: string
  ): Promise<TrafficLocationResponseBody[]> {
    this.logger.log(
      '[WeatherForecastService] Extracting coordinates from response'
    );

    const key = UtilsHelper.buildKey('WEATHER', 'WEATHER_ITEM', dateTime);

    const { data: weatherData } = await this.queryBus.execute(
      new GetReadAsideCachedData<WeatherForecastResponseBody>(
        key,
        () => this.sendWeatherForecastRequest(dateTime),
        dateTime
      )
    );

    const { items } = weatherData;

    const areaMetadata = this.extractCoordinatesFromResponse(weatherData);

    return data.map(({ latitude, longitude, location }) => {
      const area = DistanceCalculator.getNearestCoordinates(
        { latitude, longitude },
        areaMetadata
      );

      if (area) {
        const { name } = area;
        const forecast = items[0].forecasts.find(({ area }) => area === name);
        return {
          location,
          latitude,
          longitude,
          weatherForecast: forecast.forecast
        };
      }
    });
  }

  private extractCoordinatesFromResponse({
    area_metadata
  }: WeatherForecastResponseBody): AreaMetadata[] {
    this.logger.log(
      '[WeatherForecastService] Extracting coordinates from response'
    );
    return area_metadata.map((area) => area);
  }
}
