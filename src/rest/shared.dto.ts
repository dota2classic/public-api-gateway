import { Role } from "../gateway/shared-types/roles";
import { ApiProperty } from "@nestjs/swagger";
import { UploadedImageDto } from "./storage/storage.dto";

export class UserDTO {
  steamId: string;
  avatar: string;
  avatarSmall: string;
  name: string;
  @ApiProperty({ enum: Role, enumName: "Role", isArray: true })
  roles: Role[];

  hat?: UploadedImageDto;
}
