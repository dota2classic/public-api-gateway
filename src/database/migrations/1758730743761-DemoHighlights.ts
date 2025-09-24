import { MigrationInterface, QueryRunner } from "typeorm";

export class DemoHighlights1758730743761 implements MigrationInterface {
  name = "DemoHighlights1758730743761";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "demo_highlights" ("match_id" integer NOT NULL, "highlights" jsonb NOT NULL, CONSTRAINT "PK_5efb528d817c6cd13158d2b4273" PRIMARY KEY ("match_id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "demo_highlights"`);
  }
}
