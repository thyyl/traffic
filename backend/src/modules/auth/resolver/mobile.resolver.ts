import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth.service';
import {
  MutationAgentRegistrationArgs,
  MutationLoginArgs
} from '../dto/auth.args';
import { AccessTokenDto } from '../dto/auth.dto';

@Resolver()
export class AuthMobileResolver {
  constructor(private readonly service: AuthService) {}

  @Mutation(() => Boolean)
  async agentRegistration(
    @Args() args: MutationAgentRegistrationArgs
  ): Promise<boolean> {
    return this.service.agentRegistration(args.input);
  }

  @Mutation(() => AccessTokenDto)
  async login(@Args() args: MutationLoginArgs) {
    return this.service.login(args.input);
  }
}
