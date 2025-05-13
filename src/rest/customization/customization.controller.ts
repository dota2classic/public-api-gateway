import { ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import {
  UserProfileDecorationEntity,
  UserProfileDecorationType,
} from "../../entity/user-profile-decoration.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProfileDecorationPreferencesEntity } from "../../entity/user-profile-decoration-preferences.entity";
import {
  CreateDecorationDto,
  ProfileDecorationDto,
  SelectDecorationDto,
  UpdateDecorationDto,
} from "./customization.dto";
import { CustomizationMapper } from "./customization.mapper";
import {
  ModeratorGuard,
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
  ) {}

  @ModeratorGuard()
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
    }
  }

  @ModeratorGuard()
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

  @Get()
  public async all(): Promise<ProfileDecorationDto[]> {
    const decorations = await this.decorationRepository.find();
    return decorations.map(this.customizationMapper.mapDecoration);
  }
}
