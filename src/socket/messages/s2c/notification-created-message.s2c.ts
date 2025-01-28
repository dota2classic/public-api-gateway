import { NotificationDto } from "../../../rest/notification/notification.dto";

export class NotificationCreatedMessageS2C {
  constructor(public readonly notificationDto: NotificationDto) {}
}
