import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity('audit_log')
export class AuditLog extends AbstractEntity {
  @Column()
  dateSearched: Date;

  @Column({ nullable: true })
  location?: string;
}
