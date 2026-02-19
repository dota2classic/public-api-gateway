import { MigrationInterface, QueryRunner } from "typeorm";

export class BanSTageFlag1771499157135 implements MigrationInterface {
    name = 'BanSTageFlag1771499157135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lobby_entity" ADD "enable_ban_stage" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lobby_entity" DROP COLUMN "enable_ban_stage"`);
    }

}
