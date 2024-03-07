import { AuthTypes } from '@constants/auth-types';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthJwtGuard extends AuthGuard([AuthTypes.JWT]) {
  getRequest(context: ExecutionContext) {
    const type = context.getType();

    let req = null;
    // check whether is via normal REST request
    if (type === 'http') {
      req = context.switchToHttp().getRequest();
    } else {
      // get gql execution context
      const ctx = GqlExecutionContext.create(context);
      req = ctx.getContext().req;
    }

    return req;
  }
}
