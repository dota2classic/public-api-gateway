import { Inject, Injectable, Logger } from "@nestjs/common";
import TelegramBot from "node-telegram-bot-api";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TelegramNotificationService {
  private logger = new Logger(TelegramNotificationService.name);
  constructor(
    @Inject("Telegram") private readonly telegram: TelegramBot,
    private readonly config: ConfigService,
  ) {}

  public async notifyFeedback(text: string) {
    try {
      await this.telegram.sendMessage(
        this.config.get("telegram.notifyChatId"),
        text,
        {
          message_thread_id: this.config.get("telegram.notifyThreadId"),
        },
      );
    } catch (e) {
      this.logger.error(`Error sending to telegram ${text} ${e}`);
    }
  }

  public async notifyMarkdown(text: string) {
    try {
      await this.telegram.sendMessage(
        this.config.get("telegram.notifyChatId"),
        text,
        {
          message_thread_id: this.config.get("telegram.notifyThreadId"),
          parse_mode: "Markdown",
        },
      );
    } catch (e) {
      this.logger.error(`Error sending to telegram ${text} ${e}`);
    }
  }
}
