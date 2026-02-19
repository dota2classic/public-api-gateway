import { MigrationInterface, QueryRunner } from "typeorm";

export class LobbyFlags1771493911854 implements MigrationInterface {
    name = 'LobbyFlags1771493911854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lobby_entity" ADD "disable_runes" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "lobby_entity" ADD "mid_tower_to_win" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "lobby_entity" ADD "mid_tower_kills_to_win" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "notification_entity" ALTER COLUMN "ttl" SET DEFAULT '1day'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_entity" ALTER COLUMN "ttl" SET DEFAULT '1 day'`);
        await queryRunner.query(`ALTER TABLE "lobby_entity" DROP COLUMN "mid_tower_kills_to_win"`);
        await queryRunner.query(`ALTER TABLE "lobby_entity" DROP COLUMN "mid_tower_to_win"`);
        await queryRunner.query(`ALTER TABLE "lobby_entity" DROP COLUMN "disable_runes"`);
    }

}
