import { MigrationInterface, QueryRunner } from "typeorm";

export class Tmp1738088805723 implements MigrationInterface {
  name = "Tmp1738088805723";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "steam_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "ttl" interval NOT NULL DEFAULT '1day', "acknowledged" boolean NOT NULL DEFAULT false, "player_feedback_id" integer, CONSTRAINT "PK_d792aa808cb245891a5d1ee3e55" PRIMARY KEY ("id", "steam_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "player_feedback_entity" ("id" SERIAL NOT NULL, "feedback_tag" text NOT NULL, "steam_id" character varying NOT NULL, "comment" character varying, "finished" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9a9afa9353e0cb3eaeae060e554" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feedback_entity" ("tag" text NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_99a413f0c91736ab031e3901d12" PRIMARY KEY ("tag"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feedback_option_entity" ("id" SERIAL NOT NULL, "option" character varying NOT NULL, "feedback_tag" text NOT NULL, CONSTRAINT "PK_2a1ac20e0dd881102f4f0741fcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "player_feedback_option_result_entity" ("player_feedback_id" integer NOT NULL, "feedback_option_id" integer NOT NULL, "checked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_42a326f38e974d7f0a4992d832a" PRIMARY KEY ("player_feedback_id", "feedback_option_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_entity" ADD CONSTRAINT "FK_7215efb15f840939ef8e8e15b43" FOREIGN KEY ("player_feedback_id") REFERENCES "player_feedback_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_feedback_entity" ADD CONSTRAINT "FK_18ee4feff1ee1865a20bd61eb5c" FOREIGN KEY ("feedback_tag") REFERENCES "feedback_entity"("tag") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_option_entity" ADD CONSTRAINT "FK_83f26cd141473635b67435d977e" FOREIGN KEY ("feedback_tag") REFERENCES "feedback_entity"("tag") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_feedback_option_result_entity" ADD CONSTRAINT "FK_215ef4aa332d96a218ccdede18f" FOREIGN KEY ("player_feedback_id") REFERENCES "player_feedback_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_feedback_option_result_entity" ADD CONSTRAINT "FK_43569abaa08f54891d2cc34c14b" FOREIGN KEY ("feedback_option_id") REFERENCES "feedback_option_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "player_feedback_option_result_entity" DROP CONSTRAINT "FK_43569abaa08f54891d2cc34c14b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_feedback_option_result_entity" DROP CONSTRAINT "FK_215ef4aa332d96a218ccdede18f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_option_entity" DROP CONSTRAINT "FK_83f26cd141473635b67435d977e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_feedback_entity" DROP CONSTRAINT "FK_18ee4feff1ee1865a20bd61eb5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_entity" DROP CONSTRAINT "FK_7215efb15f840939ef8e8e15b43"`,
    );
    await queryRunner.query(
      `DROP TABLE "player_feedback_option_result_entity"`,
    );
    await queryRunner.query(`DROP TABLE "feedback_option_entity"`);
    await queryRunner.query(`DROP TABLE "feedback_entity"`);
    await queryRunner.query(`DROP TABLE "player_feedback_entity"`);
    await queryRunner.query(`DROP TABLE "notification_entity"`);
  }
}
