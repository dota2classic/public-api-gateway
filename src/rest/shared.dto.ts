import { Role } from "../gateway/shared-types/roles";
import { ApiProperty } from "@nestjs/swagger";
import { UploadedImageDto } from "./storage/storage.dto";
import { UserConnection } from "../gateway/shared-types/user-connection";

export class UserConnectionDto {
  connection: UserConnection;
  externalId: string;
}
export class UserDTO {
  steamId: string;
  avatar: string;
  avatarSmall: string;
  name: string;
  @ApiProperty({ enum: Role, enumName: "Role", isArray: true })
  roles: Role[];

  connections: UserConnectionDto[];

  hat?: UploadedImageDto;
}
