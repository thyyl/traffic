import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CoreModule } from '@app/core';
import { AuthTypes } from '@constants/auth-types';
import { AuthJwtStrategy } from './strategy/jwt.strategy';
import { AnonymousStrategy } from './strategy/anonymous.strategy';
import { AuthService } from './auth.service';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthMobileResolver } from './resolver/mobile.resolver';
import { AccessTokenFactory } from './factory/access-token.factory';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: AuthTypes.JWT }),
    JwtModule.registerAsync({
      imports: [CoreModule],
      useFactory: (configService: ConfigService) => {
        const { jwt } = configService.get('service');
        return {
          secret: jwt.secret,
          signOptions: {
            expiresIn: jwt.tokenExpiration
          }
        };
      },
      inject: [ConfigService]
    }),
    CqrsModule
  ],
  providers: [
    AnonymousStrategy,
    AuthJwtStrategy,
    AuthService,
    AccessTokenFactory,
    AuthMobileResolver
  ]
})
export class AuthModule {}
