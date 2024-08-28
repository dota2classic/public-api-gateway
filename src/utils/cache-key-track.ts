import { ExecutionContext, Injectable } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Request } from 'express';
import { CurrentUserDto } from './decorator/current-user';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {

    const req = context.switchToHttp().getRequest<Request>()
    if(req.user){
      const u = req.user as CurrentUserDto;

      return req.url + u?.steam_id
    }
    return req.url
  }
}
