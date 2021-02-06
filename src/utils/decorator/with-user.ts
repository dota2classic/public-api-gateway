import { ApiBearerAuth } from '@nestjs/swagger';
import { CanActivate, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../gateway/shared-types/roles';
import { Observable } from 'rxjs';
import { CurrentUserDto } from './current-user';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CookieUserGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();

    const token = request.cookies['dota2classic_auth_token'];
    const some: any = this.jwtService.decode(token);

    request.cookieUserId = some?.sub;
    // If you want to allow the request even if auth fails, always return true
    return true;
  }
}

export function WithUser(): MethodDecorator & ClassDecorator {
  const a = ApiBearerAuth();
  const b = UseGuards(AuthGuard('jwt'));

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
    this.role = role
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // @ts-ignore
    const user: CurrentUserDto | undefined = request.user;
    return !!user?.roles.find(t => this.role.includes(t));
  }
}

export const ModeratorGuard = () => UseGuards(new RoleGuard(Role.ADMIN, Role.MODERATOR));
export const AdminGuard = () => UseGuards(new RoleGuard(Role.ADMIN));
export const OldGuard = () => UseGuards(new RoleGuard(Role.OLD, Role.HUMAN));
