import { Body, Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
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
  async getAllAvailableLocations(@Body() body: TrafficTransportRequestBody) {
    const { dateTime } = body;
    return this.trafficService.getAllAvailableLocations(dateTime);
  }
}
