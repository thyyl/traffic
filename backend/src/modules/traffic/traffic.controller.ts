import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { TrafficTransportRequestBody } from './dto/traffic.input';
import { CommandBus } from '@nestjs/cqrs';

@Controller('traffic')
export class TrafficController {
  constructor(
    private readonly trafficService: TrafficService,
    readonly commandBus: CommandBus
  ) {}

  @Get('/locations')
  @HttpCode(HttpStatus.OK)
  async getAllAvailableLocations(@Query() query: TrafficTransportRequestBody) {
    const { dateTime } = query;
    return this.trafficService.getAllAvailableLocations(dateTime);
  }
}
