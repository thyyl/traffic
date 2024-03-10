import isArray from 'lodash/isArray';

/**
 * Use utils service in any place
 * feel free to add more util helper into this file
 * Example

  import { GeneratorService } from '@backend-stack/common';

  // just call any methods like below
  UtilsHelper.generateHash('something');
  UtilsHelper.generateRandomString(10);
 */
export class UtilsHelper {
  /**
   * generate random string
   * @param length
   */
  static generateRandomString(length: number) {
    return Math.random()
      .toString(36)
      .replace(/[^a-zA-Z0-9]+/g, '')
      .substr(0, length);
  }
  /**
   * convert entity to dto class instance
   * @param {{new(entity: E, options: any): T}} model
   * @param {E[] | E} entity
   * @param options
   * @returns {T[] | T}
   */
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E,
    options?: any
  ): T;
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E[],
    options?: any
  ): T[];
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E | E[],
    options?: any
  ): T | T[] {
    if (isArray(entity)) {
      return (entity as E[]).map((u) => new model(u, options));
    }

    return new model(entity as E, options);
  }
  public static buildKey(namespace: string, item: string, dateTime: string) {
    const [hourKey, minutes] = dateTime.split(':');

    const quarter = 15;
    const minuteKey = (Math.round(parseInt(minutes) / quarter) * quarter) % 60;

    return `${namespace}:${item}-${hourKey}-${minuteKey}`;
  }
}
