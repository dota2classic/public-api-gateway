import { PlayerId } from "../../gateway/shared-types/player-id";
import { UserConnection } from "../../gateway/shared-types/user-connection";
import { ITimedEntity } from "../runtime.repository";

export class UserConnectionModel extends ITimedEntity {
  constructor(
    public readonly id: string,
    public readonly connection: UserConnection,
    public readonly externalId: string,
  ) {
    super();
  }
}
