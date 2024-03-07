import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthTypes } from '@constants/auth-types';
import { Strategy } from 'passport';

@Injectable()
export class AnonymousStrategy extends PassportStrategy(
  Strategy,
  AuthTypes.ANONYMOUS
) {
  constructor() {
    super();
  }

  authenticate() {
    return this.success({});
  }
}
