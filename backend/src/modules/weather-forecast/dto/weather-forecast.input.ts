import { IsNotEmpty, IsString } from 'class-validator';

export class WeatherForecastRequestBody {
  @IsString()
  @IsNotEmpty()
  dateTime: string;
}
