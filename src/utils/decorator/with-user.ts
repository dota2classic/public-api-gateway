import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function WithUser(): MethodDecorator & ClassDecorator {
  const a = ApiBearerAuth();
  const b = UseGuards(AuthGuard('jwt'));

  return (target: Object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
    a(target, propertyKey, descriptor)
    b(target, propertyKey, descriptor)
  }
}

