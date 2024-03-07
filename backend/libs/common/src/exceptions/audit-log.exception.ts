import { BaseException } from './custom-errors.exception';

export class AuditLogQueryException extends BaseException {
  constructor(message: string, componentError: string) {
    super(
      `[AuditLogQueryException] Error when query audit log: ${message}`,
      componentError
    );
  }
}

export class AuditLogCreationException extends BaseException {
  constructor(message: string, componentError: string) {
    super(
      `[AuditLogCreationException] Error when creating audit log: ${message}`,
      componentError
    );
  }
}
