import { IInferredQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReadAsideCachedData } from './cache.cqrs.input';
import { CacheService } from '../cache.service';
import { TypedQueryResult } from '@app/common/abstract/abstract-record-query.interface';
import { Logger } from '@nestjs/common';

// ================ QUERY
@QueryHandler(GetReadAsideCachedData)
export class GetReadAsideCachedDataHandler<T>
  implements IInferredQueryHandler<GetReadAsideCachedData<T>>
{
  constructor(readonly service: CacheService) {}

  async execute(
    query: GetReadAsideCachedData<T>
  ): Promise<TypedQueryResult<GetReadAsideCachedData<T>>> {
    const { fetchDataFn, key, dateTime } = query;

    try {
      const data = await this.service.getReadAsideCachedData(
        key,
        fetchDataFn,
        dateTime
      );
      return { success: true, data };
    } catch (error) {
      Logger.error(
        `[CacheService] Failed to retrieve data from cache: ${error}`
      );
      return { success: false, message: error.message, data: null };
    }
  }
}
