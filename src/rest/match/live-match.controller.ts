import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Sse,
  UseInterceptors,
} from "@nestjs/common";
import { LiveMatchService } from "../../cache/live-match.service";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import {
  LiveMatchDto,
  LiveMatchSseDto,
  MessageObjectDto,
} from "./dto/match.dto";
import { Observable, scan } from "rxjs";
import { map } from "rxjs/operators";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";

function wrapSse<A>() {
  return (source: A): MessageObjectDto<A> => ({
    data: source,
  });
}

@UseInterceptors(ReqLoggingInterceptor)
@Controller("live")
@ApiTags("live")
export class LiveMatchController {
  constructor(private readonly ls: LiveMatchService) {}

  @Get("/list")
  async listMatches(): Promise<LiveMatchDto[]> {
    return this.ls.list();
  }

  @ApiParam({
    name: "id",
    required: true,
  })
  @Sse(":id")
  liveMatch(
    @Param("id", ParseIntPipe) id: number,
  ): Observable<LiveMatchSseDto> {
    this.ls.streamMatch(id).pipe(scan((a) => console.log(a)));
    return this.ls.streamMatch(id).pipe(map((a) => ({ data: a })));
  }
}
