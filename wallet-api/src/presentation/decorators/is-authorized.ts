import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IsAuthorized = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest();

    return request.isAuthorized;
  },
);