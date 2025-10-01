import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationParams1758963571400 implements MigrationInterface {
  name = "NotificationParams1758963571400";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ADD "params" jsonb NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_entity" DROP COLUMN "params"`,
    );
  }
}
