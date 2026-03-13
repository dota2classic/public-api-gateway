import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ForumController } from "./forum.controller";
import { ForumMapper } from "./forum.mapper";
import { LiveMatchService } from "../cache/live-match.service";
import { BlogpostEntity } from "../entity/blogpost.entity";
import { FeedbackModule } from "../feedback/feedback.module";

@Module({
  imports: [TypeOrmModule.forFeature([BlogpostEntity]), FeedbackModule],
  controllers: [ForumController],
  providers: [ForumMapper, LiveMatchService],
  exports: [ForumMapper, LiveMatchService],
})
export class ForumModule {}
