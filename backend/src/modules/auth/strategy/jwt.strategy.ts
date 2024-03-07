import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthTypes } from '@constants/auth-types';
import { AccessTokenContext } from '@interfaces/auth-payload.interface';
import { QueryBus } from '@nestjs/cqrs';
import { FindOneUserQuery } from '@modules/user/cqrs/user.cqrs.input';
import { Equal } from 'typeorm';
import { UserDto } from '@modules/user/dto/user.dto';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, AuthTypes.JWT) {
  constructor(
    configService: ConfigService,
    private readonly queryBus: QueryBus
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('service').jwt.secret
    });
  }

  async validate(payload: AccessTokenContext): Promise<UserDto> {
    const { sub } = payload;

    const { data: user } = await this.queryBus.execute(
      new FindOneUserQuery({ where: { id: Equal(sub) } })
    );

    return user;
  }
}
