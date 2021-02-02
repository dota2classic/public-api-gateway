import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {

  handleRequest(err, user, info) {
    // no error is thrown if no user is found
    // You can use info for logging (e.g. token is expired etc.)
    // e.g.: if (info instanceof TokenExpiredError) ...
    return user;
  }

}




export function WithOptionalUser(): MethodDecorator & ClassDecorator {
  const a = ApiBearerAuth();
  const b = UseGuards(OptionalAuthGuard);

  return (target: Object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
    a(target, propertyKey, descriptor)
    b(target, propertyKey, descriptor)
  }
}
