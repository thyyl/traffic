import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private readonly redisTtl: number;
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @InjectRedis() private readonly redisService: Redis,
    private readonly configService: ConfigService
  ) {
    this.redisTtl = this.configService.get('service').redis.ttl;
  }

  async getReadAsideCachedData<T>(
    key: string,
    fetchDataFn: (dateTime: string) => Promise<T>,
    dateTime: string
  ): Promise<T> {
    this.logger.log(`[CacheService] Fetching data from cache with key: ${key}`);
    const cachedData = await this.redisService.get(key);

    if (cachedData) {
      this.logger.log(`[CacheService] Data found in cache with key: ${key}`);
      return JSON.parse(cachedData) as T;
    }

    this.logger.log(`[CacheService] Data not found in cache with key: ${key}`);

    const freshData = await fetchDataFn(dateTime);

    this.logger.log(`[CacheService] Setting data to cache with key: ${key}`);

    await this.redisService.set(
      key,
      JSON.stringify(freshData),
      'EX',
      this.redisTtl
    );
    return freshData;
  }
}
