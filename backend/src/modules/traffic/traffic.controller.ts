import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import {
  TrafficTransportDetailsRequestQuery,
  TrafficTransportRequestQuery
} from './dto/traffic.input';
import { CommandBus } from '@nestjs/cqrs';

@Controller('traffic')
export class TrafficController {
  constructor(
    private readonly trafficService: TrafficService,
    readonly commandBus: CommandBus
  ) {}

  @Get('/locations')
  @HttpCode(HttpStatus.OK)
  async getAllAvailableLocations(@Query() query: TrafficTransportRequestQuery) {
    const { dateTime } = query;
    return this.trafficService.getAllAvailableLocations(dateTime);
  }

  @Get('/location-details')
  @HttpCode(HttpStatus.OK)
  async getLocationDetails(
    @Query() query: TrafficTransportDetailsRequestQuery
  ) {
    const { dateTime, location, longitude, latitude } = query;

    return this.trafficService.getLocationDetails(
      dateTime,
      location,
      parseFloat(longitude),
      parseFloat(latitude)
    );
  }
}
