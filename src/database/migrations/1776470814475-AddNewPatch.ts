import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewPatch1776470814475 implements MigrationInterface {
    name = 'AddNewPatch1776470814475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_entity" ALTER COLUMN "ttl" SET DEFAULT '1day'`);
        await queryRunner.query(`ALTER TYPE "public"."lobby_entity_patch_enum" RENAME TO "lobby_entity_patch_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."lobby_entity_patch_enum" AS ENUM('DOTA_684', 'DOTA_684_TURBO', 'DOTA_688')`);
        await queryRunner.query(`ALTER TABLE "lobby_entity" ALTER COLUMN "patch" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "lobby_entity" ALTER COLUMN "patch" TYPE "public"."lobby_entity_patch_enum" USING "patch"::"text"::"public"."lobby_entity_patch_enum"`);
        await queryRunner.query(`ALTER TABLE "lobby_entity" ALTER COLUMN "patch" SET DEFAULT 'DOTA_684'`);
        await queryRunner.query(`DROP TYPE "public"."lobby_entity_patch_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."lobby_entity_patch_enum_old" AS ENUM('DOTA_684', 'DOTA_684_TURBO')`);
        await queryRunner.query(`ALTER TABLE "lobby_entity" ALTER COLUMN "patch" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "lobby_entity" ALTER COLUMN "patch" TYPE "public"."lobby_entity_patch_enum_old" USING "patch"::"text"::"public"."lobby_entity_patch_enum_old"`);
        await queryRunner.query(`ALTER TABLE "lobby_entity" ALTER COLUMN "patch" SET DEFAULT 'DOTA_684'`);
        await queryRunner.query(`DROP TYPE "public"."lobby_entity_patch_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."lobby_entity_patch_enum_old" RENAME TO "lobby_entity_patch_enum"`);
        await queryRunner.query(`ALTER TABLE "notification_entity" ALTER COLUMN "ttl" SET DEFAULT '1 day'`);
    }

}
