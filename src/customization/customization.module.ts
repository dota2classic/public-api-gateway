import { Module } from "@nestjs/common";
import { CustomizationController } from "./customization.controller";
import { CustomizationMapper } from "./customization.mapper";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProfileDecorationEntity } from "../database/entities/user-profile-decoration.entity";
import { UserProfileDecorationPreferencesEntity } from "../database/entities/user-profile-decoration-preferences.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserProfileDecorationEntity,
      UserProfileDecorationPreferencesEntity,
    ]),
  ],
  controllers: [CustomizationController],
  providers: [CustomizationMapper],
})
export class CustomizationModule {}
