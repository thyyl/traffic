import { AuditLogModule } from '@modules/audit-log/audit-log.module';
import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';

@Module({
  imports: [AuditLogModule],
  controllers: [SystemController],
  providers: [SystemService],
  exports: []
})
export class SystemModule {}
