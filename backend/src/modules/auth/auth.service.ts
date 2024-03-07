import { Injectable, Logger } from '@nestjs/common';
import { AgentRegistrationInput, LoginInput } from './dto/auth.input';
import { AccessTokenDto } from './dto/auth.dto';
import { AccessTokenFactory } from './factory/access-token.factory';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import {
  CheckUserLoginValidityQuery,
  CreateOneUserCommand
} from '@modules/user/cqrs/user.cqrs.input';
import { UserRegistrationEvent } from '@modules/token/cqrs/token.cqrs.input';
import { TokenMediumTypes } from '@constants/token-medium-types';
import { TokenPurposeTypes } from '@constants/token-purpose-types';
import { CreateOneAgentCommand } from '@modules/agent/cqrs/agent.cqrs.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly accessTokenFactory: AccessTokenFactory,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus
  ) {}

  async agentRegistration(input: AgentRegistrationInput): Promise<boolean> {
    const { data: userCreated } = await this.commandBus.execute(
      new CreateOneUserCommand(input)
    );

    await this.commandBus.execute(
      new CreateOneAgentCommand({
        propertyAgentId: input.propertyAgentId,
        userId: userCreated.id
      })
    );

    const { name, email, phoneNumber } = userCreated;

    Logger.log('User created successfully!');

    this.eventBus.publish(
      new UserRegistrationEvent({
        metadata: [
          {
            medium: TokenMediumTypes.EMAIL,
            recipient: email
          },
          {
            medium: TokenMediumTypes.PHONE,
            recipient: phoneNumber
          }
        ],
        purpose: TokenPurposeTypes.ACCOUNT_VERIFICATION,
        name
      })
    );

    return true;
  }

  async login(input: LoginInput): Promise<AccessTokenDto> {
    const {
      data: { id, type }
    } = await this.queryBus.execute(new CheckUserLoginValidityQuery(input));

    const accessToken = await this.accessTokenFactory.create({
      sub: id,
      aud: type
    });

    return accessToken;
  }
}
