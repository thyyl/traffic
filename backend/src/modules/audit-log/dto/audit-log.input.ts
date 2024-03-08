import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOneAuditLogInput {
  @IsNotEmpty()
  @IsDate()
  dateSearched: Date;

  @IsOptional()
  @IsString()
  location?: string;
}
