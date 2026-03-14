import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogpostEntity } from "../database/entities/blogpost.entity";
import { BlogpostController } from "./blogpost.controller";
import { BlogpostMapper } from "./blogpost.mapper";

@Module({
  imports: [TypeOrmModule.forFeature([BlogpostEntity])],
  controllers: [BlogpostController],
  providers: [BlogpostMapper],
})
export class BlogpostModule {}
