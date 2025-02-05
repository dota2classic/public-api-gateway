import { Inject, Injectable } from "@nestjs/common";
import TelegramBot from "node-telegram-bot-api";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TelegramNotificationService {
  constructor(
    @Inject("Telegram") private readonly telegram: TelegramBot,
    private readonly config: ConfigService,
  ) {}

  public async notifyFeedback(text: string) {
    await this.telegram.sendMessage(
      this.config.get("telegram.notifyChatId"),
      text,
      {
        message_thread_id: this.config.get("telegram.notifyThreadId"),
      },
    );
  }
}
