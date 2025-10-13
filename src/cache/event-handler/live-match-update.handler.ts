import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import {
  LiveMatchUpdateEvent,
  SlotInfo,
} from "../../gateway/events/gs/live-match-update.event";
import { LiveMatchService } from "../live-match.service";
import { MatchSlotInfo } from "../../rest/match/dto/match.dto";
import { UserProfileService } from "../../service/user-profile.service";

@EventsHandler(LiveMatchUpdateEvent)
export class LiveMatchUpdateHandler
  implements IEventHandler<LiveMatchUpdateEvent>
{
  constructor(
    private readonly ls: LiveMatchService,
    private readonly user: UserProfileService,
  ) {}

  async handle(event: LiveMatchUpdateEvent) {
    await this.ls.pushEvent({
      matchId: event.matchId,
      matchmakingMode: event.matchmaking_mode,
      gameMode: event.game_mode,
      duration: event.duration,
      gameState: event.game_state,
      server: event.server,
      towers: event.towers,
      barracks: event.barracks,
      timestamp: event.timestamp,
      heroes: await Promise.all(event.heroes.map(this.mapSlotInfo)),
    });
  }

  private mapSlotInfo = async (h: SlotInfo): Promise<MatchSlotInfo> => {
    return {
      user: await this.user.userDto(h.steam_id),
      team: h.team,
      connection: h.connection,
      heroData: h.hero_data && {
        hero: h.hero_data.hero,
        level: h.hero_data.level,

        bot: h.hero_data.bot,

        pos_x: h.hero_data.pos_x,
        pos_y: h.hero_data.pos_y,
        angle: h.hero_data.angle,

        mana: h.hero_data.mana,
        max_mana: h.hero_data.max_mana,
        health: h.hero_data.health,
        max_health: h.hero_data.max_health,

        item0: h.hero_data.item0,
        item1: h.hero_data.item1,
        item2: h.hero_data.item2,
        item3: h.hero_data.item3,
        item4: h.hero_data.item4,
        item5: h.hero_data.item5,

        kills: h.hero_data.kills,
        deaths: h.hero_data.deaths,
        assists: h.hero_data.assists,

        respawn_time: h.hero_data.respawn_time,
      },
    };
  };
}
