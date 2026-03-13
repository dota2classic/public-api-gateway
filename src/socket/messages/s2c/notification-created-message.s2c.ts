import { NotificationDto } from "../../../notification/notification.dto";

export class NotificationCreatedMessageS2C {
  constructor(public readonly notificationDto: NotificationDto) {}
}
