import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ForumController } from "./forum.controller";
import { ForumMapper } from "./forum.mapper";
import { BlogpostEntity } from "../database/entities/blogpost.entity";
import { FeedbackModule } from "../feedback/feedback.module";

@Module({
  imports: [TypeOrmModule.forFeature([BlogpostEntity]), FeedbackModule],
  controllers: [ForumController],
  providers: [ForumMapper],
  exports: [ForumMapper],
})
export class ForumModule {}
