import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Role } from "../../gateway/shared-types/roles";
import { Request } from "express";

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

export const AccessToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const raw = request.headers.authorization;
    if (!raw) return undefined;
    return raw.replace("Bearer ", "");
  },
);

export const CookiesUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request;
  },
);
