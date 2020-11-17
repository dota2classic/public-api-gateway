import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../../gateway/shared-types/roles';

export interface CurrentUserDto {
  steam_id: string;
  roles: Role[];
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);



export const CookiesUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.cookieUserId;
  },
);
