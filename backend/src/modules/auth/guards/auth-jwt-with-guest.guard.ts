import { AuthTypes } from '@constants/auth-types';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

// allow 'anonymous' strategy. https://stackoverflow.com/a/61619373
@Injectable()
export class AuthJwtOrGuestGuard extends AuthGuard([
  AuthTypes.JWT,
  AuthTypes.ANONYMOUS
]) {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
