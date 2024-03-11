import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './audit-log.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateOneAuditLogInput } from './dto/audit-log.input';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>
  ) {}

  async findManyAuditLogs(
    options?: FindManyOptions<AuditLog>
  ): Promise<AuditLog[]> {
    this.logger.log(`[AuditLogService] Finding audit logs`);
    return this.auditLogRepository.find(options);
  }

  async createOneAuditLog(input: CreateOneAuditLogInput): Promise<AuditLog> {
    this.logger.log(`[AuditLogService] Creating audit logs`);
    const auditLog = this.auditLogRepository.create(input);
    return this.auditLogRepository.save(auditLog);
  }
}
