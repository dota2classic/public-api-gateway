import {
  Controller,
  Get,
  Logger,
  Param,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RecordApi } from "../../generated-api/gameserver";
import {
  PlayerDailyRecord,
  PlayerRecordsResponse,
  PlayerYearSummaryDto,
} from "./record.dto";
import { RecordMapper } from "./record.mapper";
import { CacheTTL } from "@nestjs/cache-manager";
import { GlobalHttpCacheInterceptor } from "../../utils/cache-global";
import { WithUser } from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";

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

    const [overall, month, season, day] = await Promise.all([
      Promise.all(records.overall.map(this.mapper.mapPlayerRecord)),
      Promise.all(records.month.map(this.mapper.mapPlayerRecord)),
      Promise.all(records.season.map(this.mapper.mapPlayerRecord)),
      Promise.all(records.day.map(this.mapper.mapPlayerRecord)),
    ]);
    return {
      overall,
      month,
      season,
      day,
    };
  }

  // @CacheTTL(60 * 30)
  @WithUser()
  @Get("year/:steam_id")
  public async playerYearSummary(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<PlayerYearSummaryDto> {
    this.logger.log(`Getting yearly summary for ${user.steam_id}`);
    const result = await this.api.recordControllerYearResults(user.steam_id);
    return this.mapper.mapYearResult(result);
  }

  @CacheTTL(60 * 30)
  @Get("/:steam_id")
  public async playerRecords(
    @Param("steam_id") steamId: string,
  ): Promise<PlayerRecordsResponse> {
    const records = await this.api.recordControllerPlayerRecord(steamId);

    const [overall, month, season, day] = await Promise.all([
      Promise.all(records.overall.map(this.mapper.mapPlayerRecord)),
      Promise.all(records.month.map(this.mapper.mapPlayerRecord)),
      Promise.all(records.season.map(this.mapper.mapPlayerRecord)),
      Promise.all(records.day.map(this.mapper.mapPlayerRecord)),
    ]);
    return {
      overall,
      month,
      season,
      day,
    };
  }

  @Get("daily")
  public async dailyRecords(): Promise<PlayerDailyRecord[]> {
    return this.api
      .recordControllerPlayerDaily()
      .then((all) => Promise.all(all.map(this.mapper.mapDailyRecord)));
  }
}
