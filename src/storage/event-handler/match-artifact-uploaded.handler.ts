import { Logger } from "@nestjs/common";
import { InjectS3, S3 } from "nestjs-s3";
import { MatchArtifactType } from "../../gateway/shared-types/match-artifact-type";
import { parseLogFile } from "../../utils/parseLogFile";
import { AiService } from "../../service/ai.service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MatchArtifactUploadedCommand } from "./match-artifact-uploaded.command";

export interface PlayerChatModerationResult {
  steamId: string;
  messageTemperature: number;
  reasoning: string;
}

@CommandHandler(MatchArtifactUploadedCommand)
export class MatchArtifactUploadedHandler
  implements ICommandHandler<MatchArtifactUploadedCommand>
{
  private readonly logger = new Logger(MatchArtifactUploadedHandler.name);

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly feedbackAssistant: AiService,
  ) {}

  async execute({ event }: MatchArtifactUploadedCommand): Promise<PlayerChatModerationResult[]> {
    if (event.artifactType !== MatchArtifactType.LOG) return [];

    const object = await this.s3.getObject({
      Bucket: event.bucket,
      Key: event.key,
    });
    const txt = await object.Body.transformToString();
    const messages = parseLogFile(txt);

    if (messages.length === 0) return [];

    const chatLog = messages
      .map((m) => `[${m.steamId}]: ${m.message}`)
      .join("\n");

    const results = await this.feedbackAssistant.getChatModerationResult(chatLog);

    this.logger.log(
      `Chat moderation for match ${event.matchId}: ${JSON.stringify(results)}`,
    );

    results.filter(t => t.messageTemperature >= 6).forEach(t => {
      this.logger.warn(`Match ${event.matchId}: player ${t.steamId} has high toxicity: ${t.messageTemperature} (${t.reasoning})`);
    });

    return results;
  }
}
