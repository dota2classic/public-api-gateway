import { NodeSDK } from "@opentelemetry/sdk-node";
import * as process from "process";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

// @ts-ignore
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import configuration from "./config/configuration";
// import { FetchInstrumentation } from "@onreza/opentelemetry-instrumentation-fetch-bun";
const cfg = configuration();
const exporterOptions = {
  url: cfg.telemetry.jaeger.url, // grcp
};

const traceExporter = new OTLPTraceExporter(exporterOptions);

export const otelSDK = new NodeSDK({
  traceExporter,
  // spanProcessor: new SimpleSpanProcessor(consoleSpanExporter),
  instrumentations: [
    // new FetchInstrumentation({
    //   propagateTraceHeaderCorsUrls: new RegExp(".*"),
    // }),
    // getNodeAutoInstrumentations(),
    // new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new NestInstrumentation(),
  ],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "gateway",
  }),
});

// gracefully shut down the SDK on process exit
process.on("SIGTERM", () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log("SDK shut down successfully"),
      (err) => console.log("Error shutting down SDK", err),
    )
    .finally(() => process.exit(0));
});
