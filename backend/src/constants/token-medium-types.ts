import { registerEnumType } from '@nestjs/graphql';

export enum TokenMediumTypes {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE'
}

registerEnumType(TokenMediumTypes, {
  name: 'TokenMediumTypes'
});
