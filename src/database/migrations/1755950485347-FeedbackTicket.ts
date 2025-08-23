import { MigrationInterface, QueryRunner } from "typeorm";

export class FeedbackTicket1755950485347 implements MigrationInterface {
  name = "FeedbackTicket1755950485347";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" ADD "need_ticket" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feedback_entity" DROP COLUMN "need_ticket"`,
    );
  }
}
