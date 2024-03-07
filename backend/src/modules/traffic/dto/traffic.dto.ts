import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested
} from 'class-validator';

export class Coordinates {
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}

class ImageMetadata {
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @IsNotEmpty()
  @IsNumber()
  width: number;

  @IsNotEmpty()
  @IsString()
  md5: string;
}

class Camera {
  @IsNotEmpty()
  @IsString()
  timestamp: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsObject()
  @ValidateNested()
  location: Coordinates;

  @IsNotEmpty()
  @IsString()
  camera_id: string;

  @IsObject()
  @ValidateNested()
  image_metadata: ImageMetadata;
}

class Item {
  @IsNotEmpty()
  @IsString()
  timestamp: string;

  @IsArray()
  @ValidateNested()
  cameras: Camera[];
}

class ApiInfo {
  @IsNotEmpty()
  @IsString()
  status: string;
}

export class TrafficTransportImagesResponseBody {
  @IsNotEmpty()
  @IsDate()
  dateTime: Date;

  @IsArray()
  @ValidateNested()
  items: Item[];

  @IsObject()
  @ValidateNested()
  api_info: ApiInfo;
}
