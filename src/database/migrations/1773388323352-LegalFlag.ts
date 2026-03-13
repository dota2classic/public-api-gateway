import { MigrationInterface, QueryRunner } from "typeorm";

export class LegalFlag1773388323352 implements MigrationInterface {
    name = 'LegalFlag1773388323352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_flags" ADD "legal_remove" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_flags" DROP COLUMN "legal_remove"`);
    }

}
