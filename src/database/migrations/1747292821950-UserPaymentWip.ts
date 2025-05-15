import { MigrationInterface, QueryRunner } from "typeorm";

export class UserPaymentWip1747292821950 implements MigrationInterface {
  name = "UserPaymentWip1747292821950";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_payment_status" AS ENUM('CREATED', 'IN_PROGRESS', 'FAILED', 'SUCCEEDED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "steam_id" character varying NOT NULL, "payment_id" uuid, "amount" integer NOT NULL, "status" "public"."user_payment_status" NOT NULL, CONSTRAINT "PK_57db108902981ff1f5fcc2f2336" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_payment"`);
    await queryRunner.query(`DROP TYPE "public"."user_payment_status"`);
  }
}
