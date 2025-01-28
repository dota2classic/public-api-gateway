import { NotificationDto } from "../notification.dto";

export class NotificationCreatedEvent {
  constructor(public readonly notification: NotificationDto) {}
}
