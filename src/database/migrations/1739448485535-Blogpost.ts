import { MigrationInterface, QueryRunner } from "typeorm";

export class Blogpost1739448485535 implements MigrationInterface {
  name = "Blogpost1739448485535";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "blogpost_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "image_key" character varying NOT NULL, "content" text NOT NULL, "author" character varying NOT NULL, "published" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "publish_date" TIMESTAMP, CONSTRAINT "PK_dc3a0cccb48f9c58a66148bf701" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "blogpost_entity"`);
  }
}
