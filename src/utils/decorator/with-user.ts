import { ApiBearerAuth } from '@nestjs/swagger';
import { CanActivate, ExecutionContext, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../gateway/shared-types/roles';
import { Observable } from 'rxjs';
import { CurrentUserDto } from './current-user';

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
  constructor(private role: Role) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // @ts-ignore
    const user: CurrentUserDto | undefined = request.user;
    return !!user?.roles.find(t => t === this.role);
  }
}

export const AdminGuard = () => UseGuards(new RoleGuard(Role.ADMIN));
