import { MigrationInterface, QueryRunner } from "typeorm";

export class BlogpostDescription1739471947194 implements MigrationInterface {
  name = "BlogpostDescription1739471947194";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogpost_entity" ADD "short_description" text NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogpost_entity" DROP COLUMN "short_description"`,
    );
  }
}
