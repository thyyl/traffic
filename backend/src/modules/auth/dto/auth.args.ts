import { ArgsType, Field } from '@nestjs/graphql';
import { AgentRegistrationInput, LoginInput } from './auth.input';
import { AgentRegistrationValidator } from '../validator/agent-registration.validator';
import { IsObject } from 'class-validator';

@ArgsType()
export class MutationAgentRegistrationArgs {
  @AgentRegistrationValidator({
    message: 'Phone number must be Australian (+61).'
  })
  @Field(() => AgentRegistrationInput)
  input: AgentRegistrationInput;
}

@ArgsType()
export class MutationLoginArgs {
  @Field(() => LoginInput)
  @IsObject()
  input: LoginInput;
}
