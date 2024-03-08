import { BaseException } from './custom-errors.exception';

export class TrafficTransportQueryException extends BaseException {
  constructor(message: string, componentError: string) {
    super(
      `[TrafficTransportQueryException] Error when sending get request: ${message}`,
      componentError
    );
  }
}
