import { ApiQuery, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  UserProfileDecorationEntity,
  UserProfileDecorationType,
} from "../../entity/user-profile-decoration.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { UserProfileDecorationPreferencesEntity } from "../../entity/user-profile-decoration-preferences.entity";
import {
  CreateDecorationDto,
  ProfileDecorationDto,
  SelectDecorationDto,
  UpdateDecorationDto,
} from "./customization.dto";
import { CustomizationMapper } from "./customization.mapper";
import {
  AdminGuard,
  OldGuard,
  WithUser,
} from "../../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../../utils/decorator/current-user";

@Controller("customization")
@ApiTags("customization")
export class CustomizationController {
  constructor(
    @InjectRepository(UserProfileDecorationEntity)
    private readonly decorationRepository: Repository<UserProfileDecorationEntity>,
    @InjectRepository(UserProfileDecorationPreferencesEntity)
    private readonly userDecorationPreferences: Repository<UserProfileDecorationPreferencesEntity>,
    private readonly customizationMapper: CustomizationMapper,
    private readonly dataSource: DataSource,
  ) {}

  @AdminGuard()
  @WithUser()
  @Post()
  public async createDecoration(@Body() dto: CreateDecorationDto) {
    return this.decorationRepository
      .save({
        title: dto.title,
        imageKey: dto.imageKey,
        decorationType: dto.type,
      })
      .then(this.customizationMapper.mapDecoration);
  }

  @OldGuard()
  @WithUser()
  @Patch("selectDecoration")
  public async selectDecoration(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: SelectDecorationDto,
  ) {
    let pref = await this.userDecorationPreferences.findOneBy({
      steamId: user.steam_id,
    });
    if (!pref) {
      pref = await this.userDecorationPreferences.save({
        steamId: user.steam_id,
      });
    }

    const decoration = await this.decorationRepository.findOneBy({
      id: dto.id,
    });

    if (dto.id && decoration.decorationType !== dto.type) {
      throw "Bad decoration id for type";
    }

    if (dto.type === UserProfileDecorationType.HAT) {
      await this.userDecorationPreferences.update(
        { steamId: pref.steamId },
        { hatId: dto.id || null },
      );
    } else if (dto.type === UserProfileDecorationType.CHAT_ICON) {
      await this.userDecorationPreferences.update(
        { steamId: pref.steamId },
        { iconId: dto.id || null },
      );
    } else if (dto.type === UserProfileDecorationType.TITLE) {
      await this.userDecorationPreferences.update(
        { steamId: pref.steamId },
        { titleId: dto.id || null },
      );
    } else if (dto.type === UserProfileDecorationType.CHAT_ICON_ANIMATION) {
      await this.userDecorationPreferences.update(
        { steamId: pref.steamId },
        { animationId: dto.id || null },
      );
    }
  }

  @AdminGuard()
  @WithUser()
  @Patch("/:id")
  public async updateDecoration(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateDecorationDto,
  ) {
    await this.decorationRepository
      .createQueryBuilder("d")
      .update(UserProfileDecorationEntity, {
        title: dto.title,
        imageKey: dto.imageKey,
        decorationType: dto.type,
      })
      .where({ id })
      .execute();

    return this.decorationRepository
      .findOneBy({ id })
      .then(this.customizationMapper.mapDecoration);
  }

  @AdminGuard()
  @WithUser()
  @Get("/:id")
  public async getDecoration(@Param("id", ParseIntPipe) id: number) {
    return this.decorationRepository
      .findOneBy({ id })
      .then(this.customizationMapper.mapDecoration);
  }

  @AdminGuard()
  @WithUser()
  @Delete("/:id")
  public async deleteDecoration(@Param("id", ParseIntPipe) id: number) {
    await this.dataSource.transaction(async (tx) => {
      // Find decoration
      const decoration = await tx.findOneOrFail<UserProfileDecorationEntity>(
        UserProfileDecorationEntity,
        { where: { id } },
      );
      // Clear chosen
      let criteria: Partial<UserProfileDecorationPreferencesEntity>;
      if (decoration.decorationType === UserProfileDecorationType.HAT) {
        criteria = { hatId: id };
      } else if (
        decoration.decorationType === UserProfileDecorationType.CHAT_ICON
      ) {
        criteria = { iconId: id };
      } else if (
        decoration.decorationType === UserProfileDecorationType.TITLE
      ) {
        criteria = { titleId: id };
      } else if (
        decoration.decorationType ===
        UserProfileDecorationType.CHAT_ICON_ANIMATION
      ) {
        criteria = { animationId: id };
      }

      const update = {
        ...criteria,
        [Object.keys(criteria)[0]]: null,
      };

      await tx.update(UserProfileDecorationPreferencesEntity, criteria, update);

      // Delete

      await tx.remove(decoration);
    });
  }

  @ApiQuery({
    name: "type",
    enum: UserProfileDecorationType,
    enumName: "UserProfileDecorationType",
    required: false,
  })
  @Get()
  public async all(
    @Query("type") type: UserProfileDecorationType,
  ): Promise<ProfileDecorationDto[]> {
    const decorations = await this.decorationRepository.find({
      where: { decorationType: type },
    });

    return decorations.map(this.customizationMapper.mapDecoration);
  }
}
