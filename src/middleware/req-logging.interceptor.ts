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

@Injectable()
export class ReqLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP_REQUEST");

  // public customDurationGauge: Gauge<string>;
  // public customErrorsCounter: Counter<string>;

  constructor(
    @InjectMetric("my_app_requests") public appGauge: Gauge<string>,
    @InjectMetric("app_duration_metrics")
    public customDurationGauge: Gauge<string>,
  ) {
    // this.customDurationGauge = new Gauge<string>({
    //   name: "app_duration_metrics",
    //   help: "app_concurrent_metrics_help",
    //   labelNames: ["app_method", "app_origin"],
    // });
    // this.customErrorsCounter = new Counter<string>({
    //   name: "app_error_metrics",
    //   help: "app_usage_metrics_to_detect_errors",
    //   labelNames: ["app_method", "app_origin", "app_status"],
    // });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Extract request and response objects
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const handler = context.getHandler();
    const path = Reflect.getMetadata(PATH_METADATA, handler);

    const isSSE = Reflect.getMetadata(SSE_METADATA, handler);

    res.on("finish", () => {
      const durationMillis = Date.now() - req["start"];
      this.customDurationGauge
        .labels(req.method, path, isSSE ? "sse" : "request")
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
    this.appGauge.reset();
  }
}
