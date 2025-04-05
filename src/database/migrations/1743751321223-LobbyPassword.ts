import { MigrationInterface, QueryRunner } from "typeorm";

export class LobbyPassword1743751321223 implements MigrationInterface {
  name = "LobbyPassword1743751321223";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lobby_entity" ADD "password" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lobby_entity" DROP COLUMN "password"`,
    );
  }
}
