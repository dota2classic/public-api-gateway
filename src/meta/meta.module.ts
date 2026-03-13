import { Module } from "@nestjs/common";
import { MetaController } from "./meta.controller";
import { MetaMapper } from "./meta.mapper";

@Module({
  controllers: [MetaController],
  providers: [MetaMapper],
})
export class MetaModule {}
