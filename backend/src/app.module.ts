import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { CoreModule } from '@app/core';
import { SnakeNamingStrategy } from '@app/core/types';
import { AuthModule } from '@modules/auth/auth.module';
import { EmailModule } from '@modules/email/email.module';
import { UserModule } from '@modules/user/user.module';
import { TokenModule } from '@modules/token/token.module';
import { AgentModule } from '@modules/agent/agent.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [CoreModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('service').graphql
    }),
    TypeOrmModule.forRootAsync({
      imports: [CoreModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const database = configService.get('service').database;
        return {
          type: 'mysql',
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
    AgentModule,
    AuthModule,
    CoreModule,
    EmailModule,
    TokenModule,
    UserModule
  ]
})
export class AppModule {}
