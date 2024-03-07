import {
  CommandHandler,
  IInferredCommandHandler,
  IInferredQueryHandler,
  QueryHandler
} from '@nestjs/cqrs';
import {
  CreateOneAuditLogCommand,
  FindManyAuditLogsQuery
} from './audit-log.cqrs.input';
import { AuditLogService } from '../audit-log.service';
import {
  TypedCommandResult,
  TypedQueryResult
} from '@app/common/abstract/abstract-record-query.interface';
import { Logger } from '@nestjs/common';
import {
  AuditLogCreationException,
  AuditLogQueryException
} from '@app/common/exceptions/audit-log.exception';

// ================ QUERY
@QueryHandler(FindManyAuditLogsQuery)
export class FindManyAuditLogsQueryHandler
  implements IInferredQueryHandler<FindManyAuditLogsQuery>
{
  constructor(readonly service: AuditLogService) {}
  async execute(
    query: FindManyAuditLogsQuery
  ): Promise<TypedQueryResult<FindManyAuditLogsQuery>> {
    const {
      query: filterQuery,
      options: { nullable, silence }
    } = query.args;

    try {
      const auditLogs = await this.service.findManyAuditLogs(filterQuery);
      return { success: true, data: auditLogs };
    } catch (error) {
      if (!silence || !nullable) {
        throw new AuditLogQueryException(error.message, '[AuditLogService]');
      }
      Logger.error(`Failed to find audit logs: ${error}`);
      return { success: false, message: error.message, data: null };
    }
  }
}

// ================ COMMAND
@CommandHandler(CreateOneAuditLogCommand)
export class CreateOneAuditLogCommandHandler
  implements IInferredCommandHandler<CreateOneAuditLogCommand>
{
  constructor(readonly service: AuditLogService) {}
  async execute(
    command: CreateOneAuditLogCommand
  ): Promise<TypedCommandResult<CreateOneAuditLogCommand>> {
    const {
      input,
      options: { silence }
    } = command.args;

    try {
      const data = await this.service.createOneAuditLog(input);

      return {
        success: true,
        data
      };
    } catch (error) {
      if (!silence) {
        throw new AuditLogCreationException(error.message, '[AuditLogService]');
      }
      Logger.error(`Failed to create audit log: ${error}`);
      return { success: false, message: error.message, data: null };
    }
  }
}
