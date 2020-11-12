import { ITimedEntity } from '../runtime.repository';

export class UserModel extends ITimedEntity {
  constructor(public readonly id: string, public readonly name: string, public readonly avatar: string) {
    super();
    this.resolvedAt = new Date();
  }
}
