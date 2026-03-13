import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ItemDropService } from "./item-drop.service";
import { ItemDroppedCommand } from "./item-dropped.command";

@CommandHandler(ItemDroppedCommand)
export class ItemDroppedHandler implements ICommandHandler<ItemDroppedCommand> {
  constructor(private readonly itemDropService: ItemDropService) {}

  async execute({ event }: ItemDroppedCommand) {
    await this.itemDropService.onItemDrop(event);
  }
}
