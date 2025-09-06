import { MigrationInterface, QueryRunner } from "typeorm";

export class NoticiationEntityIndex1757112229068 implements MigrationInterface {
  name = "NoticiationEntityIndex1757112229068";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "idx_notification_entity_acknowledged" ON "notification_entity" ("acknowledged") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."idx_notification_entity_acknowledged"`,
    );
  }
}
