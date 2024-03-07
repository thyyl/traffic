import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('AccessToken')
export class AccessTokenDto {
  @Field()
  accessToken: string;

  @Field()
  expiresIn: number;

  @Field()
  refreshToken: string;

  @Field()
  refreshExpiresIn: number;

  constructor(input: AccessTokenDto) {
    Object.assign(this, input);
  }
}
