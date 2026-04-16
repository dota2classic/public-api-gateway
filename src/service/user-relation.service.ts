import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { UserRelationEntity } from "../database/entities/user-relation.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRelationStatus } from "../gateway/shared-types/user-relation";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UserProfileFastService } from "@dota2classic/caches/dist/service/user-profile-fast.service";
import { UserFastProfileDto } from "../gateway/caches/user-fast-profile.dto";
import { measure } from "../utils/decorator/measure";

@Injectable()
export class UserRelationService implements OnApplicationBootstrap {
  private logger = new Logger(UserRelationService.name);
  private relationMap = new Map<string, Map<string, UserRelationStatus>>();
  constructor(
    @InjectRepository(UserRelationEntity)
    private readonly userRelationEntityRepository: Repository<UserRelationEntity>,
    private readonly fast: UserProfileFastService<UserFastProfileDto>,
  ) {}

  public getRelationSync(
    steamId: string,
    related: string,
  ): UserRelationStatus | undefined {
    return this.getOrCreate(steamId).get(related);
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
    this.relationMap.clear();
    const chunkSize = 100;
    const total = await this.userRelationEntityRepository.count();
    for (let i = 0; i < Math.ceil(total / chunkSize); i++) {
      const batch = await this.userRelationEntityRepository.find({
        order: {
          steamId: "ASC",
        },
        skip: i * chunkSize,
        take: chunkSize,
      });
      for (let relation of batch) {
        this.getOrCreate(relation.steamId).set(
          relation.relatedSteamId,
          relation.relation,
        );
      }
      this.logger.log(`Saved batch ${i}`);
    }
  }

  public async clearPlayerRelation(steamId: string, relatedSteamId: string) {
    await this.userRelationEntityRepository.delete({
      steamId: steamId,
      relatedSteamId: relatedSteamId,
    });
    this.getOrCreate(steamId).delete(relatedSteamId);
  }

  public async setPlayerRelation(
    steamId: string,
    relatedSteamId: string,
    relation?: UserRelationStatus,
  ) {
    await this.userRelationEntityRepository.upsert(
      {
        steamId: steamId,
        relatedSteamId: relatedSteamId,
        relation: relation,
      },
      ["steamId", "relatedSteamId"],
    );
    this.getOrCreate(steamId).set(relatedSteamId, relation);
  }

  public getFriends(steamId: string): string[] {
    const m = this.relationMap.get(steamId);
    if (!m) return [];
    return Array.from(m.entries())
      .filter(([, status]) => status === UserRelationStatus.FRIEND)
      .map(([id]) => id);
  }

  private getOrCreate(steamId: string): Map<string, UserRelationStatus> {
    let m = this.relationMap.get(steamId);
    if (!m) {
      m = new Map();
      this.relationMap.set(steamId, m);
    }
    return m;
  }
}
