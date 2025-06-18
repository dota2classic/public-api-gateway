// Import required modules
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import { Histogram } from "prom-client";
import { PATH_METADATA, SSE_METADATA } from "@nestjs/common/constants";
import * as path from "path";
import { FastifyReply, FastifyRequest } from "fastify";

@Injectable()
export class ReqLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP_REQUEST");

  constructor(
    @InjectMetric("http_requests_duration_seconds")
    public requestHistogram: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Extract request and response objects
    const req: FastifyRequest = context.switchToHttp().getRequest();
    const res: FastifyReply = context.switchToHttp().getResponse();

    // req: FastifyRequest['raw'], res: FastifyReply['raw']

    const handler = context.getHandler();
    const controller = Reflect.getMetadata(PATH_METADATA, context.getClass());

    const requestPath = path.join(
      controller,
      Reflect.getMetadata(PATH_METADATA, handler),
    );

    const isSSE = Reflect.getMetadata(SSE_METADATA, handler);

    let d0 = performance.now();

    res.raw.on("finish", () => {
      const durationSeconds = (performance.now() - d0) / 1000;

      // console.log(
      //   "Request finish, ",
      //   req.method,
      //   requestPath,
      //   isSSE ? "sse" : "request",
      //   res.statusCode.toString(),
      //   durationSeconds,
      // );
      this.requestHistogram
        .labels(
          req.method,
          requestPath,
          isSSE ? "sse" : "request",
          res.statusCode.toString(),
        )
        .observe(durationSeconds);
    });

    return next.handle();
  }
}
