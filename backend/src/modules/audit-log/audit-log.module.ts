import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './audit-log.entity';
import { AuditLogService } from './audit-log.service';
import { CqrsHandlers } from './cqrs';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditLogService, ...CqrsHandlers],
  exports: [AuditLogService]
})
export class AuditLogModule {}
