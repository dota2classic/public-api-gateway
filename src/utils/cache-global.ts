import { ExecutionContext, Injectable } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { Request } from "express";

@Injectable()
export class GlobalHttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const req = context.switchToHttp().getRequest<Request>();
    return req.url;
  }
}
