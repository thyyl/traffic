import { registerEnumType } from '@nestjs/graphql';

export enum TokenTypes {
  TIMED = 'TIMED',
  SECURED = 'SECURED'
}

registerEnumType(TokenTypes, {
  name: 'TokenTypes'
});
