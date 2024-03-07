import { registerEnumType } from '@nestjs/graphql';

export enum TokenPurposeTypes {
  ACCOUNT_VERIFICATION = 'ACCOUNT_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET'
}

registerEnumType(TokenPurposeTypes, {
  name: 'TokenPurposeTypes'
});
