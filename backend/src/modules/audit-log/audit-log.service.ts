import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './audit-log.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateOneAuditLogInput } from './dto/audit-log.input';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>
  ) {}

  async findManyAuditLogs(
    options?: FindManyOptions<AuditLog>
  ): Promise<AuditLog[]> {
    Logger.log(`[AuditLogService] Finding audit logs`);
    return this.auditLogRepository.find(options);
  }

  async createOneAuditLog(input: CreateOneAuditLogInput): Promise<AuditLog> {
    Logger.log(`[AuditLogService] Creating audit logs`);
    const auditLog = this.auditLogRepository.create(input);
    return this.auditLogRepository.save(auditLog);
  }
}
