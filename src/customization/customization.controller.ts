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
  UseInterceptors,
} from "@nestjs/common";
import { ReqLoggingInterceptor } from "../metrics/req-logging.interceptor";
import { UserProfileDecorationType } from "../database/entities/user-profile-decoration.entity";
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
} from "../utils/decorator/with-user";
import {
  CurrentUser,
  CurrentUserDto,
} from "../utils/decorator/current-user";
import { CustomizationService } from "./customization.service";

@UseInterceptors(ReqLoggingInterceptor)
@Controller("customization")
@ApiTags("customization")
export class CustomizationController {
  constructor(
    private readonly customizationService: CustomizationService,
    private readonly customizationMapper: CustomizationMapper,
  ) {}

  @AdminGuard()
  @WithUser()
  @Post()
  public async createDecoration(@Body() dto: CreateDecorationDto) {
    return this.customizationService
      .createDecoration(dto)
      .then(this.customizationMapper.mapDecoration);
  }

  @OldGuard()
  @WithUser()
  @Patch("selectDecoration")
  public async selectDecoration(
    @CurrentUser() user: CurrentUserDto,
    @Body() dto: SelectDecorationDto,
  ) {
    await this.customizationService.selectDecoration(user.steam_id, dto);
  }

  @AdminGuard()
  @WithUser()
  @Patch("/:id")
  public async updateDecoration(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateDecorationDto,
  ) {
    return this.customizationService
      .updateDecoration(id, dto)
      .then(this.customizationMapper.mapDecoration);
  }

  @AdminGuard()
  @WithUser()
  @Get("/:id")
  public async getDecoration(@Param("id", ParseIntPipe) id: number) {
    return this.customizationService
      .getDecoration(id)
      .then(this.customizationMapper.mapDecoration);
  }

  @AdminGuard()
  @WithUser()
  @Delete("/:id")
  public async deleteDecoration(@Param("id", ParseIntPipe) id: number) {
    await this.customizationService.deleteDecoration(id);
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
    const decorations = await this.customizationService.findAll(type);
    return decorations.map(this.customizationMapper.mapDecoration);
  }
}
