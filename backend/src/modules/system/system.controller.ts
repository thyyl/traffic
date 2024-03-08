import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SystemService } from './system.service';
import { PeriodicLogsQuery, TimeFrameLogsCountQuery } from './dto/system.input';

@Controller('system')
export class SystemController {
  constructor(private readonly service: SystemService) {}

  @Get('recent-searches')
  @HttpCode(HttpStatus.OK)
  async getMostRecentSearches() {
    return this.service.getMostRecentSearches();
  }

  @Get('periodic-logs')
  @HttpCode(HttpStatus.OK)
  async getPeriodicLogs(@Query() query: PeriodicLogsQuery) {
    const { startDate, endDate } = query;
    const take = 10;
    return this.service.getPeriodicLogs(startDate, endDate, take);
  }

  @Get('time-frame-logs')
  @HttpCode(HttpStatus.OK)
  async getTimeFrameLogsCount(@Query() query: TimeFrameLogsCountQuery) {
    const { startDate, endDate, interval } = query;
    return this.service.getTimeFrameLogsCount(startDate, endDate, interval);
  }
}
