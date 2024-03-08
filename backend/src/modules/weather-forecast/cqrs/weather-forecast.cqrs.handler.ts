import { IInferredQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  GetLocationNamesWeatherQuery,
  GetWeatherForecastQuery
} from './weather-forecast.input';
import { WeatherForecastService } from '../weather-forecast.service';
import { TypedQueryResult } from '@app/common/abstract/abstract-record-query.interface';
import { Logger } from '@nestjs/common';

// ================ QUERY
@QueryHandler(GetLocationNamesWeatherQuery)
export class GetLocationNamesWeatherQueryHandler
  implements IInferredQueryHandler<GetLocationNamesWeatherQuery>
{
  constructor(readonly service: WeatherForecastService) {}
  async execute(
    query: GetLocationNamesWeatherQuery
  ): Promise<TypedQueryResult<GetLocationNamesWeatherQuery>> {
    const { coordinates } = query;

    try {
      const data = await this.service.geoDecodeCoordinatesToLocations(
        coordinates
      );
      return { success: true, data };
    } catch (error) {
      Logger.error(`Failed to find locations: ${error}`);
      return { success: false, message: error.message, data: null };
    }
  }
}

@QueryHandler(GetWeatherForecastQuery)
export class GetWeatherForecastQueryHandler
  implements IInferredQueryHandler<GetWeatherForecastQuery>
{
  constructor(readonly service: WeatherForecastService) {}
  async execute(
    query: GetWeatherForecastQuery
  ): Promise<TypedQueryResult<GetWeatherForecastQuery>> {
    const { dateTime } = query;

    try {
      const data = await this.service.sendWeatherForecastRequest(dateTime);
      return { success: true, data };
    } catch (error) {
      Logger.error(`Failed to find weather forecast: ${error}`);
      return { success: false, message: error.message, data: null };
    }
  }
}
