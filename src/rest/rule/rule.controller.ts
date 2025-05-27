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
  RuleDeleteResultDto,
  RuleDto,
  UpdateRuleDto,
  UpdateRuleIndicesDto,
} from "./rule.dto";
import { RuleEntity } from "../../entity/rule.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { RuleMapper } from "./rule.mapper";
import { RuleService } from "./rule.service";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("rules")
@ApiTags("rules")
export class RuleController {
  constructor(
    @InjectRepository(RuleEntity)
    private readonly ruleEntityRepository: Repository<RuleEntity>,
    private readonly mapper: RuleMapper,
    private readonly ruleService: RuleService,
  ) {}

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

  @Get("/rule/:id")
  public async getRule(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<RuleDto> {
    return this.ruleEntityRepository
      .findOneBy({ id })
      .then(this.mapper.mapRule);
  }

  @Delete("/rule/:id")
  public async deleteRule(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<RuleDeleteResultDto> {
    return this.ruleService.tryDeleteRule(id);
  }

  @Patch("/rule/:id")
  public async updateRule(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateRuleDto,
  ): Promise<RuleDto> {
    await this.ruleEntityRepository.update(
      { id },
      {
        index: dto.index,
        description: dto.description,
        parentId: dto.parent,
      },
    );
    return this.ruleEntityRepository
      .findOne({ where: { id } })
      .then(this.mapper.mapRule);
  }

  @Post()
  public async createRule(@Body() dto: CreateRuleDto): Promise<RuleDto> {
    const index = await this.ruleEntityRepository.count({
      where: { parentId: dto.parent || IsNull() },
    });
    return this.ruleEntityRepository
      .save({
        index: index,
        description: "Правило",
        parentId: dto.parent,
      })
      .then(this.mapper.mapRule);
  }

  @Get()
  public async getAllRules(): Promise<RuleDto[]> {
    const allRules = await this.ruleService.getRules();
    return allRules.map(this.mapper.mapRule);
  }
}
