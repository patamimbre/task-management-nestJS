import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Get the user id from the request
export const GetUserId = createParamDecorator(
  (_data, ctx: ExecutionContext): string => {
    const { user } = ctx.switchToHttp().getRequest();
    return user.userId;
  },
);
