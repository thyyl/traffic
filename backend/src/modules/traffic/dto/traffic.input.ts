import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Coordinates } from './traffic.dto';

export class TrafficTransportRequestQuery {
  @IsNotEmpty()
  @IsString()
  dateTime: string;
}

export class TrafficTransportDetailsRequestQuery extends TrafficTransportRequestQuery {
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  latitude: string;

  @IsNotEmpty()
  longitude: string;
}

export class TrafficTransportDetailsRequestBody extends Coordinates {
  @IsString()
  @IsNotEmpty()
  location: string;
}
