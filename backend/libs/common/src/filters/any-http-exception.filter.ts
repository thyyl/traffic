import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? exception.message || null
        : 'Internal server error';

    const errorResponse = {
      code: status,
      timestamp: new Date().toLocaleDateString(),
      path: request ? request.url : null,
      method: request ? request.method : null,
      message,
    };
    if (request) {
      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        Logger.error(
          `${request.method} ${request.url}`,
          exception.stack,
          'ExceptionFilter'
        );
      } else {
        Logger.error(
          `${request.method} ${request.url}`,
          JSON.stringify(errorResponse),
          'ExceptionFilter'
        );
      }
    } else {
      Logger.error(message, exception.stack, 'ExceptionFilter');
    }

    if (response && response.status) {
      response.status(status).json(errorResponse);
    }
  }
}
