import { Query as TypeQuery } from '@nestjs-architects/typed-cqrs';
import { RecordResponseProps } from '@app/common';
import { Coordinates } from '@modules/traffic/dto/traffic.dto';
import { WeatherForecastResponseBody } from '../dto/weather-forecast.dto';

// ================ QUERY
export class GetLocationNamesWeatherQuery extends TypeQuery<
  RecordResponseProps<string[]>
> {
  constructor(readonly coordinates: Coordinates[]) {
    super();
  }
}

export class GetWeatherForecastQuery extends TypeQuery<
  RecordResponseProps<WeatherForecastResponseBody>
> {
  constructor(readonly dateTime?: string) {
    super();
  }
}
