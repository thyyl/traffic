import { registerEnumType } from '@nestjs/graphql';

export enum AuthTypes {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
  JWT = 'jwt',
  ANONYMOUS = 'anonymous'
}

registerEnumType(AuthTypes, {
  name: 'AuthTypes'
});
