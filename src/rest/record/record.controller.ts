import {
  Controller,
  Get,
  Logger,
  Param,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiClient } from "@dota2classic/gs-api-generated/dist/module";
import {
  PlayerDailyRecord,
  PlayerRecordsResponse,
  PlayerYearSummaryDto,
} from "./record.dto";
import { RecordMapper } from "./record.mapper";
import { CacheTTL } from "@nestjs/cache-manager";
import { GlobalHttpCacheInterceptor } from "../../utils/cache-global";

@Controller("record")
@ApiTags("record")
@UseInterceptors(GlobalHttpCacheInterceptor)
export class RecordController {
  private logger = new Logger(RecordController.name);

  constructor(
    private readonly gsApi: ApiClient,
    private readonly mapper: RecordMapper,
  ) {}

  @CacheTTL(60 * 30)
  @Get()
  public async records(): Promise<PlayerRecordsResponse> {
    const res = await this.gsApi.record.recordControllerRecords();
    return this.mapper.mapRecordsResponse(res.data);
  }

  // @CacheTTL(60 * 30)
  @Get("year/:steam_id")
  public async playerYearSummary(
    @Param("steam_id") steamId: string,
  ): Promise<PlayerYearSummaryDto> {
    this.logger.log(`Getting yearly summary for ${steamId}`);
    const res = await this.gsApi.record.recordControllerYearResults(steamId);
    return this.mapper.mapYearResult(res.data);
  }

  @CacheTTL(60 * 30)
  @Get("/:steam_id")
  public async playerRecords(
    @Param("steam_id") steamId: string,
  ): Promise<PlayerRecordsResponse> {
    const res = await this.gsApi.record.recordControllerPlayerRecord(steamId);
    return this.mapper.mapRecordsResponse(res.data);
  }

  @Get("daily")
  public async dailyRecords(): Promise<PlayerDailyRecord[]> {
    const res = await this.gsApi.record.recordControllerPlayerDaily();
    return Promise.all(res.data.map(this.mapper.mapDailyRecord));
  }
}
