import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@app/core';
import { SnakeNamingStrategy } from '@app/core/types';
import { AuditLogModule } from '@modules/audit-log/audit-log.module';
import { TrafficModule } from '@modules/traffic/traffic.module';
import { WeatherForecastModule } from '@modules/weather-forecast/weather-forecast.module';
import { GeoApifyModule } from '@modules/geoapify/geoapify.module';
import { CacheModule } from '@modules/cache/cache.module';
import { SystemModule } from '@modules/system/system.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [CoreModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const database = configService.get('service').database;
        return {
          type: 'postgres',
          host: database.host,
          port: parseInt(database.port),
          username: database.username,
          password: database.password,
          database: database.database,
          ssl: process.env.DB_SSL_CERT
            ? {
                rejectUnauthorized: false,
                ca: process.env.DB_SSL_CERT
              }
            : false,
          migrations: [`${__dirname}/migrations/*.js`],
          migrationsRun: true,
          logging: database.logging,
          namingStrategy: new SnakeNamingStrategy(),
          autoLoadEntities: true,
          keepConnectionAlive: true
        };
      }
    }),
    BullModule.forRootAsync({
      imports: [CoreModule],
      useFactory: async (configService: ConfigService) => {
        return configService.get('bull');
      },
      inject: [ConfigService]
    }),
    CoreModule,
    AuditLogModule,
    TrafficModule,
    WeatherForecastModule,
    GeoApifyModule,
    CacheModule,
    SystemModule
  ]
})
export class AppModule {}
