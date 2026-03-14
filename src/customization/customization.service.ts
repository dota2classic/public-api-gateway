import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import {
  UserProfileDecorationEntity,
  UserProfileDecorationType,
} from "../database/entities/user-profile-decoration.entity";
import { UserProfileDecorationPreferencesEntity } from "../database/entities/user-profile-decoration-preferences.entity";
import {
  CreateDecorationDto,
  SelectDecorationDto,
  UpdateDecorationDto,
} from "./customization.dto";

@Injectable()
export class CustomizationService {
  constructor(
    @InjectRepository(UserProfileDecorationEntity)
    private readonly decorationRepository: Repository<UserProfileDecorationEntity>,
    @InjectRepository(UserProfileDecorationPreferencesEntity)
    private readonly userDecorationPreferences: Repository<UserProfileDecorationPreferencesEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createDecoration(dto: CreateDecorationDto): Promise<UserProfileDecorationEntity> {
    return this.decorationRepository.save({
      title: dto.title,
      imageKey: dto.imageKey,
      decorationType: dto.type,
    });
  }

  async selectDecoration(steamId: string, dto: SelectDecorationDto): Promise<void> {
    let pref = await this.userDecorationPreferences.findOneBy({ steamId });
    if (!pref) {
      pref = await this.userDecorationPreferences.save({ steamId });
    }

    if (dto.id) {
      const decoration = await this.decorationRepository.findOneBy({ id: dto.id });
      if (decoration.decorationType !== dto.type) {
        throw new BadRequestException("Bad decoration id for type");
      }
    }

    const fieldMap: Partial<Record<UserProfileDecorationType, keyof UserProfileDecorationPreferencesEntity>> = {
      [UserProfileDecorationType.HAT]: "hatId",
      [UserProfileDecorationType.CHAT_ICON]: "iconId",
      [UserProfileDecorationType.TITLE]: "titleId",
      [UserProfileDecorationType.CHAT_ICON_ANIMATION]: "animationId",
    };

    const field = fieldMap[dto.type];
    if (field) {
      await this.userDecorationPreferences.update(
        { steamId: pref.steamId },
        { [field]: dto.id || null },
      );
    }
  }

  async updateDecoration(id: number, dto: UpdateDecorationDto): Promise<UserProfileDecorationEntity> {
    await this.decorationRepository
      .createQueryBuilder("d")
      .update(UserProfileDecorationEntity, {
        title: dto.title,
        imageKey: dto.imageKey,
        decorationType: dto.type,
      })
      .where({ id })
      .execute();

    return this.decorationRepository.findOneBy({ id });
  }

  async getDecoration(id: number): Promise<UserProfileDecorationEntity> {
    return this.decorationRepository.findOneBy({ id });
  }

  async deleteDecoration(id: number): Promise<void> {
    await this.dataSource.transaction(async (tx) => {
      const decoration = await tx.findOneOrFail<UserProfileDecorationEntity>(
        UserProfileDecorationEntity,
        { where: { id } },
      );

      const fieldMap: Partial<Record<UserProfileDecorationType, keyof UserProfileDecorationPreferencesEntity>> = {
        [UserProfileDecorationType.HAT]: "hatId",
        [UserProfileDecorationType.CHAT_ICON]: "iconId",
        [UserProfileDecorationType.TITLE]: "titleId",
        [UserProfileDecorationType.CHAT_ICON_ANIMATION]: "animationId",
      };

      const field = fieldMap[decoration.decorationType];
      if (field) {
        await tx.update(UserProfileDecorationPreferencesEntity, { [field]: id }, { [field]: null });
      }

      await tx.remove(decoration);
    });
  }

  async findAll(type?: UserProfileDecorationType): Promise<UserProfileDecorationEntity[]> {
    return this.decorationRepository.find({ where: { decorationType: type } });
  }
}
