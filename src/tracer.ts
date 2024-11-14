import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import * as process from 'process';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

// @ts-ignore
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import { JAEGER_EXPORT_URL } from './utils/env';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';

const exporterOptions = {
  url: JAEGER_EXPORT_URL, // grcp
};

const traceExporter = new OTLPTraceExporter(exporterOptions);

const consoleSpanExporter = new ConsoleSpanExporter();



export const otelSDK = new NodeSDK({
  traceExporter,
  // spanProcessor: new SimpleSpanProcessor(consoleSpanExporter),
  instrumentations: [
    new HttpInstrumentation(),
    new UndiciInstrumentation(),
    new ExpressInstrumentation(),
    new NestInstrumentation(),
  ],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'gateway',
  }),
});


// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});

