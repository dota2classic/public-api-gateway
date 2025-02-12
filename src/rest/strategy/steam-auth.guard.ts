import { AuthGuard } from "@nestjs/passport";
import { HttpException, Injectable } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SteamAuthGuard extends AuthGuard("steam") {
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

    const isSteamFuckFest = (
      typeof err["message"] === "string" ? err["message"] : ""
    ).includes("Failed to verify assertion");
    if (isSteamFuckFest) {
      res
        .status(302)
        .redirect(`${this.config.get("api.frontUrl")}/steam-auth-error`);
      return;
    }
    if (err || !user) {
      throw new HttpException(err.message, err.status);
    }
    return user;
  }
}
