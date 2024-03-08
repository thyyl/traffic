import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private readonly redisTtl: number;

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
    const cachedData = await this.redisService.get(key);

    if (cachedData) {
      return JSON.parse(cachedData) as T;
    }

    const freshData = await fetchDataFn(dateTime);
    await this.redisService.set(
      key,
      JSON.stringify(freshData),
      'EX',
      this.redisTtl
    );
    return freshData;
  }
}
