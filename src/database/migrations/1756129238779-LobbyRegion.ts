import { MigrationInterface, QueryRunner } from "typeorm";

export class LobbyRegion1756129238779 implements MigrationInterface {
  name = "LobbyRegion1756129238779";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."lobby_entity_region_enum" AS ENUM('ru_moscow', 'ru_novosibirsk', 'eu_czech')`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_entity" ADD "region" "public"."lobby_entity_region_enum" NOT NULL DEFAULT 'ru_moscow'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lobby_entity" DROP COLUMN "region"`);
    await queryRunner.query(`DROP TYPE "public"."lobby_entity_region_enum"`);
  }
}
