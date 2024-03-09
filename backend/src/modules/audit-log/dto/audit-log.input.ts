import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateOneAuditLogInput {
  @IsNotEmpty()
  @IsDate()
  dateSearched: Date;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;
}
