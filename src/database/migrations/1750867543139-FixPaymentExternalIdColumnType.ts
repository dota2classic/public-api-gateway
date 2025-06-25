import { MigrationInterface, QueryRunner } from "typeorm";

export class FixPaymentExternalIdColumnType1750867543139
  implements MigrationInterface
{
  name = "FixPaymentExternalIdColumnType1750867543139";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_payment" ALTER COLUMN "payment_id" TYPE text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_payment" ALTER COLUMN "payment_id" TYPE uuid`,
    );
  }
}
