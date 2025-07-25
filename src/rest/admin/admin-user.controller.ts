import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { EventBus, QueryBus } from "@nestjs/cqrs";
import { CrimeApi, InfoApi, PlayerApi } from "../../generated-api/gameserver";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import {
  BanHammerDto,
  CrimeLogDto,
  CrimeLogPageDto,
  PlayerFlagDto,
  SmurfData,
  UpdateModeDTO,
  UpdatePlayerFlagDto,
  UpdateRolesDto,
  UserBanSummaryDto,
  UserRoleSummaryDto,
} from "./dto/admin.dto";
import { UserRolesUpdatedEvent } from "../../gateway/events/user/user-roles-updated.event";
import { PlayerId } from "../../gateway/shared-types/player-id";
import {
  AdminGuard,
  ModeratorGuard,
  WithUser,
} from "../../utils/decorator/with-user";
import { GetRoleSubscriptionsQuery } from "../../gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions.query";
import { GetRoleSubscriptionsQueryResult } from "../../gateway/queries/user/GetRoleSubscriptions/get-role-subscriptions-query.result";
import { GetPlayerInfoQuery } from "../../gateway/queries/GetPlayerInfo/get-player-info.query";
import { GetPlayerInfoQueryResult } from "../../gateway/queries/GetPlayerInfo/get-player-info-query.result";
import { Dota2Version } from "../../gateway/shared-types/dota2version";
import { PlayerBanHammeredEvent } from "../../gateway/events/bans/player-ban-hammered.event";
import { NullableIntPipe } from "../../utils/pipes";
import { AdminMapper } from "./admin.mapper";
import { WithPagination } from "../../utils/decorator/pagination";
import { MatchmakingInfo } from "../stats/stats.dto";
import { InjectS3, S3 } from "nestjs-s3";
import { UserProfileService } from "../../service/user-profile.service";
import { PlayerFlagsEntity } from "../../entity/player-flags.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Controller("admin/users")
@ApiTags("admin")
export class AdminUserController {
  constructor(
    @Inject("QueryCore") private readonly rq: ClientProxy,
    private readonly qBus: QueryBus,
    private readonly user: UserProfileService,
    private readonly ebus: EventBus,
    private readonly mapper: AdminMapper,
    private readonly api: CrimeApi,
    private readonly infoApi: InfoApi,
    private readonly playerApi: PlayerApi,
    @InjectRepository(PlayerFlagsEntity)
    private readonly playerFlagsRepo: Repository<PlayerFlagsEntity>,
    @InjectS3() private readonly s3: S3,
  ) {}

  @ModeratorGuard()
  @WithUser()
  @WithPagination()
  @ApiQuery({
    name: "steam_id",
    type: "string",
    required: false,
  })
  @Get("/crimes")
  async crimes(
    @Query("page", NullableIntPipe) page: number,
    @Query("per_page", NullableIntPipe) perPage: number = 25,
    @Query("steam_id") steamId?: string,
  ): Promise<CrimeLogPageDto> {
    const pg = await this.api.crimeControllerCrimeLog(page, perPage, steamId);
    const data: CrimeLogDto[] = await Promise.all(
      pg.data.map(this.mapper.mapCrimeLog),
    );
    return {
      ...pg,
      data,
    };
  }

  @AdminGuard()
  @WithUser()
  @Post("updateGameMode")
  public async updateGameMode(
    @Body() b: UpdateModeDTO,
  ): Promise<MatchmakingInfo[]> {
    await this.infoApi.infoControllerUpdateGamemode(b.mode, {
      enabled: b.enabled,
      dota_map: b.dotaMap,
      game_mode: b.dotaGameMode,
      enableCheats: b.enableCheats,
      fillBots: b.fillBots,
    });

    return this.infoApi.infoControllerGamemodes().then((t) =>
      t.map((x) => ({
        ...x,
        queueDurations: [],
      })),
    );
  }

  @AdminGuard()
  @WithUser()
  @Post("update_role")
  public async updateRole(@Body() b: UpdateRolesDto) {
    this.rq.emit(UserRolesUpdatedEvent.name, {
      id: new PlayerId(b.steam_id),
      role: b.role,
      end_time: b.end_time,
    });
  }

