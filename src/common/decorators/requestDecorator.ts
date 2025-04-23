import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from 'src/DB';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDocument => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request['user'] as UserDocument;
  },
);
