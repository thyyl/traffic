import { registerEnumType } from '@nestjs/graphql';

export enum UserTypes {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  TENANT = 'TENANT'
}

registerEnumType(UserTypes, {
  name: 'UserTypes'
});
