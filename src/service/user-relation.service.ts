import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { UserRelationEntity } from "../database/entities/user-relation.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRelationStatus } from "../gateway/shared-types/user-relation";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UserProfileFastService } from "@dota2classic/caches/dist/service/user-profile-fast.service";
import { UserFastProfileDto } from "../gateway/caches/user-fast-profile.dto";
import { measure } from "../utils/decorator/measure";
import Keyv from "keyv";

@Injectable()
export class UserRelationService implements OnApplicationBootstrap {
  private logger = new Logger(UserRelationService.name);

  constructor(
    @Inject("user-relation") private readonly keyv: Keyv,
    @InjectRepository(UserRelationEntity)
    private readonly userRelationEntityRepository: Repository<UserRelationEntity>,
    private readonly fast: UserProfileFastService<UserFastProfileDto>,
  ) {}

  public async getRelationSync(
    steamId: string,
    related: string,
  ): Promise<UserRelationStatus | undefined> {
    const relations =
      await this.keyv.get<Record<string, UserRelationStatus>>(steamId);
    return relations?.[related];
  }

  @measure("GetRelationAsync")
  public async getRelation(
    steamId: string,
    related: string,
  ): Promise<UserRelationStatus | undefined> {
    const u = await this.fast.get(steamId);
    if (!u) return undefined;

    return this.getRelationSync(steamId, related);
  }

  async onApplicationBootstrap() {
    await this.refreshRelations();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async refreshRelations() {
    const chunkSize = 100;
    const total = await this.userRelationEntityRepository.count();
    const byUser = new Map<string, Record<string, UserRelationStatus>>();

    for (let i = 0; i < Math.ceil(total / chunkSize); i++) {
      const batch = await this.userRelationEntityRepository.find({
        order: { steamId: "ASC" },
        skip: i * chunkSize,
        take: chunkSize,
      });
      for (const relation of batch) {
        if (!byUser.has(relation.steamId)) byUser.set(relation.steamId, {});
        byUser.get(relation.steamId)![relation.relatedSteamId] =
          relation.relation;
      }
      this.logger.log(`Saved batch ${i}`);
    }

    for (const [steamId, relations] of byUser) {
      await this.keyv.set(steamId, relations);
    }
  }

  public async clearPlayerRelation(steamId: string, relatedSteamId: string) {
    await this.userRelationEntityRepository.delete({
      steamId,
      relatedSteamId,
    });
    const relations =
      (await this.keyv.get<Record<string, UserRelationStatus>>(steamId)) ?? {};
    delete relations[relatedSteamId];
    await this.keyv.set(steamId, relations);
  }

  public async setPlayerRelation(
    steamId: string,
    relatedSteamId: string,
    relation?: UserRelationStatus,
  ) {
    await this.userRelationEntityRepository.upsert(
      { steamId, relatedSteamId, relation },
      ["steamId", "relatedSteamId"],
    );
    const relations =
      (await this.keyv.get<Record<string, UserRelationStatus>>(steamId)) ?? {};
    relations[relatedSteamId] = relation!;
    await this.keyv.set(steamId, relations);
  }

  public async getFriends(steamId: string): Promise<string[]> {
    const relations =
      await this.keyv.get<Record<string, UserRelationStatus>>(steamId);
    if (!relations) return [];
    return Object.entries(relations)
      .filter(([, status]) => status === UserRelationStatus.FRIEND)
      .map(([id]) => id);
  }
}
