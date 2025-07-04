import { AuthGuard } from "@nestjs/passport";
import { HttpException, Injectable, Logger } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SteamAuthGuard extends AuthGuard("steam") {
  private logger = new Logger(SteamAuthGuard.name);

  constructor(private readonly config: ConfigService) {
    super();
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContextHost,
    status: any,
  ) {
    const res = context.switchToHttp().getResponse() as Response;

    this.logger.log("Checking if steam is ok", { err, user, info });

    const isSteamFuckFest =
      err &&
      (typeof err["message"] === "string" ? err["message"] : "").includes(
        "Failed to verify assertion",
      );
    if (isSteamFuckFest) {
      res
        .status(302)
        .redirect(`${this.config.get("api.frontUrl")}/steam-auth-error`, 302);
      return;
    }
    if (err || !user) {
      throw new HttpException(err.message, err.status);
    }
    return user.profile;
  }
}
