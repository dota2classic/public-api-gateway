import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerSmurfDetectedEvent } from "../../../gateway/events/bans/player-smurf-detected.event";
import { TelegramNotificationService } from "../telegram-notification.service";
import { UserRepository } from "../../../cache/user/user.repository";
import { BanReason } from "../../../gateway/shared-types/ban";
import { fullDate } from "../../../utils/format-date";

@EventsHandler(PlayerSmurfDetectedEvent)
export class PlayerSmurfDetectedHandler
  implements IEventHandler<PlayerSmurfDetectedEvent>
{
  constructor(
    private readonly telegramNotificationService: TelegramNotificationService,
    private readonly uRepo: UserRepository,
  ) {}

  private static mapUsername = (raw: string): string =>
    raw
      .replace(/\_/g, "\\_")
      .replace(/\*/g, "\\*")
      .replace(/\[/g, "\\[")
      .replace(/\]/g, "\\]")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .replace(/\~/g, "\\~")
      .replace(/\`/g, "\\`")
      .replace(/\>/g, "\\>")
      .replace(/\#/g, "\\#")
      .replace(/\+/g, "\\+")
      .replace(/\-/g, "\\-")
      .replace(/\=/g, "\\=")
      .replace(/\|/g, "\\|")
      .replace(/\{/g, "\\{")
      .replace(/\}/g, "\\}")
      .replace(/\./g, "\\.")
      .replace(/\!/g, "\\!");

  async handle(event: PlayerSmurfDetectedEvent) {
    const names = (
      await Promise.all(
        event.steamIds.map(
          async (it) =>
            `- [${await this.uRepo.name(it).then(PlayerSmurfDetectedHandler.mapUsername)}](https://dotaclassic.ru/players/${it})`,
        ),
      )
    ).join("\n");
    const bans = event.bans
      .filter((it) => it.isBanned)
      .map(
        (ban) =>
          `- ${BanReason[ban.status]} до ${fullDate(new Date(ban.bannedUntil))}`,
      )
      .join("\n");
    const text = `[ОБНАРУЖЕН СМУРФ]
Новый аккаунт: [${await this.uRepo.name(event.steamId).then(PlayerSmurfDetectedHandler.mapUsername)}](https://dotaclassic.ru/players/${event.steamId})
Аккаунты:
${names}
Баны:
${bans}
`;

    await this.telegramNotificationService.notifyMarkdown(text);
  }
}
