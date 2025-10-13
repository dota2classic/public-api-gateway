import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { MatchHighlightsEvent } from "../gateway/events/match-highlights.event";
import { TelegramNotificationService } from "../rest/notification/telegram-notification.service";
import { formatDuration } from "../utils/format-duration";
import { DemoHighlightsEntity } from "../entity/demo-highlights.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@EventsHandler(MatchHighlightsEvent)
export class MatchHighlightsHandler
  implements IEventHandler<MatchHighlightsEvent>
{
  constructor(
    private readonly telegram: TelegramNotificationService,
    @InjectRepository(DemoHighlightsEntity)
    private readonly demoHighlightsEntityRepository: Repository<DemoHighlightsEntity>,
  ) {}

  async handle(event: MatchHighlightsEvent) {
    if (event.highlights.length == 0) return;

    await this.saveHighlights(event);

    const highlights = event.highlights
      .sort((a, b) => a.start.time - b.start.time)
      .map((h) => {
        return `<b>[${formatDuration(h.start.time)}]</b> ${this.formatHeroName(h.hero)}: ${h.comment}`;
      })
      .join("\n");
    const text = `[ХАЙЛАЙТЫ]
<a href="https://dotaclassic.ru/matches/${event.matchId}">Матч ${event.matchId}</a>
${highlights}

`;
    await this.telegram.notifyHtml(text);
  }

  private formatHeroName(name: string) {
    return name.replace("npc_dota_hero_", "");
  }

  private async saveHighlights(event: MatchHighlightsEvent) {
    await this.demoHighlightsEntityRepository.save({
      matchId: event.matchId,
      highlights: event,
    });
  }
}
