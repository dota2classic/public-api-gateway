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
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import { Gauge } from "prom-client";
import { PATH_METADATA, SSE_METADATA } from "@nestjs/common/constants";
import * as path from "path";

@Injectable()
export class ReqLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP_REQUEST");

  constructor(
    @InjectMetric("my_app_requests") public appGauge: Gauge<string>,
    @InjectMetric("app_duration_metrics")
    public customDurationGauge: Gauge<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Extract request and response objects
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const handler = context.getHandler();
    const controller = Reflect.getMetadata(PATH_METADATA, context.getClass());

    const requestPath = path.join(
      controller,
      Reflect.getMetadata(PATH_METADATA, handler),
    );

    const isSSE = Reflect.getMetadata(SSE_METADATA, handler);

    let d0 = Date.now();

    res.on("finish", () => {
      // const durationMillis = Date.now() - req["start"];
      const durationMillis = Date.now() - d0;

      // console.log(
      //   "Duration 1:",
      //   durationMillis,
      //   "Duration 2:",
      //   Date.now() - d0,
      // );
      this.appGauge.inc();
      this.customDurationGauge
        .labels(
          req.method,
          requestPath,
          isSSE ? "sse" : "request",
          req.res.statusCode.toString(),
        )
        .set(durationMillis);
    });

    const user: CurrentUserDto | undefined = req.user as unknown as
      | CurrentUserDto
      | undefined;
    const logMessage = {
      user: user?.steam_id,
      path: req.path,
      method: req.method,
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

  @Cron(CronExpression.EVERY_4_HOURS)
  private async resetMetrics() {
    this.customDurationGauge.reset();
  }
}
