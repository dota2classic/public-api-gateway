import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { UserRelationEntity } from "../entity/user-relation.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRelationStatus } from "../gateway/shared-types/user-relation";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UserProfileFastService } from "@dota2classic/caches/dist/service/user-profile-fast.service";
import { UserFastProfileDto } from "../gateway/caches/user-fast-profile.dto";
import { isOld } from "../utils/is-old";
import { measure } from "../utils/decorator/measure";

@Injectable()
export class UserRelationService implements OnApplicationBootstrap {
  private logger = new Logger(UserRelationService.name);
  private relationMap = new WeakMap<
    string,
    WeakMap<string, UserRelationStatus>
  >();
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
    if (!u || !isOld(u.roles.map((t) => t.role))) return undefined;
    return this.getRelationSync(steamId, related);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async onApplicationBootstrap() {
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

  private getOrCreate(steamId: string): WeakMap<string, UserRelationStatus> {
    let m = this.relationMap.get(steamId);
    if (!m) {
      m = new Map();
      this.relationMap.set(steamId, m);
    }
    return m;
  }
}
