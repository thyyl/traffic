import { AbstractDto } from '@app/common';

export class AuditLogDto extends AbstractDto {
  dateSearched: Date;
  location: string;
}
