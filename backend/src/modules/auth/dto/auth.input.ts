import { UserCreateInput } from '@modules/user/dto/user.input';
import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class AccessTokenPayload {
  @Field()
  sub: string;

  @Field()
  aud: string;
}

@InputType()
export class LoginInput {
  @Field(() => String, { description: 'Email or phone number' })
  @IsString()
  identifier: string;

  @Field(() => String)
  @IsString()
  password: string;
}

@InputType()
export class AgentRegistrationInput extends UserCreateInput {
  @Field()
  @IsString()
  propertyAgentId: string;
}
