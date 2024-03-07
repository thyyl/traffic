/**
 * This decorator will be using on controller
 * For example
    @UseGuards(YourAuthGuard) // <- this is just for example, please use your AuthGuard
    @Get('auth/profile')
    async getUserProfile(@AccessCurrentUser() user: User) {
      return user;
    }
 *
 */
import { createParamDecorator } from '@nestjs/common';

export const AccessCurrentUser = createParamDecorator(
  (_data, request) => request.user
);
