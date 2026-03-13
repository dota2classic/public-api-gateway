import { ItemDroppedEvent } from "../gateway/events/item-dropped.event";

export class ItemDroppedCommand {
  constructor(public readonly event: ItemDroppedEvent) {}
}
