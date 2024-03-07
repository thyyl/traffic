export type ErrorLogLevel = 'warn' | 'error';

export class BaseException extends Error {
  public errorLogLevel: ErrorLogLevel = 'error';
  public internalLog?: string;
  public errorCode: string;
  public errorData?: string | string[] | Record<string, any>;

  constructor(
    message: string,
    componentError: string,
    errorData?: string | string[] | Record<string, any>
  ) {
    super(message);
    this.errorCode = `${componentError}`;
    this.errorData = errorData;
  }
}
