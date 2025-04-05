import { MigrationInterface, QueryRunner } from "typeorm";

export class LobbyName1743761696109 implements MigrationInterface {
  name = "LobbyName1743761696109";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lobby_entity" ADD "name" text NOT NULL DEFAULT 'Лобби'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lobby_entity" DROP COLUMN "name"`);
  }
}
