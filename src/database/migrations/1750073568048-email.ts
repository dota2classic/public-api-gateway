import { MigrationInterface, QueryRunner } from "typeorm";

export class Email1750073568048 implements MigrationInterface {
  name = "Email1750073568048";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_payment" ADD "email" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_payment" DROP COLUMN "email"`);
  }
}
