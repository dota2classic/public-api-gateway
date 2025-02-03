import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationType1738614850019 implements MigrationInterface {
  name = "NotificationType1738614850019";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ADD "notification_type" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ALTER COLUMN "ttl" SET DEFAULT '1day'`,
    );
    await queryRunner.query(
      `UPDATE notification_entity SET notification_type = 'ACHIEVEMENT_COMPLETE' WHERE entity_type = 'ACHIEVEMENT';`,
    );
    await queryRunner.query(
      `UPDATE notification_entity SET notification_type = 'FEEDBACK_CREATED' WHERE entity_type = 'FEEDBACK';`,
    );
    await queryRunner.query(
      `UPDATE notification_entity SET notification_type = 'TICKET_CREATED' WHERE entity_type = 'FEEDBACK_TICKET';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ALTER COLUMN "ttl" SET DEFAULT '1 day'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_entity" DROP COLUMN "notification_type"`,
    );
  }
}
