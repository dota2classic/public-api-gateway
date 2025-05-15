import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentFields1747304028409 implements MigrationInterface {
  name = "PaymentFields1747304028409";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_payment" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_payment" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ALTER COLUMN "notification_type" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ALTER COLUMN "ttl" SET DEFAULT '1 day'`,
    );
  }
}
