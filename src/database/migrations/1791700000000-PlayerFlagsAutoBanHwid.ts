import { MigrationInterface, QueryRunner } from "typeorm";

export class PlayerFlagsAutoBanHwid1791700000000 implements MigrationInterface {
  name = "PlayerFlagsAutoBanHwid1791700000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_flags" ADD "auto_ban_hwid" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_flags" DROP COLUMN "auto_ban_hwid"`,
    );
  }
}
