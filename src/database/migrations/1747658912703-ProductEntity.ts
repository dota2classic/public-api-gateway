import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductEntity1747658912703 implements MigrationInterface {
  name = "ProductEntity1747658912703";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "subscription_product" ("id" SERIAL NOT NULL, "months" integer NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_7fe49a45c06703b6cb93244817f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_payment" ADD "product_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_payment" ADD CONSTRAINT "FK_826da897ea856698fdfdba066d6" FOREIGN KEY ("product_id") REFERENCES "subscription_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_payment" DROP CONSTRAINT "FK_826da897ea856698fdfdba066d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_payment" DROP COLUMN "product_id"`,
    );
    await queryRunner.query(`DROP TABLE "subscription_product"`);
  }
}
