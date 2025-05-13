import { UserProfileDecorationType } from "../../entity/user-profile-decoration.entity";
import { UploadedImageDto } from "../storage/storage.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ProfileDecorationDto {
  id: number;
  @ApiProperty({
    enum: UserProfileDecorationType,
    enumName: "UserProfileDecorationType",
  })
  type: UserProfileDecorationType;
  image: UploadedImageDto;
  title: string;
}

export class CreateDecorationDto {
  @ApiProperty({
    enum: UserProfileDecorationType,
    enumName: "UserProfileDecorationType",
  })
  type: UserProfileDecorationType;
  imageKey: string;
  title: string;
}

export class UpdateDecorationDto {
  @ApiProperty({
    enum: UserProfileDecorationType,
    enumName: "UserProfileDecorationType",
  })
  type?: UserProfileDecorationType;
  imageKey?: string;
  title?: string;
}

export class SelectDecorationDto {
  @ApiProperty({
    enum: UserProfileDecorationType,
    enumName: "UserProfileDecorationType",
  })
  type: UserProfileDecorationType;
  id?: number;
}
