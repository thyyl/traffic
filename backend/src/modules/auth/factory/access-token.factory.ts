import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenDto } from '../dto/auth.dto';
import { AccessTokenPayload } from '../dto/auth.input';

@Injectable()
export class AccessTokenFactory {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async create(tokenPayload: AccessTokenPayload): Promise<AccessTokenDto> {
    const { tokenExpiration, refreshTokenExpiration } =
      this.configService.get('service').jwt;
    const accessToken = await this.jwtService.signAsync(
      { typ: 'Bearer', ...tokenPayload },
      { expiresIn: tokenExpiration }
    );
    const refreshToken = await this.jwtService.signAsync(
      { typ: 'Refresh', ...tokenPayload },
      { expiresIn: refreshTokenExpiration }
    );

    return {
      accessToken,
      expiresIn: tokenExpiration,
      refreshToken,
      refreshExpiresIn: refreshTokenExpiration
    };
  }
}
