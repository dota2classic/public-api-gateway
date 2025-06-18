import {
  Controller,
  Get,
  Logger,
  Param,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RecordApi } from "../../generated-api/gameserver";
import { PlayerRecordsResponse } from "./record.dto";
import { RecordMapper } from "./record.mapper";
import { CacheTTL } from "@nestjs/cache-manager";
import { GlobalHttpCacheInterceptor } from "../../utils/cache-global";

@Controller("record")
@ApiTags("record")
@UseInterceptors(GlobalHttpCacheInterceptor)
export class RecordController {
  private logger = new Logger(RecordController.name);

  constructor(
    private readonly api: RecordApi,
    private readonly mapper: RecordMapper,
  ) {}

  @CacheTTL(60 * 30)
  @Get()
  public async records(): Promise<PlayerRecordsResponse> {
    const records = await this.api.recordControllerRecords();

    const [overall, month, season] = await Promise.all([
      Promise.all(records.overall.map(this.mapper.mapPlayerRecord)),
      Promise.all(records.month.map(this.mapper.mapPlayerRecord)),
      Promise.all(records.season.map(this.mapper.mapPlayerRecord)),
    ]);
    return {
      overall: overall,
      month: month,
      season: season,
    };
  }

  @CacheTTL(60 * 30)
  @Get("/:steam_id")
  public async playerRecords(
    @Param("steam_id") steamId: string,
  ): Promise<PlayerRecordsResponse> {
    const records = await this.api.recordControllerPlayerRecord(steamId);

    const [overall, month, season] = await Promise.all([
      Promise.all(records.overall.map(this.mapper.mapPlayerRecord)),
      Promise.all(records.month.map(this.mapper.mapPlayerRecord)),
      Promise.all(records.season.map(this.mapper.mapPlayerRecord)),
    ]);
    return {
      overall: overall,
      month: month,
      season: season,
    };
  }
}
