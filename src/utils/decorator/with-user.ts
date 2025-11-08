import { ApiBearerAuth } from "@nestjs/swagger";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "../../gateway/shared-types/roles";
import { Observable } from "rxjs";
import { CurrentUserDto } from "./current-user";
import { JwtService } from "@nestjs/jwt";
import { TOKEN_KEY } from "../env";

@Injectable()
export class CookieUserGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();

    const token = request.cookies[TOKEN_KEY];
    let some: any = this.jwtService.decode(token);

    // This is fix for deprecated user ids([U:1:xxxx] format)
    if (typeof some === "string" && some.startsWith("[U:")) {
      some = some.slice(5, some.length - 1);
    }

    request.cookieUserId = some?.sub;
    // If you want to allow the request even if auth fails, always return true
    return true;
  }
}

export function WithUser(): MethodDecorator & ClassDecorator {
  const a = ApiBearerAuth();
  const b = UseGuards(AuthGuard("jwt"));

  return (
    target: Object,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    a(target, propertyKey, descriptor);
    b(target, propertyKey, descriptor);
  };
}

export class RoleGuard implements CanActivate {
  private readonly role: Role[];
  constructor(...role: Role[]) {
    this.role = role;
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // @ts-ignore
    const user: CurrentUserDto | undefined = request.user;
    console.log(user)
    return !!user?.roles.find((t) => this.role.includes(t));
  }
}

export const ModeratorGuard = () =>
  UseGuards(new RoleGuard(Role.ADMIN, Role.MODERATOR));
export const AdminGuard = () => UseGuards(new RoleGuard(Role.ADMIN), AuthGuard("jwt"));

export const OldGuard = () =>
  UseGuards(new RoleGuard(Role.OLD, Role.HUMAN, Role.ADMIN, Role.MODERATOR));
