import { MigrationInterface, QueryRunner } from "typeorm";

export class ChatModerationReportMapping1773847501463 implements MigrationInterface {
    name = 'ChatModerationReportMapping1773847501463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "toxicity_punishment_mapping" ("id" SERIAL NOT NULL, "min_score" integer NOT NULL, "punishment_id" integer, "rule_id" integer NOT NULL, CONSTRAINT "UQ_2b0d6a0b688705b5c7a7b80d584" UNIQUE ("min_score"), CONSTRAINT "PK_183bc3db8eb1d9402958b960134" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "toxicity_punishment_mapping" ADD CONSTRAINT "FK_1ec7db3728189678fd8a0eec312" FOREIGN KEY ("punishment_id") REFERENCES "rule_punishment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toxicity_punishment_mapping" ADD CONSTRAINT "FK_3b8de8d3c33b51c035c7a5974b3" FOREIGN KEY ("rule_id") REFERENCES "rule_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toxicity_punishment_mapping" DROP CONSTRAINT "FK_3b8de8d3c33b51c035c7a5974b3"`);
        await queryRunner.query(`ALTER TABLE "toxicity_punishment_mapping" DROP CONSTRAINT "FK_1ec7db3728189678fd8a0eec312"`);
        await queryRunner.query(`DROP TABLE "toxicity_punishment_mapping"`);
    }

}
