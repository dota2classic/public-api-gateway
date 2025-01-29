import { MigrationInterface, QueryRunner } from "typeorm";

export class EntityId1738142326844 implements MigrationInterface {
  name = "EntityId1738142326844";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_entity" RENAME COLUMN "player_feedback_id" TO "entity_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ALTER COLUMN "ttl" SET DEFAULT '1day'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ALTER COLUMN "ttl" SET DEFAULT '1 day'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_entity" RENAME COLUMN "entity_id" TO "player_feedback_id"`,
    );
  }
}
