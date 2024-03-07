/**
 * This decorator will be using on GraphQL Resolver
 * For example
    @Query(returns => User)
    @UseGuards(GqlAuthGuard)
    someQuery(@CurrentUser() user: User) {
      return this.usersService.findById(user.id);
    }
 *
 * Reference:
 * 1. https://github.com/nestjs/nest/issues/4339#issuecomment-600468194
 * 2. https://docs.nestjs.com/security/authentication#graphql
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

//
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
