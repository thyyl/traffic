import { IsISO8601, IsOptional } from 'class-validator';

export class TrafficTransportRequestBody {
  @IsOptional()
  @IsISO8601()
  dateTime?: string;
}
