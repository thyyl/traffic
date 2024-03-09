import { IsNotEmpty, IsString } from 'class-validator';
import { Coordinates } from './traffic.dto';

export class TrafficTransportRequestQuery {
  @IsNotEmpty()
  @IsString()
  dateTime: string;
}

export class TrafficTransportDetailsRequestQuery extends TrafficTransportRequestQuery {}

export class TrafficTransportDetailsRequestBody extends Coordinates {
  @IsString()
  @IsNotEmpty()
  location: string;
}
