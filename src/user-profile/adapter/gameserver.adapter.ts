import { Injectable } from "@nestjs/common";
import { PlayerApi } from "../../generated-api/gameserver";

@Injectable()
export class GameServerAdapter {
  constructor(private readonly playerApi: PlayerApi) {}
}
