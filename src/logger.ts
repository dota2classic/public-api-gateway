import * as winston from "winston";
import * as winstonTransport from "winston-transport";
import { LoggerService } from "@nestjs/common/services/logger.service";
import * as os from "os";

export class WinstonWrapper implements LoggerService {
  private winstonInstance: winston.Logger;
  private readonly hostname: string;

  constructor(
    public readonly application: string,
    disabled = false,
  ) {
    this.hostname = os.hostname();

    const transports: winstonTransport[] = [
      new winston.transports.Console({
        level: "verbose",
        format: winston.format.combine(
          winston.format.timestamp({
            format: "MM-DD HH:mm:ss.SSS",
          }),
          winston.format.prettyPrint(),
          winston.format.printf((info) => {
            const { level, timestamp, ...message } = info;
            return `${timestamp} | ${level.padEnd(5)} | ${JSON.stringify(message)}`;
          }),
        ),
      }),
    ];
    this.winstonInstance = winston.createLogger({
      transports: transports,
    });
  }

  debug(message: any, ...optionalParams: any[]): any {
    this.winstonInstance.debug(this.wrap(message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]): any {
    // console.trace(message);
    console.log(message);
    this.winstonInstance.error(this.wrap(message, optionalParams[0]));
  }

  fatal(message: any, ...optionalParams: any[]): any {
    this.winstonInstance.emerg(this.wrap(message, ...optionalParams));
  }

  log(message: any, ...optionalParams: any[]): any {
    this.winstonInstance.info(this.wrap(message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]): any {
    this.winstonInstance.verbose(this.wrap(message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]): any {
    this.winstonInstance.warn(this.wrap(message, ...optionalParams));
  }

  private wrap(msg: any, ...optionalParams: any[]) {
    let message =
      typeof msg === "string"
        ? {
            message: msg,
            application: this.application,
            hostname: this.hostname,
          }
        : { ...msg };
    if (optionalParams.length > 1) {
      message = {
        ...message,
        ...optionalParams[0],
        context: optionalParams[1],
        application: this.application,
        hostname: this.hostname,
      };
    } else if (optionalParams.length === 1) {
      message = {
        ...message,
        context: optionalParams[0],
        application: this.application,
        hostname: this.hostname,
      };
    }

    return message;
  }
}
