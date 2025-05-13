import { Injectable } from "@nestjs/common";
import { UserProfileDecorationEntity } from "../../entity/user-profile-decoration.entity";
import { ProfileDecorationDto } from "./customization.dto";
import { StorageMapper } from "../storage/storage.mapper";

@Injectable()
export class CustomizationMapper {
  constructor(private readonly storageMapper: StorageMapper) {}

  public mapDecoration = (
    it: UserProfileDecorationEntity,
  ): ProfileDecorationDto => ({
    id: it.id,
    image: this.storageMapper.mapS3Item(it.imageKey),
    type: it.decorationType,
    title: it.title,
  });
}
