import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerSmurfDetectedEvent } from "../../../gateway/events/bans/player-smurf-detected.event";
import { TelegramNotificationService } from "../telegram-notification.service";
import { BanReason } from "../../../gateway/shared-types/ban";
import { fullDate } from "../../../utils/format-date";
import { UserProfileService } from "../../../user-profile/service/user-profile.service";
import { PlayerFlagsEntity } from "../../../entity/player-flags.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Logger } from "@nestjs/common";

@EventsHandler(PlayerSmurfDetectedEvent)
export class PlayerSmurfDetectedHandler
  implements IEventHandler<PlayerSmurfDetectedEvent>
{
  private logger = new Logger(PlayerSmurfDetectedHandler.name);

  constructor(
    private readonly telegramNotificationService: TelegramNotificationService,
    private readonly uRepo: UserProfileService,
    @InjectRepository(PlayerFlagsEntity)
    private readonly playerFlagsEntityRepository: Repository<PlayerFlagsEntity>,
  ) {}

  async handle(event: PlayerSmurfDetectedEvent) {
    if (!(await this.shouldHandle(event.steamId))) {
      this.logger.log(
        `Skipping smurf detection for steam id ${event.steamId} cause flag`,
      );
      return;
    }
    const names = (
      await Promise.all(
        event.steamIds.map(
          async (it) =>
            `- <a href="https://dotaclassic.ru/players/${it}">${await this.uRepo.name(it)}</a>`,
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
Новый аккаунт: <a href="https://dotaclassic.ru/players/${event.steamId}">${await this.uRepo.name(event.steamId)}</a>
Аккаунты:
${names}
Баны:
${bans}
`;

    await this.telegramNotificationService.notifyHtml(text);
  }

  private async shouldHandle(steamId: string): Promise<boolean> {
    const flags = await this.playerFlagsEntityRepository.findOne({
      where: { steamId },
    });

    return !flags || !flags.ignoreSmurf;
  }
}
