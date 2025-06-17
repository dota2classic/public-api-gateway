import { MigrationInterface, QueryRunner } from "typeorm";

export class Lobby1743751321220 implements MigrationInterface {
  name = "Lobby1743751321220";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`

CREATE TABLE public.lobby_entity (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    "gameMode" int4 DEFAULT 1 NOT NULL,
    owner_steam_id varchar NOT NULL,
    "map" varchar DEFAULT 'dota'::character varying NOT NULL,
    "name" text DEFAULT 'Лобби'::text NOT NULL,
    CONSTRAINT "PK_32247bff818222945f5587dfabf" PRIMARY KEY (id)
);
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "lobby_entity";`);
  }
}
