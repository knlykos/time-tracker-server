import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../entity/user.entity/user.entity';

export const User = createParamDecorator<UserEntity>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
