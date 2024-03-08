import { CreateOneAuditLogCommand } from '@modules/audit-log/cqrs/audit-log.cqrs.input';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Observable } from 'rxjs';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly commandBus: CommandBus) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { body, session } = request;

    const { data } = await this.commandBus.execute(
      new CreateOneAuditLogCommand({
        input: { dateSearched: body.dateTime },
        options: { silence: true }
      })
    );

    session.auditLogId = data.id;

    return next.handle();
  }
}
