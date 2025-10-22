import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1760396612325 implements MigrationInterface {
  name = "Initial1760396612325";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "steam_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ttl" interval NOT NULL DEFAULT '1day', "acknowledged" boolean NOT NULL DEFAULT false, "entity_id" text NOT NULL, "entity_type" character varying NOT NULL, "notification_type" character varying NOT NULL, "params" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "PK_d792aa808cb245891a5d1ee3e55" PRIMARY KEY ("id", "steam_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_notification_entity_acknowledged" ON "notification_entity" ("acknowledged") `,
    );
    await queryRunner.query(
      `CREATE TABLE "webpush_subscription_entity" ("steam_id" character varying NOT NULL, "subscription" text NOT NULL, CONSTRAINT "PK_e17ceb1e43fb03303732e62d94c" PRIMARY KEY ("steam_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lobby_slot_entity" ("id" SERIAL NOT NULL, "lobby_id" uuid NOT NULL, "index_in_team" integer NOT NULL DEFAULT '0', "team" integer, "steam_id" character varying, CONSTRAINT "PK_453b0b145df10fb5f3c05cceb41" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK_lobby_slot_unique_lobby_team_index" ON "lobby_slot_entity" ("lobby_id", "index_in_team", "team") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."lobby_entity_patch_enum" AS ENUM('DOTA_684', 'DOTA_684_TURBO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."lobby_entity_region_enum" AS ENUM('ru_moscow', 'ru_novosibirsk', 'eu_czech')`,
    );
    await queryRunner.query(
      `CREATE TABLE "lobby_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "owner_steam_id" character varying NOT NULL, "gameMode" integer NOT NULL DEFAULT '1', "map" character varying NOT NULL DEFAULT 'dota', "name" text NOT NULL DEFAULT 'Лобби', "password" text, "fill_bots" boolean NOT NULL DEFAULT false, "enable_cheats" boolean NOT NULL DEFAULT false, "patch" "public"."lobby_entity_patch_enum" NOT NULL DEFAULT 'DOTA_684', "region" "public"."lobby_entity_region_enum" NOT NULL DEFAULT 'ru_moscow', CONSTRAINT "PK_32247bff818222945f5587dfabf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feedback_option_entity" ("id" SERIAL NOT NULL, "option" character varying NOT NULL, "feedback_id" integer NOT NULL, CONSTRAINT "PK_2a1ac20e0dd881102f4f0741fcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feedback_entity" ("id" SERIAL NOT NULL, "tag" text NOT NULL, "need_ticket" boolean NOT NULL DEFAULT true, "title" character varying NOT NULL, CONSTRAINT "PK_507ad6f30e7e6269fe648627dec" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "blogpost_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "image_key" character varying NOT NULL, "short_description" text NOT NULL DEFAULT '', "content" text NOT NULL, "rendered_content_html" text NOT NULL DEFAULT '', "author" character varying NOT NULL, "published" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "publish_date" TIMESTAMP, CONSTRAINT "PK_dc3a0cccb48f9c58a66148bf701" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "player_flags" ("steam_id" character varying NOT NULL, "ignore_smurf_alert" boolean NOT NULL, "disable_reports" boolean NOT NULL DEFAULT false, "disable_streams" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_6b9f48002b7d13ddeef98783fc1" PRIMARY KEY ("steam_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profile_decoration_preferences" ("steam_id" character varying NOT NULL, "hat_id" integer, "icon_id" integer, "title_id" integer, "animation_id" integer, CONSTRAINT "PK_9ec769fd2e34c89f9a096f4cde5" PRIMARY KEY ("steam_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_profile_decoration_type" AS ENUM('HAT', 'TITLE', 'CHAT_ICON', 'CHAT_ICON_ANIMATION')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profile_decoration" ("id" SERIAL NOT NULL, "title" character varying NOT NULL DEFAULT '', "decoration_type" "public"."user_profile_decoration_type" NOT NULL, "image_key" character varying NOT NULL, CONSTRAINT "PK_0168ed555fa7970d36ce190e9e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscription_product" ("id" SERIAL NOT NULL, "months" integer NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_7fe49a45c06703b6cb93244817f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_payment_status" AS ENUM('CREATED', 'IN_PROGRESS', 'FAILED', 'SUCCEEDED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "steam_id" character varying NOT NULL, "product_id" integer NOT NULL, "email" character varying NOT NULL, "payment_id" text, "amount" integer NOT NULL, "status" "public"."user_payment_status" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_57db108902981ff1f5fcc2f2336" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_relation_status" AS ENUM('FRIEND', 'BLOCK')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_relation" ("steam_id" character varying NOT NULL, "related_steam_id" character varying NOT NULL, "relation" "public"."user_relation_status" NOT NULL, CONSTRAINT "PK_19699cb9ea18ddf0ba006df09b9" PRIMARY KEY ("steam_id", "related_steam_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reporter_steam_id" character varying NOT NULL, "reported_steam_id" character varying NOT NULL, "rule_id" integer NOT NULL, "match_id" integer, "message_id" character varying, "comment" character varying NOT NULL DEFAULT '', "handled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "CHK_d29a1d9d78f8d90d8ed50eb3b8" CHECK (message_id is not null or match_id is not null), CONSTRAINT "PK_58c08f0e20fa66561b119421eb2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "punishment_log" ("id" SERIAL NOT NULL, "rule_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "ban_duration_seconds" integer NOT NULL, "report_id" uuid, "punishment_id" integer, "reported" character varying NOT NULL, "executor" character varying NOT NULL, CONSTRAINT "REL_2d1013045d04ca9e6e29b7e133" UNIQUE ("report_id"), CONSTRAINT "PK_575d64625689f4ab69a2eaeeeda" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rule_punishment" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "duration_hours" integer NOT NULL, CONSTRAINT "PK_d4ac1b7c3cf8d24853293b2ef72" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rule_type" AS ENUM('GAMEPLAY', 'COMMUNICATION')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rule_entity" ("id" SERIAL NOT NULL, "index" smallint NOT NULL, "title" character varying NOT NULL DEFAULT 'Правило', "description" character varying NOT NULL DEFAULT '', "automatic" boolean NOT NULL DEFAULT false, "rule_type" "public"."rule_type" NOT NULL DEFAULT 'GAMEPLAY', "parent_id" integer, "punishment_id" integer, CONSTRAINT "PK_522a2134d8b4453d5e30c0a7fbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "player_ban" ("steam_id" character varying NOT NULL, "end_time" TIMESTAMP WITH TIME ZONE NOT NULL, "reason" integer NOT NULL, CONSTRAINT "PK_ba50bbc64c84c0ba39568d14599" PRIMARY KEY ("steam_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "maintenance" ("id" SERIAL NOT NULL, "active" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_542fb6a28537140d2df95faa52a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "demo_highlights" ("match_id" integer NOT NULL, "highlights" jsonb NOT NULL, CONSTRAINT "PK_5efb528d817c6cd13158d2b4273" PRIMARY KEY ("match_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" ADD CONSTRAINT "FK_a6263b55e183ebfa011c3a785cb" FOREIGN KEY ("lobby_id") REFERENCES "lobby_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" ADD CONSTRAINT "FK_9b4e781db5326680e374cf23f24" FOREIGN KEY ("hat_id") REFERENCES "user_profile_decoration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" ADD CONSTRAINT "FK_857cedf864b3fc8aa86dfa48c90" FOREIGN KEY ("icon_id") REFERENCES "user_profile_decoration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" ADD CONSTRAINT "FK_0b60eff6f7c142df1069e125f5f" FOREIGN KEY ("title_id") REFERENCES "user_profile_decoration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" ADD CONSTRAINT "FK_03597be25f66ffd7b9055f7ed32" FOREIGN KEY ("animation_id") REFERENCES "user_profile_decoration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_payment" ADD CONSTRAINT "FK_826da897ea856698fdfdba066d6" FOREIGN KEY ("product_id") REFERENCES "subscription_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_report" ADD CONSTRAINT "FK_b3d865a19136bb877050ce455d0" FOREIGN KEY ("rule_id") REFERENCES "rule_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "punishment_log" ADD CONSTRAINT "FK_fb74930ca8417a176abaa2a8199" FOREIGN KEY ("rule_id") REFERENCES "rule_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "punishment_log" ADD CONSTRAINT "FK_2d1013045d04ca9e6e29b7e1333" FOREIGN KEY ("report_id") REFERENCES "user_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "punishment_log" ADD CONSTRAINT "FK_cd023e8bf6b590e457a445e1ab3" FOREIGN KEY ("punishment_id") REFERENCES "rule_punishment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_entity" ADD CONSTRAINT "FK_90ae657a1454dec404768317250" FOREIGN KEY ("parent_id") REFERENCES "rule_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_entity" ADD CONSTRAINT "FK_6a275a463586467833f407f6133" FOREIGN KEY ("punishment_id") REFERENCES "rule_punishment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rule_entity" DROP CONSTRAINT "FK_6a275a463586467833f407f6133"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_entity" DROP CONSTRAINT "FK_90ae657a1454dec404768317250"`,
    );
    await queryRunner.query(
      `ALTER TABLE "punishment_log" DROP CONSTRAINT "FK_cd023e8bf6b590e457a445e1ab3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "punishment_log" DROP CONSTRAINT "FK_2d1013045d04ca9e6e29b7e1333"`,
    );
    await queryRunner.query(
      `ALTER TABLE "punishment_log" DROP CONSTRAINT "FK_fb74930ca8417a176abaa2a8199"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_report" DROP CONSTRAINT "FK_b3d865a19136bb877050ce455d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_payment" DROP CONSTRAINT "FK_826da897ea856698fdfdba066d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" DROP CONSTRAINT "FK_03597be25f66ffd7b9055f7ed32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" DROP CONSTRAINT "FK_0b60eff6f7c142df1069e125f5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" DROP CONSTRAINT "FK_857cedf864b3fc8aa86dfa48c90"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile_decoration_preferences" DROP CONSTRAINT "FK_9b4e781db5326680e374cf23f24"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_feedback_option_result_entity" DROP CONSTRAINT "FK_215ef4aa332d96a218ccdede18f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_feedback_entity" DROP CONSTRAINT "FK_18ee4feff1ee1865a20bd61eb5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback_option_entity" DROP CONSTRAINT "FK_493356ccfbf273e828fbb52e19a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lobby_slot_entity" DROP CONSTRAINT "FK_a6263b55e183ebfa011c3a785cb"`,
    );
    await queryRunner.query(`DROP TABLE "demo_highlights"`);
    await queryRunner.query(`DROP TABLE "maintenance"`);
    await queryRunner.query(`DROP TABLE "player_ban"`);
    await queryRunner.query(`DROP TABLE "rule_entity"`);
    await queryRunner.query(`DROP TYPE "public"."rule_type"`);
    await queryRunner.query(`DROP TABLE "rule_punishment"`);
    await queryRunner.query(`DROP TABLE "punishment_log"`);
    await queryRunner.query(`DROP TABLE "user_report"`);
    await queryRunner.query(`DROP TABLE "user_relation"`);
    await queryRunner.query(`DROP TYPE "public"."user_relation_status"`);
    await queryRunner.query(`DROP TABLE "user_payment"`);
    await queryRunner.query(`DROP TYPE "public"."user_payment_status"`);
    await queryRunner.query(`DROP TABLE "subscription_product"`);
    await queryRunner.query(`DROP TABLE "user_profile_decoration"`);
    await queryRunner.query(
      `DROP TYPE "public"."user_profile_decoration_type"`,
    );
    await queryRunner.query(`DROP TABLE "user_profile_decoration_preferences"`);
    await queryRunner.query(`DROP TABLE "player_flags"`);
    await queryRunner.query(`DROP TABLE "blogpost_entity"`);
    await queryRunner.query(
      `DROP TABLE "player_feedback_option_result_entity"`,
    );
    await queryRunner.query(`DROP TABLE "player_feedback_entity"`);
    await queryRunner.query(`DROP INDEX "public"."unique_tag"`);
    await queryRunner.query(`DROP TABLE "feedback_entity"`);
    await queryRunner.query(`DROP TABLE "feedback_option_entity"`);
    await queryRunner.query(`DROP TABLE "lobby_entity"`);
    await queryRunner.query(`DROP TYPE "public"."lobby_entity_region_enum"`);
    await queryRunner.query(`DROP TYPE "public"."lobby_entity_patch_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."PK_lobby_slot_unique_lobby_team_index"`,
    );
    await queryRunner.query(`DROP TABLE "lobby_slot_entity"`);
    await queryRunner.query(`DROP TABLE "webpush_subscription_entity"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_notification_entity_acknowledged"`,
    );
    await queryRunner.query(`DROP TABLE "notification_entity"`);
  }
}
