import { MigrationInterface, QueryRunner } from "typeorm";

export class StringEntityType1738583281408 implements MigrationInterface {
  name = "StringEntityType1738583281408";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ALTER COLUMN "ttl" SET DEFAULT '1day'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ALTER COLUMN "entity_id" TYPE text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_entity" DROP COLUMN "entity_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ALTER COLUMN "entity_id" TYPE integer`,
    );
  }
}
