import { MigrationInterface, QueryRunner } from "typeorm";

export class Flag1751972886833 implements MigrationInterface {
  name = "Flag1751972886833";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_flags" ADD "disable_streams" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_flags" DROP COLUMN "disable_streams"`,
    );
  }
}
