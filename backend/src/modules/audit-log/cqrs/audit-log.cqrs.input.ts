import {
  AbstractCqrsCommandInput,
  AbstractCqrsQueryInput
} from '@app/common/abstract/abstract.cqrs';
import { AuditLog } from '../audit-log.entity';
import { RecordMutateOptions, RecordQueryOptions } from '@app/common';
import { CreateOneAuditLogInput } from '../dto/audit-log.input';

// ================ QUERY
export class FindOneAuditLogQuery extends AbstractCqrsQueryInput<AuditLog> {}
export class FindManyAuditLogsQuery extends AbstractCqrsQueryInput<
  AuditLog,
  undefined,
  RecordQueryOptions<AuditLog>,
  AuditLog[]
> {}

// ================ COMMAND
export class CreateOneAuditLogCommand extends AbstractCqrsCommandInput<
  AuditLog,
  CreateOneAuditLogInput,
  undefined,
  RecordMutateOptions,
  AuditLog
> {}
