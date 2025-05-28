import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { ReqLoggingInterceptor } from "../../middleware/req-logging.interceptor";
import { ApiTags } from "@nestjs/swagger";
import {
  CreateRuleDto,
  PrettyRuleDto,
  RuleDeleteResultDto,
  RuleDto,
  RulePunishmentDto,
  UpdatePunishmentDto,
  UpdateRuleDto,
  UpdateRuleIndicesDto,
} from "./rule.dto";
import { RuleEntity } from "../../entity/rule.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { RuleMapper } from "./rule.mapper";
import { RuleService } from "./rule.service";
import { ModeratorGuard, WithUser } from "../../utils/decorator/with-user";
import { RulePunishmentEntity } from "../../entity/rule-punishment.entity";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("rules")
@ApiTags("rules")
export class RuleController {
  constructor(
    @InjectRepository(RuleEntity)
    private readonly ruleEntityRepository: Repository<RuleEntity>,
    @InjectRepository(RulePunishmentEntity)
    private readonly rulePunishmentRepository: Repository<RulePunishmentEntity>,
    private readonly mapper: RuleMapper,
    private readonly ruleService: RuleService,
  ) {}

  @ModeratorGuard()
  @WithUser()
  @Post("/indices")
  public async updateIndices(
    @Body() dto: UpdateRuleIndicesDto,
  ): Promise<RuleDto[]> {
    await Promise.all(
      dto.updates.map((d) =>
        this.ruleEntityRepository.update(
          { id: d.ruleId },
          { index: d.index, parentId: d.parent },
        ),
      ),
    );
    return this.getAllRules();
  }

  // Rule
  @Get("/rule/:id")
  public async getRule(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<RuleDto> {
    return this.ruleEntityRepository
      .findOneBy({ id })
      .then(this.mapper.mapRule);
  }

  @ModeratorGuard()
  @WithUser()
  @Delete("/rule/:id")
  public async deleteRule(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<RuleDeleteResultDto> {
    return this.ruleService.tryDeleteRule(id);
  }

  @ModeratorGuard()
  @WithUser()
  @Patch("/rule/:id")
  public async updateRule(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateRuleDto,
  ): Promise<RuleDto> {
    await this.ruleEntityRepository.update(
      { id },
      {
        index: dto.index,
        title: dto.title,
        description: dto.description,
        parentId: dto.parent,
        punishmentId: dto.punishmentId,
      },
    );
    return this.ruleEntityRepository
      .findOne({ where: { id } })
      .then(this.mapper.mapRule);
  }

  @ModeratorGuard()
  @WithUser()
  @Post("/rule")
  public async createRule(@Body() dto: CreateRuleDto): Promise<RuleDto> {
    const index = await this.ruleEntityRepository.count({
      where: { parentId: dto.parent || IsNull() },
    });
    return this.ruleEntityRepository
      .save({
        index: index,
        parentId: dto.parent,
      })
      .then(this.mapper.mapRule);
  }

  @ModeratorGuard()
  @WithUser()
  @Post("/punishment")
  public async createPunishment(): Promise<RulePunishmentDto> {
    return this.rulePunishmentRepository
      .save({
        title: "Наказание",
        durationHours: 24,
      })
      .then(this.mapper.mapPunishment);
  }

  @Get("/punishment/:id")
  public async getPunishment(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<RulePunishmentDto> {
    return this.rulePunishmentRepository
      .findOneBy({ id })
      .then(this.mapper.mapPunishment);
  }

  @ModeratorGuard()
  @WithUser()
  @Delete("/punishment/:id")
  public async deletePunishment(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<RuleDeleteResultDto> {
    return this.ruleService.tryDeletePunishment(id);
  }

  @ModeratorGuard()
  @WithUser()
  @Patch("/punishment/:id")
  public async updatePunishment(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePunishmentDto,
  ): Promise<RulePunishmentDto> {
    await this.rulePunishmentRepository.update(
      { id },
      {
        title: dto.title,
        durationHours: dto.durationHours,
      },
    );
    return this.rulePunishmentRepository
      .findOne({ where: { id } })
      .then(this.mapper.mapPunishment);
  }

  @Get("/punishment")
  public async getAllPunishments(): Promise<RulePunishmentDto[]> {
    const allRules = await this.rulePunishmentRepository.find();
    return allRules.map(this.mapper.mapPunishment);
  }

  @Get("/rule")
  public async getAllRules(): Promise<RuleDto[]> {
    const allRules = await this.ruleService.getRules();
    return allRules.map(this.mapper.mapRule);
  }

  @Get("/reportable")
  public async getPrettyRules(): Promise<PrettyRuleDto[]> {
    return this.ruleService.getReportableRules();
  }
}
