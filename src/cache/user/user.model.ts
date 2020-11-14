import { ITimedEntity } from '../runtime.repository';
import { Role } from '../../gateway/shared-types/roles';

export class UserModel extends ITimedEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly avatar: string,
    public readonly roles: Role[]
  ) {
    super();
    this.resolvedAt = new Date();
  }
}