  @ModeratorGuard()
  @WithUser()
  @Get("roles/:id")
  public async roleOf(@Param("id") id: string): Promise<UserRoleSummaryDto> {
    const q = await this.qBus.execute<
      GetRoleSubscriptionsQuery,
      GetRoleSubscriptionsQueryResult
    >(new GetRoleSubscriptionsQuery(new PlayerId(id)));
    return (
      await Promise.all(
        q.entries.map(async (t) => ({
          steam_id: t.steam_id,
          name: (await this.user.userDto(t.steam_id)).name,
          entries: t.entries.map((z) => ({ ...z, steam_id: z.playerId.value })),
        })),
      )
    )[0];
  }

  @ModeratorGuard()
  @WithUser()
  @Get("ban/:id")
  public async banOf(@Param("id") id: string): Promise<UserBanSummaryDto> {
    const res = await this.qBus.execute<
      GetPlayerInfoQuery,
      GetPlayerInfoQueryResult
    >(new GetPlayerInfoQuery(new PlayerId(id), Dota2Version.Dota_681));

    return {
      steam_id: res.playerId.value,
      banStatus: res.banStatus,
    };
  }

  @ModeratorGuard()
  @WithUser()
  @Get("smurf/:steam_id")
  public async smurfOf(
    @Param("steam_id") steamId: string,
  ): Promise<SmurfData[]> {
    const data = await this.playerApi.playerControllerSmurfData(steamId);
    return Promise.all(
      data.relatedBans.map(async (rb) => ({
        user: await this.user.userDto(rb.steam_id),
        ban: {
          isBanned: rb.isBanned,
          bannedUntil: rb.bannedUntil,
          status: rb.status,
        },
      })),
    );
  }

  @ModeratorGuard()
  @WithUser()
  @Post("ban/:id")
  public async banId(@Param("id") id: string, @Body() b: BanHammerDto) {
    this.rq.emit(PlayerBanHammeredEvent.name, {
      playerId: new PlayerId(id),
      endTime: b.endTime,
      reason: b.reason,
    });
  }

  @ModeratorGuard()
  @WithUser()
  @Get("roles")
  public async listRoles(): Promise<UserRoleSummaryDto[]> {
    const q = await this.qBus.execute<
      GetRoleSubscriptionsQuery,
      GetRoleSubscriptionsQueryResult
    >(new GetRoleSubscriptionsQuery());
    return Promise.all(
      q.entries.map(async (t) => ({
        steam_id: t.steam_id,
        name: (await this.user.userDto(t.steam_id)).name,
        entries: t.entries.map((z) => ({ ...z, steam_id: z.playerId.value })),
      })),
    );
  }

  @ModeratorGuard()
  @WithUser()
  @Get("logFile")
  public async logFile(@Query("id") id: string): Promise<string> {
    const res = await this.s3.getObject({
      Bucket: "logs",
      Key: `${id}.log`,
    });

    return res.Body.transformToString();
  }

  @ModeratorGuard()
  @WithUser()
  @Get("/player/:id/flag")
  public async playerFlags(@Param("id") id: string): Promise<PlayerFlagDto> {
    const ex = await this.playerFlagsRepo.findOne({ where: { steamId: id } });
    if (!ex) {
      return {
        steamId: id,
        ignoreSmurf: false,
        disableReports: false,
        disableStreams: false,
      };
    }
    return ex;
  }

  @ModeratorGuard()
  @WithUser()
  @Post("/player/:id/flag")
  public async flagPlayer(
    @Param("id") id: string,
    @Body() dto: UpdatePlayerFlagDto,
  ): Promise<PlayerFlagDto> {
    let flags = await this.playerFlagsRepo.findOne({ where: { steamId: id } });
    if (!flags) {
      flags = new PlayerFlagsEntity();
      flags.steamId = id;
      flags.ignoreSmurf = false;
      flags.disableReports = false;
      flags.disableStreams = false;
    }
    Object.assign(flags, dto);
    await this.playerFlagsRepo.save(flags);
    return this.playerFlagsRepo.findOne({ where: { steamId: id } });
  }
}
