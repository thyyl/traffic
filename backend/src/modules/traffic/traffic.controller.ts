import { Body, Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { TrafficTransportRequestBody } from './dto/traffic.input';

@Controller('traffic')
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Get('/locations')
  @HttpCode(HttpStatus.OK)
  async getAllAvailableLocations(@Body() body: TrafficTransportRequestBody) {
    const { dateTime } = body;
    return this.trafficService.getAllAvailableLocations(dateTime);
  }
}
