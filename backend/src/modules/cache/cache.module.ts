import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CacheService } from './cache.service';
import { ConfigService } from '@nestjs/config';
import { CqrsHandlers } from './cqrs';

@Module({
  imports: [
    CqrsModule,
    ConfigService,
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const { host, port } = configService.get('service').redis;
        return {
          type: 'single',
          url: `redis://${host}:${port}`
        };
      },
      inject: [ConfigService]
    })
  ],
  providers: [CacheService, ...CqrsHandlers],
  exports: [CacheService]
})
export class CacheModule {}
