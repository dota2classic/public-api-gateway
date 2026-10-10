import { MigrationInterface, QueryRunner } from "typeorm";

export class SteamidHwidEntryIndexes1791700000001
  implements MigrationInterface
{
  name = "SteamidHwidEntryIndexes1791700000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_steamid_hwid_entry_hwid" ON "steamid_hwid_entry" ("hwid")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_steamid_hwid_entry_steam_id" ON "steamid_hwid_entry" ("steam_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_steamid_hwid_entry_steam_id"`);
    await queryRunner.query(`DROP INDEX "IDX_steamid_hwid_entry_hwid"`);
  }
}
