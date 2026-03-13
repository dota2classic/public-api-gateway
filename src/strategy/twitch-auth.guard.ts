import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TwitchAuthGuard extends AuthGuard("twitch") {
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
    return user;
  }
}
