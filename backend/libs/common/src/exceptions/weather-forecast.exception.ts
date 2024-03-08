import { BaseException } from './custom-errors.exception';

export class WeatherForecastQueryException extends BaseException {
  constructor(message: string, componentError: string) {
    super(
      `[WeatherForecastQueryException] Error when retrieving data: ${message}`,
      componentError
    );
  }
}
