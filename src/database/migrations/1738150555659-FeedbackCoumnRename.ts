import { MigrationInterface, QueryRunner } from "typeorm";

export class FeedbackCoumnRename1738150555659 implements MigrationInterface {
  name = "FeedbackCoumnRename1738150555659";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_feedback_entity" RENAME COLUMN "createdAt" TO "created_at"`,
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
      `ALTER TABLE "player_feedback_entity" RENAME COLUMN "created_at" TO "createdAt"`,
    );
  }
}
