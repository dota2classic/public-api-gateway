import { MigrationInterface, QueryRunner } from "typeorm";

export class BlogpostRenderedHtml1739824559290 implements MigrationInterface {
  name = "BlogpostRenderedHtml1739824559290";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogpost_entity" ADD "rendered_content_html" text NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogpost_entity" DROP COLUMN "rendered_content_html"`,
    );
  }
}
