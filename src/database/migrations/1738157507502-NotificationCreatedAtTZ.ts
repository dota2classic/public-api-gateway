import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationCreatedAtTZ1738157507502
  implements MigrationInterface
{
  name = "NotificationCreatedAtTZ1738157507502";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_entity" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
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
      `ALTER TABLE "notification_entity" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
