import { IsDate, IsOptional } from 'class-validator';

export class TrafficTransportRequestBody {
  @IsOptional()
  @IsDate()
  dateTime?: Date;
}
