import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested
} from 'class-validator';

export class Coordinates {
  @IsString()
  @IsNumber()
  latitude: number;

  @IsString()
  @IsNumber()
  longitude: number;
}

export class AreaMetadata {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  label_location: Coordinates;
}

export class TransformedAreaMetadata {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  coordinates: string;
}

class Forecast {
  @IsString()
  @IsNotEmpty()
  area: string;

  @IsString()
  @IsNotEmpty()
  forecast: string;
}

class ValidPeriod {
  @IsString()
  @IsNotEmpty()
  start: string;

  @IsString()
  @IsNotEmpty()
  end: string;
}

class Item {
  @IsString()
  @IsNotEmpty()
  update_timestamp: string;

  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  valid_period: ValidPeriod;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  forecasts: Forecast[];
}

class ApiInfo {
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class WeatherForecastResponseBody {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  area_metadata: AreaMetadata[];

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  items: Item[];

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  api_info: ApiInfo;
}
