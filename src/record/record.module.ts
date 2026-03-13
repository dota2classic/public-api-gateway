import { Module } from "@nestjs/common";
import { RecordController } from "./record.controller";
import { RecordMapper } from "./record.mapper";
import { MatchMapper } from "../match/match.mapper";

@Module({
  controllers: [RecordController],
  providers: [RecordMapper, MatchMapper],
})
export class RecordModule {}
