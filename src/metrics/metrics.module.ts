import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { getToken, makeHistogramProvider, PrometheusModule } from "@willsoto/nestjs-prometheus";
import { ReqLoggingInterceptor } from "./req-logging.interceptor";
import { MetricsService } from "./metrics.service";
import { PrometheusGuardedController } from "./prometheus-guarded.controller";
import { BasicStrategy } from "./prometheus-basic-auth.strategy";
import { CustomMetricsMiddleware } from "./custom-metrics.middleware";

@Global()
@Module({
  imports: [
    PrometheusModule.register({
      path: "/metrics",
      controller: PrometheusGuardedController,
    }),
  ],
  providers: [
    makeHistogramProvider({
      name: "http_requests_duration_seconds",
      help: "Duration of HTTP requests in seconds",
      labelNames: ["method", "route", "request_type", "status_code"],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
    }),
    ReqLoggingInterceptor,
    MetricsService,
    BasicStrategy,
    CustomMetricsMiddleware,
  ],
  exports: [ReqLoggingInterceptor, MetricsService, getToken("http_requests_duration_seconds")],
})
export class MetricsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomMetricsMiddleware).forRoutes({
      path: "*",
      method: RequestMethod.ALL,
    });
  }
}
