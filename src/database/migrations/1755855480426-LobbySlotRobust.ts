import { MigrationInterface, QueryRunner } from "typeorm";

export class LobbySlotRobust1755855480426 implements MigrationInterface {
  name = "LobbySlotRobust1755855480426";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" DROP CONSTRAINT "PK_52833cf1d791f0e7ce2c5faf6f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" ADD CONSTRAINT "PK_2f25f577bc4d287c1a3e74c3901" PRIMARY KEY ("steam_id", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" DROP CONSTRAINT "PK_2f25f577bc4d287c1a3e74c3901"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" ADD CONSTRAINT "PK_453b0b145df10fb5f3c05cceb41" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" ADD CONSTRAINT "UQ_52833cf1d791f0e7ce2c5faf6f3" UNIQUE ("steam_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK_lobby_slot_unique_lobby_team_index" ON "lobby_slot_entity" ("lobby_id", "index_in_team", "team") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."PK_lobby_slot_unique_lobby_team_index"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" DROP CONSTRAINT "UQ_52833cf1d791f0e7ce2c5faf6f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" DROP CONSTRAINT "PK_453b0b145df10fb5f3c05cceb41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" ADD CONSTRAINT "PK_2f25f577bc4d287c1a3e74c3901" PRIMARY KEY ("steam_id", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" DROP CONSTRAINT "PK_2f25f577bc4d287c1a3e74c3901"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" ADD CONSTRAINT "PK_52833cf1d791f0e7ce2c5faf6f3" PRIMARY KEY ("steam_id")`,
    );
    await queryRunner.query(`ALTER TABLE "lobby_slot_entity" DROP COLUMN "id"`);
  }
}
