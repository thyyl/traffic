import {
  CreateOneAuditLogCommandHandler,
  FindManyAuditLogsQueryHandler
} from './audit-log.cqrs.handler';

export const CqrsHandlers = [
  CreateOneAuditLogCommandHandler,
  FindManyAuditLogsQueryHandler
];
