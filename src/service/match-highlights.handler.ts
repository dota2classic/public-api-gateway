import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { MatchHighlightsEvent } from "../gateway/events/match-highlights.event";
import { TelegramNotificationService } from "../rest/notification/telegram-notification.service";
import { formatDuration } from "../utils/format-duration";

@EventsHandler(MatchHighlightsEvent)
export class MatchHighlightsHandler
  implements IEventHandler<MatchHighlightsEvent>
{
  constructor(private readonly telegram: TelegramNotificationService) {}

  async handle(event: MatchHighlightsEvent) {
    if (event.highlights.length == 0) return;

    const highlights = event.highlights
      .sort((a, b) => a.gameTime - b.gameTime)
      .map((h) => {
        return `<b>[${formatDuration(h.gameTime)}]</b> ${this.formatHeroName(h.hero)}: ${h.comment}`;
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
}
