import { HttpException, HttpStatus } from '@nestjs/common';

export type ErrorLogLevel = 'warn' | 'error';

export class BaseException extends HttpException {
  public errorLogLevel: ErrorLogLevel = 'error';
  public internalLog?: string;
  public errorCode: string;
  public errorData?: string | string[] | Record<string, any>;

  constructor(
    message: string,
    componentError: string,
    errorData?: string | string[] | Record<string, any>
  ) {
    super(message, HttpStatus.BAD_REQUEST);
    this.errorCode = `${componentError}`;
    this.errorData = errorData;
  }
}
