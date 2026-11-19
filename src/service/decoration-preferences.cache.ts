import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as memoize from "memoizee";
import { UserProfileDecorationPreferencesEntity } from "../database/entities/user-profile-decoration-preferences.entity";

@Injectable()
export class DecorationPreferencesCache {
  constructor(
    @InjectRepository(UserProfileDecorationPreferencesEntity)
    private readonly repository: Repository<UserProfileDecorationPreferencesEntity>,
  ) {}

  private readonly load = memoize(
    async () => {
      const rows = await this.repository.find();
      return new Map(rows.map((row) => [row.steamId, row]));
    },
    { promise: true, maxAge: 30_000 },
  );

  public get = async (steamId: string): Promise<UserProfileDecorationPreferencesEntity | undefined> =>
    (await this.load()).get(steamId);

  public invalidate = () => {
    this.load.clear();
  };
}
