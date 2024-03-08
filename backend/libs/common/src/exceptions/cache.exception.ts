import { BaseException } from './custom-errors.exception';

export class CacheQueryException extends BaseException {
  constructor(message: string, componentError: string) {
    super(
      `[CacheQueryException] Error when retrieving data from cache: ${message}`,
      componentError
    );
  }
}
