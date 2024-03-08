import { IsNotEmpty, IsString } from 'class-validator';

export class PeriodicLogsQuery {
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  endDate: string;
}

export class TimeFrameLogsCountQuery extends PeriodicLogsQuery {
  @IsNotEmpty()
  @IsString()
  interval: string;
}
