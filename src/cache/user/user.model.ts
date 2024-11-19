import { ITimedEntity } from "../runtime.repository";
import { Role } from "../../gateway/shared-types/roles";
import { PlayerPreviewDto } from "../../rest/player/dto/player.dto";

export class UserModel extends ITimedEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly avatar: string,
    public readonly roles: Role[],
  ) {
    super();
    this.resolvedAt = new Date();
  }

  asPreview(): PlayerPreviewDto {
    return {
      name: this.name,
      id: this.id,
      avatar: this.avatar,
    };
  }
}
