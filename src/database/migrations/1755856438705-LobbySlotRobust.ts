import { MigrationInterface, QueryRunner } from "typeorm";

export class LobbySlotRobust1755856438705 implements MigrationInterface {
  name = "LobbySlotRobust1755856438705";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" ALTER COLUMN "steam_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" DROP CONSTRAINT "UQ_52833cf1d791f0e7ce2c5faf6f3"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" ADD CONSTRAINT "UQ_52833cf1d791f0e7ce2c5faf6f3" UNIQUE ("steam_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" ALTER COLUMN "steam_id" SET NOT NULL`,
    );
  }
}
