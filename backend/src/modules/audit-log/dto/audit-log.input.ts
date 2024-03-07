import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateOneAuditLogInput {
  @IsNotEmpty()
  @IsDate()
  dateSearched: Date;

  @IsNotEmpty()
  @IsString()
  location: string;
}
