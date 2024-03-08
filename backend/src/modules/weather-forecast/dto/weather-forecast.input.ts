import { IsISO8601, IsOptional } from 'class-validator';

export class WeatherForecastRequestBody {
  @IsOptional()
  @IsISO8601()
  dateTime?: string;
}
