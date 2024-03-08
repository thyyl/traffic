import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';
import { WeatherForecastModule } from '@modules/weather-forecast/weather-forecast.module';

@Module({
  imports: [CqrsModule, WeatherForecastModule],
  providers: [TrafficService],
  controllers: [TrafficController],
  exports: []
})
export class TrafficModule {}
