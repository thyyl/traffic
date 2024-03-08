import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WeatherForecastService } from './weather-forecast.service';

@Module({
  imports: [CqrsModule],
  providers: [WeatherForecastService],
  exports: [WeatherForecastService]
})
export class WeatherForecastModule {}
