import { Module } from "@nestjs/common";
import { StorageController } from "./storage.controller";
import { StorageService } from "./storage.service";
import { StorageMapper } from "./storage.mapper";
import { MatchArtifactUploadedHandler } from "./event-handler/match-artifact-uploaded.handler";
import { FeedbackModule } from "../feedback/feedback.module";
import { ReportModule } from "../report/report.module";

@Module({
  imports: [FeedbackModule, ReportModule],
  controllers: [StorageController],
  providers: [StorageService, StorageMapper, MatchArtifactUploadedHandler],
})
export class StorageModule {}
