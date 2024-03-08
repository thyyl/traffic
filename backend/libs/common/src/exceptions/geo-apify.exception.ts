import { BaseException } from './custom-errors.exception';

export class GeoApifyCommandException extends BaseException {
  constructor(message: string, componentError: string) {
    super(
      `[GeoApifyCommandException] Error when posting data: ${message}`,
      componentError
    );
  }
}

export class GeoApifyQueryException extends BaseException {
  constructor(message: string, componentError: string) {
    super(
      `[GeoApifyQueryException] Error when retrieving data: ${message}`,
      componentError
    );
  }
}
