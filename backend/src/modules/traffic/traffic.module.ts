import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';
import { WeatherForecastModule } from '@modules/weather-forecast/weather-forecast.module';
import { GeoApifyModule } from '@modules/geoapify/geoapify.module';

@Module({
  imports: [CqrsModule, WeatherForecastModule, GeoApifyModule],
  providers: [TrafficService],
  controllers: [TrafficController],
  exports: []
})
export class TrafficModule {}
