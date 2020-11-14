import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../../gateway/shared-types/roles';

export interface CurrentUserDto {
  steam_id: string;
  role: Role;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
