// Import required modules
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Request, Response } from "express";
import { CurrentUserDto } from "../utils/decorator/current-user";

@Injectable()
export class ReqLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP_REQUEST");

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Extract request and response objects
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const user: CurrentUserDto | undefined = req.user as unknown as
      | CurrentUserDto
      | undefined;
    const logMessage = {
      user: user?.steam_id,
      path: req.path,
      query: req.query,
      params: req.params,
      body: req.body,
      status: res.statusCode,
    };
    // Handle the observable
    return next.handle().pipe(
      tap(() => {
        // Log request details on success
        req.url && this.logger.verbose(logMessage);
      }),
      catchError((error: any) => {
        // we expect 404, it's not a failure for us.
        req.url && this.logger.verbose(logMessage);

        // other errors we don't know how to handle and throw them further.
        return throwError(() => error);
      }),
    );
  }
}
