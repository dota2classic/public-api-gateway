import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PlayerRuleBrokenEvent } from "../../../gateway/events/bans/player-rule-broken.event";
import { ReportService } from "../report.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { RuleEntity } from "../../../entity/rule.entity";
import { RulePunishmentEntity } from "../../../entity/rule-punishment.entity";

@EventsHandler(PlayerRuleBrokenEvent)
export class PlayerRuleBrokenHandler
  implements IEventHandler<PlayerRuleBrokenEvent>
{
  constructor(
    private readonly reportService: ReportService,
    @InjectRepository(RuleEntity)
    private readonly ruleEntityRepository: Repository<RuleEntity>,
    @InjectRepository(RulePunishmentEntity)
    private readonly rulePunishmentEntityRepository: Repository<RulePunishmentEntity>,
  ) {}

  async handle(event: PlayerRuleBrokenEvent) {
    const punishment = event.overridePunishmentId
      ? await this.rulePunishmentEntityRepository.findOne({
          where: { id: event.overridePunishmentId },
        })
      : await this.ruleEntityRepository
          .findOne({
            where: { id: event.ruleId },
            relations: ["punishment"],
          })
          .then((it) => it.punishment);

    await this.reportService.createLog(
      event.steamId,
      event.executorSteamId,
      event.ruleId,
      punishment.durationHours * 60 * 60,
      punishment.id,
    );
  }
}
