import { MigrationInterface, QueryRunner } from "typeorm";

export class FeedbackId1738175036321 implements MigrationInterface {
  name = "FeedbackId1738175036321";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "feedback_option_entity" ("id" SERIAL NOT NULL, "option" character varying NOT NULL, "feedback_id" integer NOT NULL, CONSTRAINT "PK_2a1ac20e0dd881102f4f0741fcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feedback_entity" ("id" SERIAL NOT NULL, "tag" text NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_507ad6f30e7e6269fe648627dec" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "unique_tag" ON "feedback_entity" ("tag") `,
    );
    await queryRunner.query(
      `CREATE TABLE "player_feedback_entity" ("id" SERIAL NOT NULL, "feedback_tag" text NOT NULL, "steam_id" character varying NOT NULL, "comment" character varying, "finished" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9a9afa9353e0cb3eaeae060e554" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "player_feedback_option_result_entity" ("id" SERIAL NOT NULL, "player_feedback_id" integer NOT NULL, "option" character varying NOT NULL, "checked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_player_feedback_option" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "steam_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ttl" interval NOT NULL DEFAULT '1day', "acknowledged" boolean NOT NULL DEFAULT false, "entity_id" integer NOT NULL, "entity_type" character varying NOT NULL, CONSTRAINT "PK_d792aa808cb245891a5d1ee3e55" PRIMARY KEY ("id", "steam_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_option_entity" ADD CONSTRAINT "FK_493356ccfbf273e828fbb52e19a" FOREIGN KEY ("feedback_id") REFERENCES "feedback_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_feedback_entity" ADD CONSTRAINT "FK_18ee4feff1ee1865a20bd61eb5c" FOREIGN KEY ("feedback_tag") REFERENCES "feedback_entity"("tag") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_feedback_option_result_entity" ADD CONSTRAINT "FK_215ef4aa332d96a218ccdede18f" FOREIGN KEY ("player_feedback_id") REFERENCES "player_feedback_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_feedback_option_result_entity" DROP CONSTRAINT "FK_215ef4aa332d96a218ccdede18f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_feedback_entity" DROP CONSTRAINT "FK_18ee4feff1ee1865a20bd61eb5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_option_entity" DROP CONSTRAINT "FK_493356ccfbf273e828fbb52e19a"`,
    );
    await queryRunner.query(`DROP TABLE "notification_entity"`);
    await queryRunner.query(
      `DROP TABLE "player_feedback_option_result_entity"`,
    );
    await queryRunner.query(`DROP TABLE "player_feedback_entity"`);
    await queryRunner.query(`DROP INDEX "public"."unique_tag"`);
    await queryRunner.query(`DROP TABLE "feedback_entity"`);
    await queryRunner.query(`DROP TABLE "feedback_option_entity"`);
  }
}
