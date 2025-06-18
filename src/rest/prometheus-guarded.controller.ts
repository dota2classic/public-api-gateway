import { PrometheusController } from "@willsoto/nestjs-prometheus";
import { Controller, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { ApiExcludeController } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@ApiExcludeController()
@Controller("metricz")
export class PrometheusGuardedController extends PrometheusController {
  @UseGuards(AuthGuard("basic"))
  index(@Res({ passthrough: true }) response: Response) {
    return super.index(response);
  }

  // @Get("unguarded")
  index2(@Res({ passthrough: true }) response: Response) {
    return super.index(response);
  }
}
