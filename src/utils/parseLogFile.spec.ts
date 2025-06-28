import { parseLogFile, parseLogLine } from "./parseLogFile";
import { DotaTeam } from "../gateway/shared-types/dota-team";

describe("parseLogFile", () => {
  const log = `---- Host_NewGame ----
Unknown command "plugin_load"
Missing map material: TOOLS/TOOLSSKYBOX
Missing map material: BLENDS/RIVER001
Missing map material: BLENDS/RIVER002
Missing map material: DEV/MAP_EDGE_RADIANT
Missing map material: BLENDS/ROCKWALLS_RADIANT_DRY
Missing map material: BLENDS/STONE_PATH012
Missing map material: BLENDS/GOODBAD_PATH001
Missing map material: BLENDS/PINE_BASE001
Missing map material: BLENDS/ROCKWALLS_RADIANT
Missing map material: BLENDS/MID_BOTTOM_RADIANT001
Missing map material: BLENDS/STONE_PATH001_HORIZONTAL
Missing map material: BLENDS/STONE_PATH001_VERTICAL
Missing map material: BLENDS/STONE_PATH001
Missing map material: BLENDS/ROCKWALLS_RADIANT
Missing map material: DEV/BLACK
Missing map material: EFFECTS/RADIANT_BACKLIGHTING
Missing map material: TOOLS/TOOLSNODRAW
Missing map material: DEV/MAP_EDGE_RADIANT
Missing map material: BLENDS/RIVER001
Missing map material: WATER/WATER_DOTA
Missing map material: TOOLS/TOOLSSKIP
Missing map material: TOOLS/TOOLSCLIP
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: TOOLS/TOOLSTRIGGER
Missing map material: DEV/MAP_EDGE_DIRE
Missing map material: BLENDS/STONE_PATH003
Missing map material: BLENDS/STONE_PATH009
Missing map material: BLENDS/STONE_PATH010
Missing map material: BLENDS/STONE_PATH008
Missing map material: BLENDS/GOODBAD_PATH002
Missing map material: BLENDS/DIRE_BASE
Missing map material: BLENDS/STONE_PATH011
Missing map material: BLENDS/DIRE_LAVA
Missing map material: BLENDS/DIRE_LAVA
Missing map material: DEV/BLACK
Missing map material: BLENDS/DIRE_LAVA
Missing map material: overlays/camp_fire_pit001
Missing map material: overlays/good_base_stone001
Missing map material: overlays/wagon_path003a
Missing map material: overlays/wagon_path003b
Missing map material: overlays/path_border001
Missing map material: overlays/path_border002
Missing map material: overlays/blood001
Missing map material: overlays/blood002
Missing map material: overlays/path_border004b
Missing map material: overlays/leaves_white000
Missing map material: overlays/petals_pink000
Missing map material: overlays/wagon_path001b
Missing map material: overlays/camp_marking002
Missing map material: overlays/petals_blueyellow000
Missing map material: overlays/bad_stone_inlay001
Missing map material: overlays/drift_sand001
Missing map material: overlays/wagon_path001
Missing map material: overlays/path_border004
Missing map material: overlays/path_border003
Missing map material: overlays/path_border003b
Missing map material: overlays/camp_marking003
Missing map material: overlays/stone_stain001
Missing map material: overlays/bad_base_stone001
Missing map material: overlays/bad_puddle_lava_00
Missing map material: overlays/petals_redblossom_00
MDLCache: Failed load of .VVD data for props_garden/good_stonewall001.mdl
MDLCache: Failed load of .VVD data for props_garden/good_stonewall002.mdl
MDLCache: Failed load of .VVD data for props_garden/good_stonewall003.mdl
MDLCache: Failed load of .VVD data for props_garden/good_stonewall004.mdl
MDLCache: Failed load of .VVD data for props_garden/good_stonewall005.mdl
MDLCache: Failed load of .VVD data for props_garden/good_stonewall006.mdl
MDLCache: Failed load of .VVD data for props_debris/creep_camp001n.mdl
MDLCache: Failed load of .VVD data for props_debris/creep_camp001i.mdl
MDLCache: Failed load of .VVD data for props_debris/creep_camp002a.mdl
MDLCache: Failed load of .VVD data for props_debris/camp_fire002.mdl
MDLCache: Failed load of .VVD data for props_garden/good_stonewall008.mdl
MDLCache: Failed load of .VVD data for props_rock/riveredge_rocks_small001.mdl
MDLCache: Failed load of .VVD data for props_structures/Vines_wall001.mdl
MDLCache: Failed load of .VVD data for props_rock/riveredge_rocks_small002.mdl
MDLCache: Failed load of .VVD data for effects/fountain_radiant_00.mdl
MDLCache: Failed load of .VVD data for props_rock/riveredge_rock009a.mdl
MDLCache: Failed load of .VVD data for props_structures/Good_Shop001.mdl
MDLCache: Failed load of .VVD data for props_structures/good_base_wall006.mdl
MDLCache: Failed load of .VVD data for props_structures/good_base_wall005.mdl
MDLCache: Failed load of .VVD data for props_structures/good_base_wall004.mdl
MDLCache: Failed load of .VVD data for props_structures/Vines_sidewall001c.mdl
MDLCache: Failed load of .VVD data for props_nature/petals_00.mdl
MDLCache: Failed load of .VVD data for props_structures/Vines_wall003.mdl
MDLCache: Failed load of .VVD data for props_structures/stair_urn002.mdl
MDLCache: Failed load of .VVD data for props_structures/Vines_wall002.mdl
MDLCache: Failed load of .VVD data for props_structures/Vines_sidewall001d.mdl
MDLCache: Failed load of .VVD data for props_stone/stoneblock003a.mdl
MDLCache: Failed load of .VVD data for props_stone/stoneblock001a.mdl
MDLCache: Failed load of .VVD data for props_rock/riveredge_rocks_small003.mdl
MDLCache: Failed load of .VVD data for props_rock/riveredge_rocks_small005.mdl
MDLCache: Failed load of .VVD data for props_debris/wood_fence001c.mdl
MDLCache: Failed load of .VVD data for props_rock/riveredge_rock010a.mdl
MDLCache: Failed load of .VVD data for props_nature/grass_clump_00b.mdl
MDLCache: Failed load of .VVD data for props_nature/grass_clump_00e.mdl
MDLCache: Failed load of .VVD data for props_rock/riveredge_rock005a.mdl
MDLCache: Failed load of .VVD data for props_structures/waterfall_bridge001.mdl
MDLCache: Failed load of .VVD data for props_rock/riveredge_rock006a.mdl
MDLCache: Failed load of .VVD data for props_debris/cooking_pot001.mdl
MDLCache: Failed load of .VVD data for props_debris/creep_camp001m.mdl
MDLCache: Failed load of .VVD data for props_debris/creep_camp001a.mdl
MDLCache: Failed load of .VVD data for props_debris/creep_camp001l.mdl
MDLCache: Failed load of .VVD data for props_debris/creep_camp001o.mdl
MDLCache: Failed load of .VVD data for props_structures/Ramp_384b.mdl
MDLCache: Failed load of .VVD data for props_structures/Ramp_256b.mdl
MDLCache: Failed load of .VVD data for props_structures/Ramp_384.mdl
MDLCache: Failed load of .VVD data for props_structures/Ramp_256.mdl
MDLCache: Failed load of .VVD data for props_bones/badside_bones001.mdl
MDLCache: Failed load of .VVD data for props_bones/badside_bones002.mdl
MDLCache: Failed load of .VVD data for props_bones/badside_bones004.mdl
MDLCache: Failed load of .VVD data for props_bones/badside_bones003.mdl
MDLCache: Failed load of .VVD data for props_bones/badside_bones005.mdl
MDLCache: Failed load of .VVD data for props_debris/creep_camp001c.mdl
MDLCache: Failed load of .VVD data for props_structures/Ramp_640.mdl
MDLCache: Failed load of .VVD data for props_structures/Ramp_128.mdl
MDLCache: Failed load of .VVD data for props_structures/Ramp_896.mdl
MDLCache: Failed load of .VVD data for props_structures/good_barracks_pool002.mdl
MDLCache: Failed load of .VVD data for props_structures/wood_wall002.mdl
MDLCache: Failed load of .VVD data for props_structures/wood_wall004.mdl
MDLCache: Failed load of .VVD data for props_structures/wood_wall001.mdl
MDLCache: Failed load of .VVD data for props_structures/stair_blocks001.mdl
MDLCache: Failed load of .VVD data for props_debris/wood_fence001e.mdl
MDLCache: Failed load of .VVD data for props_structures/good_base_wall002.mdl
MDLCache: Failed load of .VVD data for props_structures/good_base_wall001b.mdl
MDLCache: Failed load of .VVD data for props_structures/good_base_wall001.mdl
MDLCache: Failed load of .VVD data for props_structures/good_base_wall003.mdl
MDLCache: Failed load of .VVD data for props_structures/good_base_wall002d.mdl
MDLCache: Failed load of .VVD data for props_structures/good_base_wall002c.mdl
MDLCache: Failed load of .VVD data for props_garden/good_stonewall008b.mdl
MDLCache: Failed load of .VVD data for props_structures/Vines_sidewall001a.mdl
MDLCache: Failed load of .VVD data for props_structures/Vines_sidewall001b.mdl
MDLCache: Failed load of .VVD data for props_structures/stair_blocks002.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_barracks_stones006.mdl
MDLCache: Failed load of .VVD data for props_structures/Ramp_512b.mdl
MDLCache: Failed load of .VVD data for props_structures/Ramp_768.mdl
MDLCache: Failed load of .VVD data for props_debris/wood_fence001d.mdl
MDLCache: Failed load of .VVD data for props_debris/wood_fence001b.mdl
MDLCache: Failed load of .VVD data for props_garden/building_garden001.mdl
MDLCache: Failed load of .VVD data for props_tree/tree_pinestatic_02.mdl
MDLCache: Failed load of .VVD data for props_tree/tree_pinestatic_03b.mdl
MDLCache: Failed load of .VVD data for props_rock/badside_rocks005.mdl
MDLCache: Failed load of .VVD data for props_rock/badside_rocks001.mdl
MDLCache: Failed load of .VVD data for props_rock/badside_rocks006.mdl
MDLCache: Failed load of .VVD data for props_structures/waterfall_bridge_statue003.mdl
MDLCache: Failed load of .VVD data for props_magic/bad_crystals001.mdl
MDLCache: Failed load of .VVD data for props_magic/bad_crystals002.mdl
MDLCache: Failed load of .VVD data for props_structures/Vines_sidewall001f.mdl
MDLCache: Failed load of .VVD data for props_magic/bad_crystals003.mdl
MDLCache: Failed load of .VVD data for effects/wardspot_00.mdl
MDLCache: Failed load of .VVD data for props_structures/waterfall_bridge_statue002.mdl
MDLCache: Failed load of .VVD data for props_tree/tree_oakstatic_01.mdl
MDLCache: Failed load of .VVD data for props_tree/tree_oakstatic_02.mdl
MDLCache: Failed load of .VVD data for props_nature/petals_01.mdl
MDLCache: Failed load of .VVD data for effects/water_edges_00.mdl
MDLCache: Failed load of .VVD data for effects/water_edges_03.mdl
MDLCache: Failed load of .VVD data for effects/water_edges_01.mdl
MDLCache: Failed load of .VVD data for effects/water_edges_02.mdl
MDLCache: Failed load of .VVD data for effects/water_edges_02b.mdl
MDLCache: Failed load of .VVD data for effects/water_edges_03b.mdl
MDLCache: Failed load of .VVD data for effects/water_edges_00b.mdl
MDLCache: Failed load of .VVD data for effects/water_edges_01b.mdl
MDLCache: Failed load of .VVD data for effects/lily_pads_edge_00.mdl
MDLCache: Failed load of .VVD data for effects/waterfall_00.mdl
MDLCache: Failed load of .VVD data for effects/northriver_ramp_water_00.mdl
MDLCache: Failed load of .VVD data for effects/southriver_exit_water_00.mdl
MDLCache: Failed load of .VVD data for effects/southriver_ramp_water_00.mdl
MDLCache: Failed load of .VVD data for effects/southriver_ramp_water_01.mdl
MDLCache: Failed load of .VVD data for props_magic/vapors_white_002.mdl
MDLCache: Failed load of .VVD data for effects/glow_00.mdl
MDLCache: Failed load of .VVD data for effects/dust_01.mdl
MDLCache: Failed load of .VVD data for effects/radiant_lightrays.mdl
MDLCache: Failed load of .VVD data for props_magic/vapors_white_001.mdl
MDLCache: Failed load of .VVD data for effects/glow_01.mdl
MDLCache: Failed load of .VVD data for props_nature/bush_01.mdl
MDLCache: Failed load of .VVD data for props_nature/grass_clump_00a.mdl
MDLCache: Failed load of .VVD data for props_nature/grass_clump_00d.mdl
MDLCache: Failed load of .VVD data for props_nature/bush_00.mdl
MDLCache: Failed load of .VVD data for props_nature/fern001.mdl
MDLCache: Failed load of .VVD data for props_nature/grass_clump_00f.mdl
MDLCache: Failed load of .VVD data for props_nature/grass_clump_00c.mdl
MDLCache: Failed load of .VVD data for props_nature/flowers001.mdl
MDLCache: Failed load of .VVD data for props_nature/flowers002.mdl
MDLCache: Failed load of .VVD data for props_nature/fern003.mdl
MDLCache: Failed load of .VVD data for props_nature/log001.mdl
MDLCache: Failed load of .VVD data for props_nature/fern002.mdl
MDLCache: Failed load of .VVD data for props_nature/mushroom_wild_00.mdl
MDLCache: Failed load of .VVD data for props_nature/mushroom_wild_02.mdl
MDLCache: Failed load of .VVD data for props_debris/candles001.mdl
MDLCache: Failed load of .VVD data for props_debris/candles003.mdl
MDLCache: Failed load of .VVD data for props_debris/candles004.mdl
MDLCache: Failed load of .VVD data for props_debris/candles005.mdl
MDLCache: Failed load of .VVD data for props_debris/candles002.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_wallstatue002a.mdl
MDLCache: Failed load of .VVD data for props_debris/bad_chains002.mdl
MDLCache: Failed load of .VVD data for props_garden/bad_stonewall003c.mdl
MDLCache: Failed load of .VVD data for props_garden/bad_stonewall003.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_barracks_stones005.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_barracks_stones004.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_barracks_stones007.mdl
MDLCache: Failed load of .VVD data for props_debris/bad_sticks004.mdl
MDLCache: Failed load of .VVD data for props_garden/bad_stonewall003b.mdl
MDLCache: Failed load of .VVD data for props_structures/torch001.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_barracks_stones002.mdl
MDLCache: Failed load of .VVD data for props_structures/Bad_Shop001.mdl
MDLCache: Failed load of .VVD data for effects/fountain_dire_00.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_statue003.mdl
MDLCache: Failed load of .VVD data for effects/liquid_pour_00.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_barracks_stones003.mdl
MDLCache: Failed load of .VVD data for props_debris/bad_sticks002.mdl
MDLCache: Failed load of .VVD data for props_debris/bad_sticks003.mdl
MDLCache: Failed load of .VVD data for effects/web_dire_00.mdl
MDLCache: Failed load of .VVD data for effects/web_dire_01.mdl
MDLCache: Failed load of .VVD data for effects/web_dire_02.mdl
MDLCache: Failed load of .VVD data for props_debris/creep_camp002c.mdl
MDLCache: Failed load of .VVD data for props_structures/Ramp_512.mdl
MDLCache: Failed load of .VVD data for props_structures/Ramp_896b.mdl
MDLCache: Failed load of .VVD data for props_structures/Crop_Circle004.mdl
MDLCache: Failed load of .VVD data for props_structures/Crop_Circle001.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_barracks_stones001.mdl
MDLCache: Failed load of .VVD data for props_debris/creep_camp002b.mdl
MDLCache: Failed load of .VVD data for props_structures/stair_urn001.mdl
MDLCache: Failed load of .VVD data for props_structures/Crop_Circle003.mdl
MDLCache: Failed load of .VVD data for props_structures/Ramp_256c.mdl
MDLCache: Failed load of .VVD data for props_structures/Ramp_192.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_wallstatue003a.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_buildingwall001.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_buildingwall002.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_buildingwall003.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_buildingwall004.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_buildingwall005.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_buildingwall006.mdl
MDLCache: Failed load of .VVD data for props_debris/bad_sticks001.mdl
MDLCache: Failed load of .VVD data for props_debris/bad_chains001.mdl
MDLCache: Failed load of .VVD data for props_structures/SecretShop_Dire001.mdl
MDLCache: Failed load of .VVD data for effects/dire_eyes_00.mdl
MDLCache: Failed load of .VVD data for effects/dire_eyes_01.mdl
Host_NewGame on map dota
L 06/27/2025 - 00:39:26: -------- Mapchange to dota --------
L 06/27/2025 - 00:39:26: Error log file session closed.
L 06/27/2025 - 00:39:27: [SDKTOOLS] Invalid detour address passed - Disabling detour to prevent crashes
Anti-Pausing from retarted coder :fire: :fire: :fire:
Start abandon plugin
Hook called
false simple?
PLUGIN LOADED 28320
Read from match_cfg/35720.json
{"matchId": 35720, "lobbyType": 1, "gameMode": 22, "roomId": "f386545e-5737-4104-9817-d7b224678f39", "serverUrl": "46.174.53.173:28320", "fillBots": false, "enableCheats": false, "players": [{"steamId": "136893774", "subscriber": false, "name": "Drochiomaru", "muted": false, "ignore": false, "partyId": "cf6c38fa-1a8f-4132-a4c0-ba3c4e8b96b2", "team": 2}, {"steamId": "1837892499", "subscriber": false, "name": "Капитан Прах", "muted": false, "ignore": false, "partyId": "3666fb94-97bd-486a-ba27-d9e159378fbe", "team": 2}, {"steamId": "186085043", "subscriber": false, "name": "однаждыебался", "muted": false, "ignore": false, "partyId": "d49b7228-6b1e-4355-856e-c55767c232c5", "team": 2}, {"steamId": "1909044259", "subscriber": false, "name": "asd829458", "muted": false, "ignore": false, "partyId": "4f932e38-d4c4-4723-af17-0e5eea71b85a", "team": 3}, {"steamId": "322449174", "subscriber": false, "name": "all_mute", "muted": false, "ignore": false, "partyId": "e882c447-bfa3-4e65-a82e-5d646476
Match ID: 35720
Mode: 1
Running on server: 46.174.53.173:28320
Master server: http://operator:7777
LogFile logs/match_35720.log
Executing dedicated server config file
S:Gamerules: entering state 'DOTA_GAMERULES_STATE_INIT'
L 06/27/2025 - 00:39:27: [SM] Exception reported: Gamerules lookup failed.
L 06/27/2025 - 00:39:27: [SM] Blaming plugin: matchrecorder_new.smx
L 06/27/2025 - 00:39:27: [SM] Call stack trace:
L 06/27/2025 - 00:39:27: [SM]   [0] GameRules_GetProp
L 06/27/2025 - 00:39:27: [SM]   [1] Line 536, E:\\torrent\\d2server\\Dota6.84\\dota\\addons\\sourcemod\\scripting\\matchrecorder_new.sp::OnGameRulesStateChange()
ILocalize::AddFile() failed to load file "resource/dota_english.txt".
MDLCache: Failed load of .VVD data for props_gameplay/tpscroll01.mdl
MDLCache: Failed load of .VVD data for props_gameplay/tombstoneB01.mdl
MDLCache: Failed load of .VVD data for props_gameplay/tombstoneA01.mdl
MDLCache: Failed load of .VVD data for props_gameplay/tango.mdl
MDLCache: Failed load of .VVD data for props_gameplay/stout_shield.mdl
MDLCache: Failed load of .VVD data for props_gameplay/status_track_scroll.mdl
MDLCache: Failed load of .VVD data for props_gameplay/status_silence01_storm_spirit.mdl
MDLCache: Failed load of .VVD data for props_gameplay/status_silence01.mdl
MDLCache: Failed load of .VVD data for props_gameplay/status_shield_frozen.mdl
MDLCache: Failed load of .VVD data for props_gameplay/status_shield_broken.mdl
MDLCache: Failed load of .VVD data for props_gameplay/status_shield.mdl
MDLCache: Failed load of .VVD data for props_gameplay/status_disarm.mdl
MDLCache: Failed load of .VVD data for props_gameplay/smoke.mdl
MDLCache: Failed load of .VVD data for props_gameplay/sithil/sithil.mdl
MDLCache: Failed load of .VVD data for props_gameplay/shopkeeper_fountain/shopkeeper_fountain_sword.mdl
MDLCache: Failed load of .VVD data for props_gameplay/shopkeeper_fountain/shopkeeper_fountain_3k.mdl
MDLCache: Failed load of .VVD data for props_gameplay/shopkeeper_fountain/shopkeeper_fountain.mdl
MDLCache: Failed load of .VVD data for props_gameplay/shopkeeper_fountain/keeper_fountain.mdl
MDLCache: Failed load of .VVD data for props_gameplay/shopkeeper_dire/secretshopkeeper_dire.mdl
MDLCache: Failed load of .VVD data for props_gameplay/sheep01.mdl
MDLCache: Failed load of .VVD data for props_gameplay/sentry_ward_bundle.mdl
MDLCache: Failed load of .VVD data for props_gameplay/salve_red.mdl
MDLCache: Failed load of .VVD data for props_gameplay/salve_blue.mdl
MDLCache: Failed load of .VVD data for props_gameplay/salve.mdl
MDLCache: Failed load of .VVD data for props_gameplay/rune_regeneration01.mdl
MDLCache: Failed load of .VVD data for props_gameplay/rune_invisibility01.mdl
MDLCache: Failed load of .VVD data for props_gameplay/rune_illusion01.mdl
MDLCache: Failed load of .VVD data for props_gameplay/rune_haste01.mdl
MDLCache: Failed load of .VVD data for props_gameplay/rune_goldxp.mdl
MDLCache: Failed load of .VVD data for props_gameplay/rune_doubledamage01.mdl
MDLCache: Failed load of .VVD data for props_gameplay/roquelaire/roquelaire.mdl
MDLCache: Failed load of .VVD data for props_gameplay/roquelaire/roq_mesh.mdl
MDLCache: Failed load of .VVD data for props_gameplay/red_box.mdl
MDLCache: Failed load of .VVD data for props_gameplay/recipe.mdl
MDLCache: Failed load of .VVD data for props_gameplay/quirt/quirt.mdl
MDLCache: Failed load of .VVD data for props_gameplay/quelling_blade.mdl
MDLCache: Failed load of .VVD data for props_gameplay/pumpkin_rune.mdl
MDLCache: Failed load of .VVD data for props_gameplay/pumpkin_bucket.mdl
MDLCache: Failed load of .VVD data for props_gameplay/pig_sfm_low.mdl
MDLCache: Failed load of .VVD data for props_gameplay/pig.mdl
MDLCache: Failed load of .VVD data for props_gameplay/observer_ward_bundle.mdl
MDLCache: Failed load of .VVD data for props_gameplay/mango.mdl
MDLCache: Failed load of .VVD data for props_gameplay/magic_wand.mdl
MDLCache: Failed load of .VVD data for props_gameplay/halloween_candy.mdl
MDLCache: Failed load of .VVD data for props_gameplay/gold_bag.mdl
MDLCache: Failed load of .VVD data for props_gameplay/gem01.mdl
MDLCache: Failed load of .VVD data for props_gameplay/frog.mdl
MDLCache: Failed load of .VVD data for props_gameplay/dust.mdl
MDLCache: Failed load of .VVD data for props_gameplay/dota_AR_frame/dota_AR_frame.mdl
MDLCache: Failed load of .VVD data for props_gameplay/donkey_wings.mdl
MDLCache: Failed load of .VVD data for props_gameplay/donkey_dire_wings.mdl
MDLCache: Failed load of .VVD data for props_gameplay/donkey_dire.mdl
MDLCache: Failed load of .VVD data for props_gameplay/donkey.mdl
MDLCache: Failed load of .VVD data for props_gameplay/divine_rapier.mdl
MDLCache: Failed load of .VVD data for props_gameplay/disarm_oracle.mdl
MDLCache: Failed load of .VVD data for props_gameplay/disarm_customhero.mdl
MDLCache: Failed load of .VVD data for props_gameplay/disarm.mdl
MDLCache: Failed load of .VVD data for props_gameplay/default_ward.mdl
MDLCache: Failed load of .VVD data for props_gameplay/crystal_ring01.mdl
MDLCache: Failed load of .VVD data for props_gameplay/clarity.mdl
MDLCache: Failed load of .VVD data for props_gameplay/chicken.mdl
MDLCache: Failed load of .VVD data for props_gameplay/cheese.mdl
MDLCache: Failed load of .VVD data for props_gameplay/branch.mdl
MDLCache: Failed load of .VVD data for props_gameplay/bottle_blue.mdl
MDLCache: Failed load of .VVD data for props_gameplay/boots_of_speed.mdl
MDLCache: Failed load of .VVD data for props_gameplay/anvil/anvil_00.mdl
MDLCache: Failed load of .VVD data for props_gameplay/antler_trap_02.mdl
MDLCache: Failed load of .VVD data for props_gameplay/antler_trap_01.mdl
MDLCache: Failed load of .VVD data for props_gameplay/antler_trap.mdl
MDLCache: Failed load of .VVD data for props_gameplay/alacrity.mdl
MDLCache: Failed load of .VVD data for props_gameplay/aegis.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/pedestal_spotlight.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/pedestal_effigy_jade.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/pedestal_2_ground_dire.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/pedestal_2_ground.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/pedestal_1_small.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/pedestal_1_large.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/pedestal_1.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/effigy_pedestal_ti5.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/effigy_pedestal_ti5_lv2_dire.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/effigy_pedestal_ti5_lv2.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/effigy_pedestal_ti5_dire.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/effigy_pedestal_ti5.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/effigy_pedestal_radiant.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/effigy_pedestal_frosty_dire.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/effigy_pedestal_frost_radiant.mdl
MDLCache: Failed load of .VVD data for heroes/pedestal/effigy_pedestal_dire.mdl
MDLCache: Failed load of .VVD data for props_teams/pennant_radiant_00.mdl
MDLCache: Failed load of .VVD data for props_teams/pennant_dire_00.mdl
MDLCache: Failed load of .VVD data for creeps/lane_creeps/creep_good_siege/creep_good_siege.mdl
MDLCache: Failed load of .VVD data for creeps/lane_creeps/creep_radiant_ranged/radiant_ranged.mdl
MDLCache: Failed load of .VVD data for creeps/lane_creeps/creep_radiant_melee/radiant_melee.mdl
MDLCache: Failed load of .VVD data for creeps/lane_creeps/creep_bad_siege/creep_bad_siege.mdl
MDLCache: Failed load of .VVD data for creeps/lane_creeps/creep_bad_ranged/lane_dire_ranged.mdl
MDLCache: Failed load of .VVD data for creeps/lane_creeps/creep_bad_melee/creep_bad_melee.mdl
MDLCache: Failed load of .VVD data for creeps/lane_creeps/creep_radiant_ranged/radiant_ranged_mega.mdl
MDLCache: Failed load of .VVD data for creeps/lane_creeps/creep_radiant_melee/radiant_melee_mega.mdl
MDLCache: Failed load of .VVD data for creeps/lane_creeps/creep_bad_ranged/lane_dire_ranged_mega.mdl
MDLCache: Failed load of .VVD data for creeps/lane_creeps/creep_bad_melee/creep_bad_melee_mega.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_kobold/kobold_c/n_creep_kobold_c.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_kobold/kobold_b/n_creep_kobold_b.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_kobold/kobold_a/n_creep_kobold_a.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_gnoll/n_creep_gnoll.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_forest_trolls/n_creep_forest_troll_berserker.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_forest_trolls/n_creep_forest_troll_high_priest.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_ghost_b/n_creep_ghost_b.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_ghost_a/n_creep_ghost_a.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_harpy_a/n_creep_harpy_a.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_harpy_b/n_creep_harpy_b.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_ogre_med/n_creep_ogre_med.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_ogre_lrg/n_creep_ogre_lrg.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_worg_small/n_creep_worg_small.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_worg_large/n_creep_worg_large.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_golem_b/n_creep_golem_b.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_satyr_b/n_creep_satyr_b.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_satyr_c/n_creep_satyr_c.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_centaur_med/n_creep_centaur_med.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_centaur_lrg/n_creep_centaur_lrg.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_troll_dark_a/n_creep_troll_dark_a.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_troll_dark_b/n_creep_troll_dark_b.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_beast/n_creep_beast.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_furbolg/n_creep_furbolg_disrupter.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_satyr_a/n_creep_satyr_a.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_vulture_b/n_creep_vulture_b.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_vulture_a/n_creep_vulture_a.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_black_drake/n_creep_black_drake.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_black_dragon/n_creep_black_dragon.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_golem_a/neutral_creep_golem_a.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_thunder_lizard/n_creep_thunder_lizard_small.mdl
MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_thunder_lizard/n_creep_thunder_lizard_big.mdl
MDLCache: Failed load of .VVD data for development/invisiblebox.mdl
MDLCache: Failed load of .VVD data for props_debris/creep_camp001b.mdl
MDLCache: Failed load of .VVD data for props_teams/logo_radiant_large.mdl
MDLCache: Failed load of .VVD data for creeps/roshan/aegis.mdl
MDLCache: Failed load of .VVD data for props_teams/banner_radiant.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_birdsmall004.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_birdsmall003.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_birdsmall005.mdl
MDLCache: Failed load of .VVD data for heroes/shopkeeper/shopkeeper.mdl
MDLCache: Failed load of .VVD data for props_debris/creep_camp001h.mdl
MDLCache: Failed load of .VVD data for props_structures/SideShop_Radiant001.mdl
MDLCache: Failed load of .VVD data for props_structures/SecretShop_Radiant002.mdl
MDLCache: Failed load of .VVD data for props_teams/logo_radiant_small.mdl
MDLCache: Failed load of .VVD data for props_teams/logo_radiant_medium.mdl
MDLCache: Failed load of .VVD data for props_wildlife/crow001.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_caterpillar001.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_ladybug001.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_hercules_beetle001.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_turtle001.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_varmint001.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_varmint002.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_birdlarge002.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_frog003.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_frog001.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_fish003.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_fish004.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_fish001.mdl
MDLCache: Failed load of .VVD data for props_tree/Dire_Tree004.mdl
MDLCache: Failed load of .VVD data for props_tree/Dire_Tree007.mdl
MDLCache: Failed load of .VVD data for props_tree/Dire_Tree008.mdl
MDLCache: Failed load of .VVD data for props_tree/tree_oak_01.mdl
MDLCache: Failed load of .VVD data for props_tree/tree_pine_01.mdl
MDLCache: Failed load of .VVD data for props_tree/tree_pine_03b.mdl
MDLCache: Failed load of .VVD data for props_tree/tree_pine_02.mdl
MDLCache: Failed load of .VVD data for props_tree/tree_oak_01b.mdl
MDLCache: Failed load of .VVD data for props_tree/tree_bamboo_03.mdl
MDLCache: Failed load of .VVD data for props_tree/dire_tree004b.mdl
MDLCache: Failed load of .VVD data for props_tree/tree_bamboo_02.mdl
MDLCache: Failed load of .VVD data for props_tree/tree_bamboo_01.mdl
MDLCache: Failed load of .VVD data for props_tree/tree_oak_02.mdl
MDLCache: Failed load of .VVD data for props_nature/cattails001.mdl
MDLCache: Failed load of .VVD data for props_nature/lily_pads001.mdl
MDLCache: Failed load of .VVD data for props_debris/creep_camp001e.mdl
MDLCache: Failed load of .VVD data for props_teams/banner_dire_small.mdl
MDLCache: Failed load of .VVD data for props_teams/banner_dire.mdl
MDLCache: Failed load of .VVD data for props_teams/logo_dire_medium.mdl
MDLCache: Failed load of .VVD data for props_teams/logo_dire_small.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_millipede001.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_snake001.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_spider001.mdl
MDLCache: Failed load of .VVD data for props_wildlife/wildlife_rat001.mdl
MDLCache: Failed load of .VVD data for heroes/shopkeeper_dire/shopkeeper_dire.mdl
MDLCache: Failed load of .VVD data for props_structures/tower_good.mdl
MDLCache: Failed load of .VVD data for props_structures/tower_good3_dest_lvl1.mdl
MDLCache: Failed load of .VVD data for props_structures/tower_good3_dest_lvl2.mdl
MDLCache: Failed load of .VVD data for props_structures/good_barracks_ranged001.mdl
MDLCache: Failed load of .VVD data for props_structures/good_barracks_ranged002_lvl1.mdl
MDLCache: Failed load of .VVD data for props_structures/good_barracks_ranged002_lvl2.mdl
MDLCache: Failed load of .VVD data for props_structures/good_barracks_melee001.mdl
MDLCache: Failed load of .VVD data for props_structures/good_barracks_melee002_lvl1.mdl
MDLCache: Failed load of .VVD data for props_structures/good_barracks_melee002_lvl2.mdl
MDLCache: Failed load of .VVD data for props_structures/good_statue008.mdl
MDLCache: Failed load of .VVD data for props_structures/good_statue010.mdl
MDLCache: Failed load of .VVD data for props_structures/good_ancient001.mdl
MDLCache: Failed load of .VVD data for props_structures/good_fountain001.mdl
MDLCache: Failed load of .VVD data for props_structures/radiant_endcam.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_statue001.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_barracks001_ranged.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_barrack001_ranged_destruction_lev1.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_barrack001_ranged_destruction_lev2.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_barracks001_melee.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_barrack001_melee_destruction_lev1.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_barrack001_melee_destruction_lev2.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_statue002.mdl
MDLCache: Failed load of .VVD data for props_structures/tower_bad.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_tower_destruction_lev1.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_tower_destruction_lev2.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_column001.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_column001_destruction_lev1.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_column001_destruction_lev2.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_fountain001.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_ancient002.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_ancient_destruction_pit.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_ancient_destruction_camera.mdl
MDLCache: Failed load of .VVD data for props_structures/bad_ancient_particle_parent.mdl
GameMopde: 22
Enable bans: 1
Map start called
StartRecording called
Server command executed: tv_record replays/35720.dem
Server command executed(wait for load count)
lobby type is: 1
L 06/27/2025 - 00:39:29: [matchrecorder_new.smx] Reserve slot for Drochiomaru at team 2
Reserve slot for Drochiomaru at team 2
L 06/27/2025 - 00:39:29: [matchrecorder_new.smx] Reserve slot for Капитан Прах at team 2
Reserve slot for Капитан Прах at team 2
L 06/27/2025 - 00:39:29: [matchrecorder_new.smx] Reserve slot for однаждыебался at team 2
Reserve slot for однаждыебался at team 2
L 06/27/2025 - 00:39:29: [matchrecorder_new.smx] Reserve slot for asd829458 at team 3
Reserve slot for asd829458 at team 3
L 06/27/2025 - 00:39:29: [matchrecorder_new.smx] Reserve slot for all_mute at team 3
Reserve slot for all_mute at team 3
L 06/27/2025 - 00:39:29: [matchrecorder_new.smx] Reserve slot for ПОКЛОНИСЬ БОГУ at team 2
Reserve slot for ПОКЛОНИСЬ БОГУ at team 2
L 06/27/2025 - 00:39:29: [matchrecorder_new.smx] Reserve slot for мммолли at team 3
Reserve slot for мммолли at team 3
L 06/27/2025 - 00:39:29: [matchrecorder_new.smx] Reserve slot for ✞Пилот Болида✞ at team 3
Reserve slot for ✞Пилот Болида✞ at team 3
L 06/27/2025 - 00:39:29: [matchrecorder_new.smx] Reserve slot for 🖤domaprohladno at team 2
Reserve slot for 🖤domaprohladno at team 2
L 06/27/2025 - 00:39:29: [matchrecorder_new.smx] Reserve slot for dec4dence at team 3
Reserve slot for dec4dence at team 3
steam32 136893774
steam32 1837892499
steam32 186085043
steam32 302197283
steam32 153062474
steam32 1909044259
steam32 322449174
steam32 1030433746
steam32 229840067
steam32 1209125835
Opened server(28320) (threaded)
Server logging enabled.
06/27/2025 - 00:39:29: Unknown command "sm_tidychat_on"
06/27/2025 - 00:39:29: Unknown command "sm_tidychat_cvar"
06/27/2025 - 00:39:29: Recording SourceTV demo to replays/35720.dem...
06/27/2025 - 00:39:29: Unknown command "sm_flood_time"
06/27/2025 - 00:39:29: Unknown command "sm_reserve_type"
06/27/2025 - 00:39:29: Unknown command "sm_reserved_slots"
06/27/2025 - 00:39:29: Unknown command "sm_hide_slots"
06/27/2025 - 00:39:29: Unknown command "sm_chat_mode"
06/27/2025 - 00:39:29: Unknown command "sm_timeleft_interval"
06/27/2025 - 00:39:29: Unknown command "sm_trigger_show"
06/27/2025 - 00:39:29: S:Gamerules: entering state 'DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD'
06/27/2025 - 00:39:29: GameRules change to: 1
06/27/2025 - 00:39:29: Disabled pause while waiting for players to connect
06/27/2025 - 00:39:29: GameRules change to: 1
06/27/2025 - 00:39:29: GameRules change to: 1
06/27/2025 - 00:39:29: Opened hltv(28325) (threaded)
06/27/2025 - 00:39:29: SourceTV broadcast active.
06/27/2025 - 00:39:30: Connection to Steam servers successful, Game Server SteamID [A:1:474621956:46052] (90269784855947268).
06/27/2025 - 00:39:30: CDOTAGCServerSystem - adding listener
06/27/2025 - 00:39:30:    VAC secure mode is activated.
06/27/2025 - 00:39:31: Received server welcome from GC.
06/27/2025 - 00:39:31: GC Connection established for server version 0
06/27/2025 - 00:39:32: L 06/27/2025 - 00:39:32: "all_mute<3><[U:1:322449174]><>" connected, address "77.45.198.122:49193"
06/27/2025 - 00:39:32: Client "all_mute" connected (77.45.198.122:49193).
06/27/2025 - 00:39:33: L 06/27/2025 - 00:39:33: "asd829458<4><[U:1:1909044259]><>" connected, address "91.52.83.162:65006"
06/27/2025 - 00:39:33: Client "asd829458" connected (91.52.83.162:65006).
06/27/2025 - 00:39:33: L 06/27/2025 - 00:39:33: "однаждыебался<5><[U:1:186085043]><>" connected, address "176.194.76.127:61622"
06/27/2025 - 00:39:33: Client "однаждыебался" connected (176.194.76.127:61622).
06/27/2025 - 00:39:34: L 06/27/2025 - 00:39:34: "dec4dence<6><[U:1:1209125835]><>" connected, address "213.217.1.12:57106"
06/27/2025 - 00:39:34: Client "dec4dence" connected (213.217.1.12:57106).
06/27/2025 - 00:39:34: "all_mute<3><[U:1:322449174]><>" STEAM USERID validated
06/27/2025 - 00:39:34: L 06/27/2025 - 00:39:34: "all_mute<3><[U:1:322449174]><>" STEAM USERID validated
06/27/2025 - 00:39:34: "asd829458<4><[U:1:1909044259]><>" STEAM USERID validated
06/27/2025 - 00:39:34: L 06/27/2025 - 00:39:34: "asd829458<4><[U:1:1909044259]><>" STEAM USERID validated
06/27/2025 - 00:39:34: "однаждыебался<5><[U:1:186085043]><>" STEAM USERID validated
06/27/2025 - 00:39:34: L 06/27/2025 - 00:39:34: "однаждыебался<5><[U:1:186085043]><>" STEAM USERID validated
06/27/2025 - 00:39:34: OnClientAuthorized 322449174
06/27/2025 - 00:39:34: OnClientAuthorized 1909044259
06/27/2025 - 00:39:34: OnClientAuthorized 186085043
06/27/2025 - 00:39:34: Unable to create object of type 2017
06/27/2025 - 00:39:34: Unable to create object of type 2017
06/27/2025 - 00:39:34: L 06/27/2025 - 00:39:34: "мммолли<7><[U:1:1030433746]><>" connected, address "146.158.118.102:62249"
06/27/2025 - 00:39:34: Client "мммолли" connected (146.158.118.102:62249).
06/27/2025 - 00:39:35: L 06/27/2025 - 00:39:35: "ПОКЛОНИСЬ БОГУ<8><[U:1:302197283]><>" connected, address "188.170.81.54:1784"
06/27/2025 - 00:39:35: Client "ПОКЛОНИСЬ БОГУ" connected (188.170.81.54:1784).
06/27/2025 - 00:39:35: "dec4dence<6><[U:1:1209125835]><>" STEAM USERID validated
06/27/2025 - 00:39:35: L 06/27/2025 - 00:39:35: "dec4dence<6><[U:1:1209125835]><>" STEAM USERID validated
06/27/2025 - 00:39:35: "мммолли<7><[U:1:1030433746]><>" STEAM USERID validated
06/27/2025 - 00:39:35: L 06/27/2025 - 00:39:35: "мммолли<7><[U:1:1030433746]><>" STEAM USERID validated
06/27/2025 - 00:39:35: OnClientAuthorized 1209125835
06/27/2025 - 00:39:35: OnClientAuthorized 1030433746
06/27/2025 - 00:39:36: "ПОКЛОНИСЬ БОГУ<8><[U:1:302197283]><>" STEAM USERID validated
06/27/2025 - 00:39:36: L 06/27/2025 - 00:39:36: "ПОКЛОНИСЬ БОГУ<8><[U:1:302197283]><>" STEAM USERID validated
06/27/2025 - 00:39:36: Unable to create object of type 2017
06/27/2025 - 00:39:36: L 06/27/2025 - 00:39:36: "🖤domaprohladno<9><[U:1:153062474]><>" connected, address "95.25.224.228:33149"
06/27/2025 - 00:39:36: Client "🖤domaprohladno" connected (95.25.224.228:33149).
06/27/2025 - 00:39:37: OnClientAuthorized 302197283
06/27/2025 - 00:39:37: L 06/27/2025 - 00:39:37: "all_mute<3><[U:1:322449174]><Unassigned>" joined team "#DOTA_BadGuys"
06/27/2025 - 00:39:37: I send request that player 322449174 did connect first time? 1
06/27/2025 - 00:39:37: Loading time: 7.666666
06/27/2025 - 00:39:37: L 06/27/2025 - 00:39:37: "all_mute<3><[U:1:322449174]><>" entered the game
06/27/2025 - 00:39:37: PR:SetConnectionState 6:[U:1:322449174] DOTA_CONNECTION_STATE_LOADING NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:37: Sending full update to Client all_mute (all_mute can't find frame from tick -1)
06/27/2025 - 00:39:37: Voice: Listener all_mute(6) to Talker all_mute(6) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:37: Engine:Voice: Client all_mute(1) does listen to client all_mute(1)
06/27/2025 - 00:39:37: L 06/27/2025 - 00:39:37: "dec4dence<6><[U:1:1209125835]><Unassigned>" joined team "#DOTA_BadGuys"
06/27/2025 - 00:39:37: I send request that player 1209125835 did connect first time? 1
06/27/2025 - 00:39:37: Loading time: 8.200000
06/27/2025 - 00:39:37: L 06/27/2025 - 00:39:37: "dec4dence<6><[U:1:1209125835]><>" entered the game
06/27/2025 - 00:39:37: PR:SetConnectionState 9:[U:1:1209125835] DOTA_CONNECTION_STATE_LOADING NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:37: Sending full update to Client dec4dence (dec4dence can't find frame from tick -1)
06/27/2025 - 00:39:37: Voice: Listener all_mute(6) to Talker dec4dence(9) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:37: Engine:Voice: Client all_mute(1) does listen to client dec4dence(4)
06/27/2025 - 00:39:38: "🖤domaprohladno<9><[U:1:153062474]><>" STEAM USERID validated
06/27/2025 - 00:39:38: L 06/27/2025 - 00:39:38: "🖤domaprohladno<9><[U:1:153062474]><>" STEAM USERID validated
06/27/2025 - 00:39:38: Voice: Listener dec4dence(9) to Talker all_mute(6) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:38: Voice: Listener dec4dence(9) to Talker dec4dence(9) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:38: Engine:Voice: Client dec4dence(4) does listen to client all_mute(1)
06/27/2025 - 00:39:38: Engine:Voice: Client dec4dence(4) does listen to client dec4dence(4)
06/27/2025 - 00:39:38: Unable to create object of type 2017
06/27/2025 - 00:39:38: OnClientAuthorized 153062474
06/27/2025 - 00:39:40: L 06/27/2025 - 00:39:40: "мммолли<7><[U:1:1030433746]><Unassigned>" joined team "#DOTA_BadGuys"
06/27/2025 - 00:39:40: I send request that player 1030433746 did connect first time? 1
06/27/2025 - 00:39:40: Loading time: 10.533333
06/27/2025 - 00:39:40: L 06/27/2025 - 00:39:40: "мммолли<7><[U:1:1030433746]><>" entered the game
06/27/2025 - 00:39:40: PR:SetConnectionState 7:[U:1:1030433746] DOTA_CONNECTION_STATE_LOADING NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:40: Sending full update to Client мммолли (мммолли can't find frame from tick -1)
06/27/2025 - 00:39:40: L 06/27/2025 - 00:39:40: "ПОКЛОНИСЬ БОГУ<8><[U:1:302197283]><Unassigned>" joined team "#DOTA_GoodGuys"
06/27/2025 - 00:39:40: I send request that player 302197283 did connect first time? 1
06/27/2025 - 00:39:40: Loading time: 10.700000
06/27/2025 - 00:39:40: L 06/27/2025 - 00:39:40: "ПОКЛОНИСЬ БОГУ<8><[U:1:302197283]><>" entered the game
06/27/2025 - 00:39:40: PR:SetConnectionState 3:[U:1:302197283] DOTA_CONNECTION_STATE_LOADING NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:40: Sending full update to Client ПОКЛОНИСЬ БОГУ (ПОКЛОНИСЬ БОГУ can't find frame from tick -1)
06/27/2025 - 00:39:40: Voice: Listener all_mute(6) to Talker мммолли(7) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:40: Voice: Listener all_mute(6) to Talker ПОКЛОНИСЬ БОГУ(3) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Engine:Voice: Client all_mute(1) does listen to client мммолли(5)
06/27/2025 - 00:39:40: Voice: Listener dec4dence(9) to Talker мммолли(7) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:40: Voice: Listener dec4dence(9) to Talker ПОКЛОНИСЬ БОГУ(3) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Engine:Voice: Client dec4dence(4) does listen to client мммолли(5)
06/27/2025 - 00:39:40: L 06/27/2025 - 00:39:40: "🖤domaprohladno<9><[U:1:153062474]><Unassigned>" joined team "#DOTA_GoodGuys"
06/27/2025 - 00:39:40: I send request that player 153062474 did connect first time? 1
06/27/2025 - 00:39:40: Loading time: 11.066667
06/27/2025 - 00:39:40: L 06/27/2025 - 00:39:40: "🖤domaprohladno<9><[U:1:153062474]><>" entered the game
06/27/2025 - 00:39:40: L 06/27/2025 - 00:39:40: "однаждыебался<5><[U:1:186085043]><Unassigned>" joined team "#DOTA_GoodGuys"
06/27/2025 - 00:39:40: I send request that player 186085043 did connect first time? 1
06/27/2025 - 00:39:40: Loading time: 11.066667
06/27/2025 - 00:39:40: L 06/27/2025 - 00:39:40: "однаждыебался<5><[U:1:186085043]><>" entered the game
06/27/2025 - 00:39:40: Voice: Listener all_mute(6) to Talker однаждыебался(2) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Voice: Listener all_mute(6) to Talker 🖤domaprohladno(4) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Voice: Listener dec4dence(9) to Talker однаждыебался(2) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Voice: Listener dec4dence(9) to Talker 🖤domaprohladno(4) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Voice: Listener мммолли(7) to Talker all_mute(6) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:40: Voice: Listener мммолли(7) to Talker однаждыебался(2) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Voice: Listener мммолли(7) to Talker dec4dence(9) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:40: Voice: Listener мммолли(7) to Talker мммолли(7) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:40: Voice: Listener мммолли(7) to Talker ПОКЛОНИСЬ БОГУ(3) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Voice: Listener мммолли(7) to Talker 🖤domaprohladno(4) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Engine:Voice: Client мммолли(5) does listen to client all_mute(1)
06/27/2025 - 00:39:40: Engine:Voice: Client мммолли(5) does listen to client dec4dence(4)
06/27/2025 - 00:39:40: Engine:Voice: Client мммолли(5) does listen to client мммолли(5)
06/27/2025 - 00:39:40: Voice: Listener ПОКЛОНИСЬ БОГУ(3) to Talker all_mute(6) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Voice: Listener ПОКЛОНИСЬ БОГУ(3) to Talker однаждыебался(2) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:40: Voice: Listener ПОКЛОНИСЬ БОГУ(3) to Talker dec4dence(9) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Voice: Listener ПОКЛОНИСЬ БОГУ(3) to Talker мммолли(7) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Voice: Listener ПОКЛОНИСЬ БОГУ(3) to Talker ПОКЛОНИСЬ БОГУ(3) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:40: Voice: Listener ПОКЛОНИСЬ БОГУ(3) to Talker 🖤domaprohladno(4) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:40: Engine:Voice: Client ПОКЛОНИСЬ БОГУ(6) does listen to client однаждыебался(3)
06/27/2025 - 00:39:40: Engine:Voice: Client ПОКЛОНИСЬ БОГУ(6) does listen to client ПОКЛОНИСЬ БОГУ(6)
06/27/2025 - 00:39:40: Engine:Voice: Client ПОКЛОНИСЬ БОГУ(6) does listen to client 🖤domaprohladno(7)
06/27/2025 - 00:39:40: PR:SetConnectionState 2:[U:1:186085043] DOTA_CONNECTION_STATE_LOADING NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:40: PR:SetConnectionState 4:[U:1:153062474] DOTA_CONNECTION_STATE_LOADING NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:40: Sending full update to Client однаждыебался (однаждыебался can't find frame from tick -1)
06/27/2025 - 00:39:40: Sending full update to Client 🖤domaprohladno (🖤domaprohladno can't find frame from tick -1)
06/27/2025 - 00:39:40: PR:SetFullyJoinedServer 9:[U:1:1209125835] true
06/27/2025 - 00:39:40: PR:SetLeaverStatus 9:[U:1:1209125835] DOTA_LEAVER_NONE
06/27/2025 - 00:39:40: PR:SetConnectionState 9:[U:1:1209125835] DOTA_CONNECTION_STATE_CONNECTED NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:40: Voice: Listener однаждыебался(2) to Talker all_mute(6) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Voice: Listener однаждыебался(2) to Talker однаждыебался(2) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:40: Voice: Listener однаждыебался(2) to Talker dec4dence(9) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Voice: Listener однаждыебался(2) to Talker мммолли(7) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Voice: Listener однаждыебался(2) to Talker ПОКЛОНИСЬ БОГУ(3) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:40: Voice: Listener однаждыебался(2) to Talker 🖤domaprohladno(4) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:40: Engine:Voice: Client однаждыебался(3) does listen to client однаждыебался(3)
06/27/2025 - 00:39:40: Engine:Voice: Client однаждыебался(3) does listen to client ПОКЛОНИСЬ БОГУ(6)
06/27/2025 - 00:39:40: Engine:Voice: Client однаждыебался(3) does listen to client 🖤domaprohladno(7)
06/27/2025 - 00:39:40: Voice: Listener 🖤domaprohladno(4) to Talker all_mute(6) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Voice: Listener 🖤domaprohladno(4) to Talker однаждыебался(2) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:40: Voice: Listener 🖤domaprohladno(4) to Talker dec4dence(9) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Voice: Listener 🖤domaprohladno(4) to Talker мммолли(7) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:40: Voice: Listener 🖤domaprohladno(4) to Talker ПОКЛОНИСЬ БОГУ(3) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:40: Voice: Listener 🖤domaprohladno(4) to Talker 🖤domaprohladno(4) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:40: Engine:Voice: Client 🖤domaprohladno(7) does listen to client однаждыебался(3)
06/27/2025 - 00:39:40: Engine:Voice: Client 🖤domaprohladno(7) does listen to client ПОКЛОНИСЬ БОГУ(6)
06/27/2025 - 00:39:40: Engine:Voice: Client 🖤domaprohladno(7) does listen to client 🖤domaprohladno(7)
06/27/2025 - 00:39:41: PR:SetFullyJoinedServer 6:[U:1:322449174] true
06/27/2025 - 00:39:41: PR:SetLeaverStatus 6:[U:1:322449174] DOTA_LEAVER_NONE
06/27/2025 - 00:39:41: PR:SetConnectionState 6:[U:1:322449174] DOTA_CONNECTION_STATE_CONNECTED NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:42: L 06/27/2025 - 00:39:42: "asd829458<4><[U:1:1909044259]><Unassigned>" joined team "#DOTA_BadGuys"
06/27/2025 - 00:39:42: I send request that player 1909044259 did connect first time? 1
06/27/2025 - 00:39:42: Loading time: 12.800001
06/27/2025 - 00:39:42: L 06/27/2025 - 00:39:42: "asd829458<4><[U:1:1909044259]><>" entered the game
06/27/2025 - 00:39:42: PR:SetConnectionState 5:[U:1:1909044259] DOTA_CONNECTION_STATE_LOADING NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:42: Sending full update to Client asd829458 (asd829458 can't find frame from tick -1)
06/27/2025 - 00:39:42: Voice: Listener all_mute(6) to Talker asd829458(5) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:42: Engine:Voice: Client all_mute(1) does listen to client asd829458(2)
06/27/2025 - 00:39:42: Voice: Listener asd829458(5) to Talker all_mute(6) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:42: Voice: Listener asd829458(5) to Talker asd829458(5) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:42: Voice: Listener asd829458(5) to Talker однаждыебался(2) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:42: Voice: Listener asd829458(5) to Talker dec4dence(9) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:42: Voice: Listener asd829458(5) to Talker мммолли(7) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:42: Voice: Listener asd829458(5) to Talker ПОКЛОНИСЬ БОГУ(3) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:42: Voice: Listener asd829458(5) to Talker 🖤domaprohladno(4) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:42: Engine:Voice: Client asd829458(2) does listen to client all_mute(1)
06/27/2025 - 00:39:42: Engine:Voice: Client asd829458(2) does listen to client asd829458(2)
06/27/2025 - 00:39:42: Engine:Voice: Client asd829458(2) does listen to client dec4dence(4)
06/27/2025 - 00:39:42: Engine:Voice: Client asd829458(2) does listen to client мммолли(5)
06/27/2025 - 00:39:42: Voice: Listener однаждыебался(2) to Talker asd829458(5) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:42: Voice: Listener dec4dence(9) to Talker asd829458(5) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:42: Engine:Voice: Client dec4dence(4) does listen to client asd829458(2)
06/27/2025 - 00:39:42: Voice: Listener мммолли(7) to Talker asd829458(5) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:42: Engine:Voice: Client мммолли(5) does listen to client asd829458(2)
06/27/2025 - 00:39:42: Voice: Listener ПОКЛОНИСЬ БОГУ(3) to Talker asd829458(5) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:42: Voice: Listener 🖤domaprohladno(4) to Talker asd829458(5) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:42: PR:SetFullyJoinedServer 4:[U:1:153062474] true
06/27/2025 - 00:39:42: PR:SetLeaverStatus 4:[U:1:153062474] DOTA_LEAVER_NONE
06/27/2025 - 00:39:42: PR:SetConnectionState 4:[U:1:153062474] DOTA_CONNECTION_STATE_CONNECTED NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:42: L 06/27/2025 - 00:39:42: "Капитан Прах<10><[U:1:1837892499]><>" connected, address "5.142.214.195:55745"
06/27/2025 - 00:39:42: Client "Капитан Прах" connected (5.142.214.195:55745).
06/27/2025 - 00:39:43: PR:SetFullyJoinedServer 7:[U:1:1030433746] true
06/27/2025 - 00:39:43: PR:SetLeaverStatus 7:[U:1:1030433746] DOTA_LEAVER_NONE
06/27/2025 - 00:39:43: PR:SetConnectionState 7:[U:1:1030433746] DOTA_CONNECTION_STATE_CONNECTED NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:43: PR:SetFullyJoinedServer 3:[U:1:302197283] true
06/27/2025 - 00:39:43: PR:SetLeaverStatus 3:[U:1:302197283] DOTA_LEAVER_NONE
06/27/2025 - 00:39:43: PR:SetConnectionState 3:[U:1:302197283] DOTA_CONNECTION_STATE_CONNECTED NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:44: "Капитан Прах<10><[U:1:1837892499]><>" STEAM USERID validated
06/27/2025 - 00:39:44: L 06/27/2025 - 00:39:44: "Капитан Прах<10><[U:1:1837892499]><>" STEAM USERID validated
06/27/2025 - 00:39:44: OnClientAuthorized 1837892499
06/27/2025 - 00:39:44: L 06/27/2025 - 00:39:44: "✞Пилот Болида✞<11><[U:1:229840067]><>" connected, address "95.159.188.117:58141"
06/27/2025 - 00:39:44: Client "✞Пилот Болида✞" connected (95.159.188.117:58141).
06/27/2025 - 00:39:45: PR:SetFullyJoinedServer 2:[U:1:186085043] true
06/27/2025 - 00:39:45: PR:SetLeaverStatus 2:[U:1:186085043] DOTA_LEAVER_NONE
06/27/2025 - 00:39:45: PR:SetConnectionState 2:[U:1:186085043] DOTA_CONNECTION_STATE_CONNECTED NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:46: "✞Пилот Болида✞<11><[U:1:229840067]><>" STEAM USERID validated
06/27/2025 - 00:39:46: L 06/27/2025 - 00:39:46: "✞Пилот Болида✞<11><[U:1:229840067]><>" STEAM USERID validated
06/27/2025 - 00:39:46: OnClientAuthorized 229840067
06/27/2025 - 00:39:46: Unable to create object of type 2017
06/27/2025 - 00:39:48: L 06/27/2025 - 00:39:48: "Drochiomaru<12><[U:1:136893774]><>" connected, address "109.252.48.63:1067"
06/27/2025 - 00:39:48: Client "Drochiomaru" connected (109.252.48.63:1067).
06/27/2025 - 00:39:48: PR:SetFullyJoinedServer 5:[U:1:1909044259] true
06/27/2025 - 00:39:48: PR:SetLeaverStatus 5:[U:1:1909044259] DOTA_LEAVER_NONE
06/27/2025 - 00:39:48: PR:SetConnectionState 5:[U:1:1909044259] DOTA_CONNECTION_STATE_CONNECTED NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:49: "Drochiomaru<12><[U:1:136893774]><>" STEAM USERID validated
06/27/2025 - 00:39:49: L 06/27/2025 - 00:39:49: "Drochiomaru<12><[U:1:136893774]><>" STEAM USERID validated
06/27/2025 - 00:39:50: OnClientAuthorized 136893774
06/27/2025 - 00:39:50: Unable to create object of type 2017
06/27/2025 - 00:39:52: L 06/27/2025 - 00:39:52: "Капитан Прах<10><[U:1:1837892499]><Unassigned>" joined team "#DOTA_GoodGuys"
06/27/2025 - 00:39:52: I send request that player 1837892499 did connect first time? 1
06/27/2025 - 00:39:52: Loading time: 23.400001
06/27/2025 - 00:39:52: L 06/27/2025 - 00:39:52: "Капитан Прах<10><[U:1:1837892499]><>" entered the game
06/27/2025 - 00:39:52: PR:SetConnectionState 1:[U:1:1837892499] DOTA_CONNECTION_STATE_LOADING NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:52: Sending full update to Client Капитан Прах (Капитан Прах can't find frame from tick -1)
06/27/2025 - 00:39:53: Voice: Listener all_mute(6) to Talker Капитан Прах(1) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:53: Voice: Listener asd829458(5) to Talker Капитан Прах(1) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:53: Voice: Listener однаждыебался(2) to Talker Капитан Прах(1) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:53: Engine:Voice: Client однаждыебался(3) does listen to client Капитан Прах(8)
06/27/2025 - 00:39:53: Voice: Listener dec4dence(9) to Talker Капитан Прах(1) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:53: Voice: Listener мммолли(7) to Talker Капитан Прах(1) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:53: Voice: Listener ПОКЛОНИСЬ БОГУ(3) to Talker Капитан Прах(1) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:53: Engine:Voice: Client ПОКЛОНИСЬ БОГУ(6) does listen to client Капитан Прах(8)
06/27/2025 - 00:39:53: Voice: Listener 🖤domaprohladno(4) to Talker Капитан Прах(1) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:53: Engine:Voice: Client 🖤domaprohladno(7) does listen to client Капитан Прах(8)
06/27/2025 - 00:39:53: Voice: Listener Капитан Прах(1) to Talker all_mute(6) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:53: Voice: Listener Капитан Прах(1) to Talker asd829458(5) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:53: Voice: Listener Капитан Прах(1) to Talker однаждыебался(2) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:53: Voice: Listener Капитан Прах(1) to Talker dec4dence(9) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:53: Voice: Listener Капитан Прах(1) to Talker мммолли(7) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:53: Voice: Listener Капитан Прах(1) to Talker ПОКЛОНИСЬ БОГУ(3) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:53: Voice: Listener Капитан Прах(1) to Talker 🖤domaprohladno(4) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:53: Voice: Listener Капитан Прах(1) to Talker Капитан Прах(1) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:53: Engine:Voice: Client Капитан Прах(8) does listen to client однаждыебался(3)
06/27/2025 - 00:39:53: Engine:Voice: Client Капитан Прах(8) does listen to client ПОКЛОНИСЬ БОГУ(6)
06/27/2025 - 00:39:53: Engine:Voice: Client Капитан Прах(8) does listen to client 🖤domaprohladno(7)
06/27/2025 - 00:39:53: Engine:Voice: Client Капитан Прах(8) does listen to client Капитан Прах(8)
06/27/2025 - 00:39:54: L 06/27/2025 - 00:39:54: "✞Пилот Болида✞<11><[U:1:229840067]><Unassigned>" joined team "#DOTA_BadGuys"
06/27/2025 - 00:39:54: I send request that player 229840067 did connect first time? 1
06/27/2025 - 00:39:54: Loading time: 24.533334
06/27/2025 - 00:39:54: L 06/27/2025 - 00:39:54: "✞Пилот Болида✞<11><[U:1:229840067]><>" entered the game
06/27/2025 - 00:39:54: PR:SetConnectionState 8:[U:1:229840067] DOTA_CONNECTION_STATE_LOADING NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:54: Sending full update to Client ✞Пилот Болида✞ (✞Пилот Болида✞ can't find frame from tick -1)
06/27/2025 - 00:39:54: Voice: Listener all_mute(6) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:54: Engine:Voice: Client all_mute(1) does listen to client ✞Пилот Болида✞(9)
06/27/2025 - 00:39:54: Voice: Listener asd829458(5) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:54: Engine:Voice: Client asd829458(2) does listen to client ✞Пилот Болида✞(9)
06/27/2025 - 00:39:54: Voice: Listener однаждыебался(2) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:54: Voice: Listener dec4dence(9) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:54: Engine:Voice: Client dec4dence(4) does listen to client ✞Пилот Болида✞(9)
06/27/2025 - 00:39:54: Voice: Listener мммолли(7) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:54: Engine:Voice: Client мммолли(5) does listen to client ✞Пилот Болида✞(9)
06/27/2025 - 00:39:54: Voice: Listener ПОКЛОНИСЬ БОГУ(3) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:54: Voice: Listener 🖤domaprohladno(4) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:54: Voice: Listener Капитан Прах(1) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:54: Voice: Listener ✞Пилот Болида✞(8) to Talker all_mute(6) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:54: Voice: Listener ✞Пилот Болида✞(8) to Talker asd829458(5) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:54: Voice: Listener ✞Пилот Болида✞(8) to Talker однаждыебался(2) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:54: Voice: Listener ✞Пилот Болида✞(8) to Talker dec4dence(9) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:54: Voice: Listener ✞Пилот Болида✞(8) to Talker мммолли(7) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:54: Voice: Listener ✞Пилот Болида✞(8) to Talker ПОКЛОНИСЬ БОГУ(3) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:54: Voice: Listener ✞Пилот Болида✞(8) to Talker 🖤domaprohladno(4) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:54: Voice: Listener ✞Пилот Болида✞(8) to Talker Капитан Прах(1) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:54: Voice: Listener ✞Пилот Болида✞(8) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:54: Engine:Voice: Client ✞Пилот Болида✞(9) does listen to client all_mute(1)
06/27/2025 - 00:39:54: Engine:Voice: Client ✞Пилот Болида✞(9) does listen to client asd829458(2)
06/27/2025 - 00:39:54: Engine:Voice: Client ✞Пилот Болида✞(9) does listen to client dec4dence(4)
06/27/2025 - 00:39:54: Engine:Voice: Client ✞Пилот Болида✞(9) does listen to client мммолли(5)
06/27/2025 - 00:39:54: Engine:Voice: Client ✞Пилот Болида✞(9) does listen to client ✞Пилот Болида✞(9)
06/27/2025 - 00:39:55: L 06/27/2025 - 00:39:55: "Drochiomaru<12><[U:1:136893774]><Unassigned>" joined team "#DOTA_GoodGuys"
06/27/2025 - 00:39:55: I send request that player 136893774 did connect first time? 1
06/27/2025 - 00:39:55: Loading time: 25.966667
06/27/2025 - 00:39:55: L 06/27/2025 - 00:39:55: "Drochiomaru<12><[U:1:136893774]><>" entered the game
06/27/2025 - 00:39:55: PR:SetConnectionState 0:[U:1:136893774] DOTA_CONNECTION_STATE_LOADING NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:39:55: Sending full update to Client Drochiomaru (Drochiomaru can't find frame from tick -1)
06/27/2025 - 00:39:55: Voice: Listener all_mute(6) to Talker Drochiomaru(0) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:55: Voice: Listener asd829458(5) to Talker Drochiomaru(0) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:55: Voice: Listener однаждыебался(2) to Talker Drochiomaru(0) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:55: Engine:Voice: Client однаждыебался(3) does listen to client Drochiomaru(10)
06/27/2025 - 00:39:55: Voice: Listener dec4dence(9) to Talker Drochiomaru(0) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:55: Voice: Listener мммолли(7) to Talker Drochiomaru(0) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:55: Voice: Listener ПОКЛОНИСЬ БОГУ(3) to Talker Drochiomaru(0) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:55: Engine:Voice: Client ПОКЛОНИСЬ БОГУ(6) does listen to client Drochiomaru(10)
06/27/2025 - 00:39:55: Voice: Listener 🖤domaprohladno(4) to Talker Drochiomaru(0) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:55: Engine:Voice: Client 🖤domaprohladno(7) does listen to client Drochiomaru(10)
06/27/2025 - 00:39:55: Voice: Listener Капитан Прах(1) to Talker Drochiomaru(0) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:55: Engine:Voice: Client Капитан Прах(8) does listen to client Drochiomaru(10)
06/27/2025 - 00:39:55: Voice: Listener ✞Пилот Болида✞(8) to Talker Drochiomaru(0) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:55: Voice: Listener Drochiomaru(0) to Talker all_mute(6) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:55: Voice: Listener Drochiomaru(0) to Talker asd829458(5) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:55: Voice: Listener Drochiomaru(0) to Talker однаждыебался(2) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:55: Voice: Listener Drochiomaru(0) to Talker dec4dence(9) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:55: Voice: Listener Drochiomaru(0) to Talker мммолли(7) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:55: Voice: Listener Drochiomaru(0) to Talker ПОКЛОНИСЬ БОГУ(3) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:55: Voice: Listener Drochiomaru(0) to Talker 🖤domaprohladno(4) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:55: Voice: Listener Drochiomaru(0) to Talker Капитан Прах(1) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:55: Voice: Listener Drochiomaru(0) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 00:39:55: Voice: Listener Drochiomaru(0) to Talker Drochiomaru(0) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 00:39:55: Engine:Voice: Client Drochiomaru(10) does listen to client однаждыебался(3)
06/27/2025 - 00:39:55: Engine:Voice: Client Drochiomaru(10) does listen to client ПОКЛОНИСЬ БОГУ(6)
06/27/2025 - 00:39:55: Engine:Voice: Client Drochiomaru(10) does listen to client 🖤domaprohladno(7)
06/27/2025 - 00:39:55: Engine:Voice: Client Drochiomaru(10) does listen to client Капитан Прах(8)
06/27/2025 - 00:39:55: Engine:Voice: Client Drochiomaru(10) does listen to client Drochiomaru(10)
06/27/2025 - 00:39:59: PR:SetFullyJoinedServer 8:[U:1:229840067] true
06/27/2025 - 00:39:59: PR:SetLeaverStatus 8:[U:1:229840067] DOTA_LEAVER_NONE
06/27/2025 - 00:39:59: PR:SetConnectionState 8:[U:1:229840067] DOTA_CONNECTION_STATE_CONNECTED NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:40:01: PR:SetFullyJoinedServer 0:[U:1:136893774] true
06/27/2025 - 00:40:01: PR:SetLeaverStatus 0:[U:1:136893774] DOTA_LEAVER_NONE
06/27/2025 - 00:40:01: PR:SetConnectionState 0:[U:1:136893774] DOTA_CONNECTION_STATE_CONNECTED NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:40:02: PR:SetFullyJoinedServer 1:[U:1:1837892499] true
06/27/2025 - 00:40:02: PR:SetLeaverStatus 1:[U:1:1837892499] DOTA_LEAVER_NONE
06/27/2025 - 00:40:02: PR:SetConnectionState 1:[U:1:1837892499] DOTA_CONNECTION_STATE_CONNECTED NETWORK_DISCONNECT_INVALID
06/27/2025 - 00:40:06: Nominating hero by ssid=136893774] sid=136893774, pid=0
06/27/2025 - 00:40:06: Already suggested: 0
06/27/2025 - 00:40:07: S:Gamerules: entering state 'DOTA_GAMERULES_STATE_HERO_SELECTION'
06/27/2025 - 00:40:07: GameRules change to: 2
06/27/2025 - 00:40:07: GameRules change to: 2
06/27/2025 - 00:40:07: GameRules change to: 2
06/27/2025 - 00:40:07: PR:SetPossibleHeroSelection 9:[U:1:1209125835] npc_dota_hero_crystal_maiden(5)
06/27/2025 - 00:40:07: PR:SetPossibleHeroSelection 0:[U:1:136893774] npc_dota_hero_abaddon(102)
06/27/2025 - 00:40:07: PR:SetPossibleHeroSelection 1:[U:1:1837892499] npc_dota_hero_abaddon(102)
06/27/2025 - 00:40:07: PR:SetPossibleHeroSelection 5:[U:1:1909044259] npc_dota_hero_abaddon(102)
06/27/2025 - 00:40:07: PR:SetPossibleHeroSelection 4:[U:1:153062474] npc_dota_hero_chen(66)
06/27/2025 - 00:40:07: PR:SetPossibleHeroSelection 3:[U:1:302197283] npc_dota_hero_tidehunter(29)
06/27/2025 - 00:40:07: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_jakiro(64)
06/27/2025 - 00:40:07: PR:SetPossibleHeroSelection 8:[U:1:229840067] npc_dota_hero_abaddon(102)
06/27/2025 - 00:40:07: PR:SetPossibleHeroSelection 2:[U:1:186085043] npc_dota_hero_tidehunter(29)
06/27/2025 - 00:40:10: PR:SetPossibleHeroSelection 0:[U:1:136893774] npc_dota_hero_techies(105)
06/27/2025 - 00:40:10: Is banned? 0 npc_dota_hero_skeleton_king Wraith King
06/27/2025 - 00:40:11: asd829458: я керри, потому тихоньуо
06/27/2025 - 00:40:11: L 06/27/2025 - 00:40:11: "asd829458<4><[U:1:1909044259]><#DOTA_BadGuys>" say_team "я керри, потому тихоньуо"
06/27/2025 - 00:40:13: PR:SetPossibleHeroSelection 7:[U:1:1030433746] npc_dota_hero_techies(105)
06/27/2025 - 00:40:16: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_kunkka(23)
06/27/2025 - 00:40:16: PR:SetPossibleHeroSelection 8:[U:1:229840067] npc_dota_hero_pugna(45)
06/27/2025 - 00:40:16: PR:SetPossibleHeroSelection 5:[U:1:1909044259] npc_dota_hero_elder_titan(103)
06/27/2025 - 00:40:17: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_luna(48)
06/27/2025 - 00:40:17: PR:SetPossibleHeroSelection 7:[U:1:1030433746] npc_dota_hero_templar_assassin(46)
06/27/2025 - 00:40:17: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_medusa(94)
06/27/2025 - 00:40:21: PR:SetPossibleHeroSelection 2:[U:1:186085043] npc_dota_hero_puck(13)
06/27/2025 - 00:40:22: PR:SetPlayerReservedState 0:[U:1:136893774] true
06/27/2025 - 00:40:22: PR:SetSelectedHero 0:[U:1:136893774] npc_dota_hero_techies(105)
06/27/2025 - 00:40:23: PR:SetPossibleHeroSelection 2:[U:1:186085043] npc_dota_hero_dark_seer(55)
06/27/2025 - 00:40:24: PR:SetPlayerReservedState 8:[U:1:229840067] true
06/27/2025 - 00:40:24: PR:SetSelectedHero 8:[U:1:229840067] npc_dota_hero_pugna(45)
06/27/2025 - 00:40:26: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_undying(85)
06/27/2025 - 00:40:26: PR:SetPossibleHeroSelection 2:[U:1:186085043] npc_dota_hero_pudge(14)
06/27/2025 - 00:40:28: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_witch_doctor(30)
06/27/2025 - 00:40:30: PR:SetPossibleHeroSelection 4:[U:1:153062474] npc_dota_hero_skywrath_mage(101)
06/27/2025 - 00:40:36: PR:SetPossibleHeroSelection 3:[U:1:302197283] npc_dota_hero_winter_wyvern(112)
06/27/2025 - 00:40:36: PR:SetPlayerReservedState 2:[U:1:186085043] true
06/27/2025 - 00:40:36: PR:SetSelectedHero 2:[U:1:186085043] npc_dota_hero_pudge(14)
06/27/2025 - 00:40:37: PR:SetPossibleHeroSelection 3:[U:1:302197283] npc_dota_hero_vengefulspirit(20)
06/27/2025 - 00:40:39: PR:SetPlayerReservedState 7:[U:1:1030433746] true
06/27/2025 - 00:40:39: PR:SetSelectedHero 7:[U:1:1030433746] npc_dota_hero_templar_assassin(46)
06/27/2025 - 00:40:40: PR:SetPossibleHeroSelection 1:[U:1:1837892499] npc_dota_hero_zuus(22)
06/27/2025 - 00:40:41: PR:SetPossibleHeroSelection 3:[U:1:302197283] npc_dota_hero_terrorblade(109)
06/27/2025 - 00:40:41: PR:SetPossibleHeroSelection 5:[U:1:1909044259] npc_dota_hero_elder_titan(103)
06/27/2025 - 00:40:43: 🖤domaprohladno: 5
06/27/2025 - 00:40:43: L 06/27/2025 - 00:40:43: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "5"
06/27/2025 - 00:40:44: PR:SetPossibleHeroSelection 3:[U:1:302197283] npc_dota_hero_warlock(37)
06/27/2025 - 00:40:45: Drochiomaru: Iran forever
06/27/2025 - 00:40:45: L 06/27/2025 - 00:40:45: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "Iran forever"
06/27/2025 - 00:40:47: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_weaver(63)
06/27/2025 - 00:40:48: PR:SetPossibleHeroSelection 3:[U:1:302197283] npc_dota_hero_skeleton_king(42)
06/27/2025 - 00:40:49: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_ursa(70)
06/27/2025 - 00:40:50: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_undying(85)
06/27/2025 - 00:40:54: PR:SetPlayerReservedState 3:[U:1:302197283] true
06/27/2025 - 00:40:54: PR:SetSelectedHero 3:[U:1:302197283] npc_dota_hero_skeleton_king(42)
06/27/2025 - 00:40:58: PR:SetPlayerReservedState 5:[U:1:1909044259] true
06/27/2025 - 00:40:58: PR:SetSelectedHero 5:[U:1:1909044259] npc_dota_hero_elder_titan(103)
06/27/2025 - 00:40:59: PR:SetPossibleHeroSelection 4:[U:1:153062474] npc_dota_hero_disruptor(87)
06/27/2025 - 00:40:59: PR:SetPossibleHeroSelection 9:[U:1:1209125835] npc_dota_hero_windrunner(21)
06/27/2025 - 00:40:59: Капитан Прах: скай ты куда
06/27/2025 - 00:40:59: L 06/27/2025 - 00:40:59: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "скай ты куда"
06/27/2025 - 00:41:01: PR:SetPossibleHeroSelection 9:[U:1:1209125835] npc_dota_hero_windrunner(21)
06/27/2025 - 00:41:02: 🖤domaprohladno: 5
06/27/2025 - 00:41:02: L 06/27/2025 - 00:41:02: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "5"
06/27/2025 - 00:41:05: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_tusk(100)
06/27/2025 - 00:41:07: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_troll_warlord(95)
06/27/2025 - 00:41:07: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_treant(83)
06/27/2025 - 00:41:09: PR:SetPlayerReservedState 1:[U:1:1837892499] true
06/27/2025 - 00:41:09: PR:SetSelectedHero 1:[U:1:1837892499] npc_dota_hero_zuus(22)
06/27/2025 - 00:41:10: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_tinker(34)
06/27/2025 - 00:41:11: PR:SetPossibleHeroSelection 9:[U:1:1209125835] npc_dota_hero_windrunner(21)
06/27/2025 - 00:41:13: PR:SetPlayerReservedState 9:[U:1:1209125835] true
06/27/2025 - 00:41:13: PR:SetSelectedHero 9:[U:1:1209125835] npc_dota_hero_windrunner(21)
06/27/2025 - 00:41:14: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_storm_spirit(17)
06/27/2025 - 00:41:15: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_spirit_breaker(71)
06/27/2025 - 00:41:17: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_spirit_breaker(71)
06/27/2025 - 00:41:20: PR:SetPossibleHeroSelection 4:[U:1:153062474] npc_dota_hero_bane(3)
06/27/2025 - 00:41:21: PR:SetPossibleHeroSelection 4:[U:1:153062474] npc_dota_hero_disruptor(87)
06/27/2025 - 00:41:21: PR:SetPossibleHeroSelection 4:[U:1:153062474] npc_dota_hero_bane(3)
06/27/2025 - 00:41:22: PR:SetPossibleHeroSelection 4:[U:1:153062474] npc_dota_hero_disruptor(87)
06/27/2025 - 00:41:26: Капитан Прах: ?
06/27/2025 - 00:41:26: L 06/27/2025 - 00:41:26: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "?"
06/27/2025 - 00:41:27: PR:SetPlayerReservedState 4:[U:1:153062474] true
06/27/2025 - 00:41:27: PR:SetSelectedHero 4:[U:1:153062474] npc_dota_hero_disruptor(87)
06/27/2025 - 00:41:35: Drochiomaru: аллах на травелах, слышал?
06/27/2025 - 00:41:35: L 06/27/2025 - 00:41:35: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "аллах на травелах, слышал?"
06/27/2025 - 00:41:36: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_tusk(100)
06/27/2025 - 00:41:37: PR:SetPossibleHeroSelection 6:[U:1:322449174] npc_dota_hero_undying(85)
06/27/2025 - 00:41:38: PR:SetPlayerReservedState 6:[U:1:322449174] true
06/27/2025 - 00:41:38: PR:SetSelectedHero 6:[U:1:322449174] npc_dota_hero_undying(85)
06/27/2025 - 00:41:40: MDLCache: Failed load of .VVD data for heroes/dark_seer/dark_seer.mdl
06/27/2025 - 00:41:40: MDLCache: Failed load of .VVD data for heroes/dark_seer/dark_seer_head.mdl
06/27/2025 - 00:41:40: MDLCache: Failed load of .VVD data for heroes/dark_seer/dark_seer_arm.mdl
06/27/2025 - 00:41:40: MDLCache: Failed load of .VVD data for items/dark_seer/aqwanderer_legs/aqwanderer_legs.mdl
06/27/2025 - 00:41:40: MDLCache: Failed load of .VVD data for heroes/dark_seer/dark_seer_neck.mdl
06/27/2025 - 00:41:40: MDLCache: Failed load of .VVD data for heroes/dark_seer/dark_seer_back.mdl
06/27/2025 - 00:41:40: S:Gamerules: entering state 'DOTA_GAMERULES_STATE_STRATEGY_TIME'
06/27/2025 - 00:41:40: GameRules change to: 3
06/27/2025 - 00:41:40: GameRules change to: 3
06/27/2025 - 00:41:40: GameRules change to: 3
06/27/2025 - 00:41:40: S:Gamerules: entering state 'DOTA_GAMERULES_STATE_PRE_GAME'
06/27/2025 - 00:41:40: m_flPreGameStartTime set to 132.10
06/27/2025 - 00:41:40: m_flStateTransitionTime set to 222.10
06/27/2025 - 00:41:40: GameRules change to: 4
06/27/2025 - 00:41:40: Enabling pause back: game started
06/27/2025 - 00:41:40: GameRules change to: 4
06/27/2025 - 00:41:40: GameRules change to: 4
06/27/2025 - 00:41:40: MDLCache: Failed load of .VVD data for creeps/roshan/roshan.mdl
06/27/2025 - 00:41:40: Капитан Прах: я зевс
06/27/2025 - 00:41:40: L 06/27/2025 - 00:41:40: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "я зевс"
06/27/2025 - 00:41:41: PR:SetPlayerReservedState 8:[U:1:229840067] false
06/27/2025 - 00:41:41: MDLCache: Failed load of .VVD data for heroes/pugna/pugna.mdl
06/27/2025 - 00:41:41: MDLCache: Failed load of .VVD data for heroes/pugna/pugna_ward.mdl
06/27/2025 - 00:41:41: MDLCache: Failed load of .VVD data for items/pugna/nether_grandmasters_bite/nether_grandmasters_bite.mdl
06/27/2025 - 00:41:41: MDLCache: Failed load of .VVD data for heroes/pugna/pugna_cape.mdl
06/27/2025 - 00:41:41: MDLCache: Failed load of .VVD data for heroes/pugna/pugna_head.mdl
06/27/2025 - 00:41:41: MDLCache: Failed load of .VVD data for heroes/pugna/pugna_belt.mdl
06/27/2025 - 00:41:41: MDLCache: Failed load of .VVD data for heroes/pugna/pugna_bracers.mdl
06/27/2025 - 00:41:41: MDLCache: Failed load of .VVD data for heroes/pugna/pugna_shoulder.mdl
06/27/2025 - 00:41:41: MDLCache: Failed load of .VVD data for items/pugna/ward/draining_wight/draining_wight.mdl
06/27/2025 - 00:41:41: PR:SetPlayerReservedState 8:[U:1:229840067] false
06/27/2025 - 00:41:41: PR:SetSelectedHero 8:[U:1:229840067] npc_dota_hero_pugna(45)
06/27/2025 - 00:41:42: PR:SetPlayerReservedState 0:[U:1:136893774] false
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/techies/techies.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/techies/techies_spleen_weapon.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/techies/techies_squee_costume.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/techies/techies_barrel.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/techies/techies_spleen_costume.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/techies/techies_cart.mdl
06/27/2025 - 00:41:42: PR:SetPlayerReservedState 0:[U:1:136893774] false
06/27/2025 - 00:41:42: PR:SetSelectedHero 0:[U:1:136893774] npc_dota_hero_techies(105)
06/27/2025 - 00:41:42: PR:SetPlayerReservedState 6:[U:1:322449174] false
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/undying/undying.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/undying/undying_flesh_golem.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/undying/undying_helmet.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/undying/undying_armor.mdl
06/27/2025 - 00:41:42: PR:SetPlayerReservedState 6:[U:1:322449174] false
06/27/2025 - 00:41:42: PR:SetSelectedHero 6:[U:1:322449174] npc_dota_hero_undying(85)
06/27/2025 - 00:41:42: PR:SetPlayerReservedState 4:[U:1:153062474] false
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/Disruptor/disruptor.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for items/wards/ward_bramble_snatch/ward_bramble_snatch.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for items/courier/waldi_the_faithful/waldi_the_faithful.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for items/courier/waldi_the_faithful/waldi_the_faithful_flying.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/Disruptor/weapon.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/Disruptor/hair.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/Disruptor/shoulder.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/Disruptor/back.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/Disruptor/bracers.mdl
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/Disruptor/mount.mdl
06/27/2025 - 00:41:42: PR:SetPlayerReservedState 4:[U:1:153062474] false
06/27/2025 - 00:41:42: PR:SetSelectedHero 4:[U:1:153062474] npc_dota_hero_disruptor(87)
06/27/2025 - 00:41:42: PR:SetPlayerReservedState 3:[U:1:302197283] false
06/27/2025 - 00:41:42: MDLCache: Failed load of .VVD data for heroes/wraith_king/wraith_king.mdl
06/27/2025 - 00:41:43: MDLCache: Failed load of .VVD data for items/wraith_king/the_blood_shard/the_blood_shard.mdl
06/27/2025 - 00:41:43: MDLCache: Failed load of .VVD data for heroes/wraith_king/wraith_king_head.mdl
06/27/2025 - 00:41:43: MDLCache: Failed load of .VVD data for heroes/wraith_king/wraith_king_cape.mdl
06/27/2025 - 00:41:43: MDLCache: Failed load of .VVD data for heroes/wraith_king/wraith_king_shoulder.mdl
06/27/2025 - 00:41:43: MDLCache: Failed load of .VVD data for heroes/wraith_king/wraith_king_gauntlet.mdl
06/27/2025 - 00:41:43: MDLCache: Failed load of .VVD data for heroes/wraith_king/wraith_king_chest.mdl
06/27/2025 - 00:41:43: PR:SetPlayerReservedState 3:[U:1:302197283] false
06/27/2025 - 00:41:43: PR:SetSelectedHero 3:[U:1:302197283] npc_dota_hero_skeleton_king(42)
06/27/2025 - 00:41:43: PR:SetPlayerReservedState 1:[U:1:1837892499] false
06/27/2025 - 00:41:43: MDLCache: Failed load of .VVD data for heroes/zuus/zuus.mdl
06/27/2025 - 00:41:43: PR:SetPlayerReservedState 1:[U:1:1837892499] false
06/27/2025 - 00:41:43: PR:SetSelectedHero 1:[U:1:1837892499] npc_dota_hero_zuus(22)
06/27/2025 - 00:41:44: PR:SetPlayerReservedState 7:[U:1:1030433746] false
06/27/2025 - 00:41:44: MDLCache: Failed load of .VVD data for heroes/lanaya/lanaya.mdl
06/27/2025 - 00:41:45: MDLCache: Failed load of .VVD data for heroes/witchdoctor/witchdoctor_ward.mdl
06/27/2025 - 00:41:45: MDLCache: Failed load of .VVD data for heroes/lanaya/lanaya_hair.mdl
06/27/2025 - 00:41:45: MDLCache: Failed load of .VVD data for heroes/lanaya/lanaya_cowl_shoulder.mdl
06/27/2025 - 00:41:45: MDLCache: Failed load of .VVD data for heroes/lanaya/lanaya_bracers_skirt.mdl
06/27/2025 - 00:41:45: PR:SetPlayerReservedState 7:[U:1:1030433746] false
06/27/2025 - 00:41:45: PR:SetSelectedHero 7:[U:1:1030433746] npc_dota_hero_templar_assassin(46)
06/27/2025 - 00:41:46: PR:SetPlayerReservedState 2:[U:1:186085043] false
06/27/2025 - 00:41:46: MDLCache: Failed load of .VVD data for heroes/pudge/pudge.mdl
06/27/2025 - 00:41:46: MDLCache: Failed load of .VVD data for items/pudge/bogatyr_pudge_weapon_lv/bogatyr_pudge_weapon_lv.mdl
06/27/2025 - 00:41:46: MDLCache: Failed load of .VVD data for items/pudge/bogatyr_pudge_head/bogatyr_pudge_head.mdl
06/27/2025 - 00:41:46: MDLCache: Failed load of .VVD data for items/pudge/bogatyr_pudge_offhand_lv/bogatyr_pudge_offhand_lv.mdl
06/27/2025 - 00:41:46: MDLCache: Failed load of .VVD data for items/pudge/bogatyr_pudge_arms_lv/bogatyr_pudge_arms_lv.mdl
06/27/2025 - 00:41:46: MDLCache: Failed load of .VVD data for items/pudge/bogatyr_pudge_shoulder_lv/bogatyr_pudge_shoulder_lv.mdl
06/27/2025 - 00:41:46: MDLCache: Failed load of .VVD data for heroes/pudge/back.mdl
06/27/2025 - 00:41:46: MDLCache: Failed load of .VVD data for items/pudge/bogatyr_pudge_belt_lv/bogatyr_pudge_belt_lv.mdl
06/27/2025 - 00:41:46: PR:SetPlayerReservedState 2:[U:1:186085043] false
06/27/2025 - 00:41:46: PR:SetSelectedHero 2:[U:1:186085043] npc_dota_hero_pudge(14)
06/27/2025 - 00:41:46: PR:SetPlayerReservedState 9:[U:1:1209125835] false
06/27/2025 - 00:41:46: MDLCache: Failed load of .VVD data for heroes/windrunner/windrunner.mdl
06/27/2025 - 00:41:46: MDLCache: Failed load of .VVD data for heroes/windrunner/windrunner_bow.mdl
06/27/2025 - 00:41:46: MDLCache: Failed load of .VVD data for heroes/windrunner/windrunner_head.mdl
06/27/2025 - 00:41:46: MDLCache: Failed load of .VVD data for heroes/windrunner/windrunner_cape.mdl
06/27/2025 - 00:41:46: MDLCache: Failed load of .VVD data for heroes/windrunner/windrunner_shoulderpads.mdl
06/27/2025 - 00:41:46: MDLCache: Failed load of .VVD data for heroes/windrunner/windrunner_quiver.mdl
06/27/2025 - 00:41:46: PR:SetPlayerReservedState 9:[U:1:1209125835] false
06/27/2025 - 00:41:46: PR:SetSelectedHero 9:[U:1:1209125835] npc_dota_hero_windrunner(21)
06/27/2025 - 00:41:48: PR:SetPlayerReservedState 5:[U:1:1909044259] false
06/27/2025 - 00:41:48: MDLCache: Failed load of .VVD data for heroes/elder_titan/elder_titan.mdl
06/27/2025 - 00:41:48: MDLCache: Failed load of .VVD data for heroes/elder_titan/ancestral_spirit.mdl
06/27/2025 - 00:41:48: MDLCache: Failed load of .VVD data for heroes/elder_titan/elder_titan_hammer.mdl
06/27/2025 - 00:41:48: MDLCache: Failed load of .VVD data for heroes/elder_titan/elder_titan_hair.mdl
06/27/2025 - 00:41:48: MDLCache: Failed load of .VVD data for heroes/elder_titan/elder_titan_totem.mdl
06/27/2025 - 00:41:48: MDLCache: Failed load of .VVD data for heroes/elder_titan/elder_titan_shoulder.mdl
06/27/2025 - 00:41:48: MDLCache: Failed load of .VVD data for heroes/elder_titan/elder_titan_bracer.mdl
06/27/2025 - 00:41:48: PR:SetPlayerReservedState 5:[U:1:1909044259] false
06/27/2025 - 00:41:48: PR:SetSelectedHero 5:[U:1:1909044259] npc_dota_hero_elder_titan(103)
06/27/2025 - 00:41:51: однаждыебался: могу дать фарм
06/27/2025 - 00:41:51: L 06/27/2025 - 00:41:51: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team "могу дать фарм"
06/27/2025 - 00:41:55: 🖤domaprohladno: я хотиел
06/27/2025 - 00:41:55: L 06/27/2025 - 00:41:55: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "я хотиел"
06/27/2025 - 00:41:56: 🖤domaprohladno: но таких нет
06/27/2025 - 00:41:56: L 06/27/2025 - 00:41:56: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "но таких нет"
06/27/2025 - 00:41:59: 🖤domaprohladno: кроме оракла трешового
06/27/2025 - 00:41:59: L 06/27/2025 - 00:41:59: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "кроме оракла трешового"
06/27/2025 - 00:42:15: 🖤domaprohladno: норм по идее
06/27/2025 - 00:42:15: L 06/27/2025 - 00:42:15: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "норм по идее"
06/27/2025 - 00:42:15: Drochiomaru: нормальный
06/27/2025 - 00:42:15: L 06/27/2025 - 00:42:15: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "нормальный"
06/27/2025 - 00:42:16: 🖤domaprohladno: через радик
06/27/2025 - 00:42:16: L 06/27/2025 - 00:42:16: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "через радик"
06/27/2025 - 00:42:23: однаждыебался: так, че кто на топ со мной
06/27/2025 - 00:42:23: L 06/27/2025 - 00:42:23: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team "так, че кто на топ со мной"
06/27/2025 - 00:42:26: MDLCache: Failed load of .VVD data for heroes/techies/fx_techiesfx_mine.mdl
06/27/2025 - 00:42:28: Капитан Прах: блудшардич
06/27/2025 - 00:42:28: L 06/27/2025 - 00:42:28: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "блудшардич"
06/27/2025 - 00:42:33: Drochiomaru: та норм
06/27/2025 - 00:42:33: L 06/27/2025 - 00:42:33: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "та норм"
06/27/2025 - 00:42:49: 🖤domaprohladno: та у нас в миду наестся ща чел
06/27/2025 - 00:42:49: L 06/27/2025 - 00:42:49: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "та у нас в миду наестся ща чел"
06/27/2025 - 00:43:00: dec4dence: а куру
06/27/2025 - 00:43:00: L 06/27/2025 - 00:43:00: "dec4dence<6><[U:1:1209125835]><#DOTA_BadGuys>" say_team "а куру"
06/27/2025 - 00:43:03: мммолли: заминировал гад
06/27/2025 - 00:43:03: L 06/27/2025 - 00:43:03: "мммолли<7><[U:1:1030433746]><#DOTA_BadGuys>" say_team "заминировал гад"
06/27/2025 - 00:43:07: Капитан Прах: я плохой мидер
06/27/2025 - 00:43:07: L 06/27/2025 - 00:43:07: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "я плохой мидер"
06/27/2025 - 00:43:10: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:43:11: S:Gamerules: entering state 'DOTA_GAMERULES_STATE_GAME_IN_PROGRESS'
06/27/2025 - 00:43:11: GameRules change to: 5
06/27/2025 - 00:43:11: GameRules change to: 5
06/27/2025 - 00:43:11: GameRules change to: 5
06/27/2025 - 00:43:11: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:43:11: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:43:11: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:43:11: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:43:11: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:43:11: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:43:11: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:43:11: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:43:25: Drochiomaru: анлак
06/27/2025 - 00:43:25: L 06/27/2025 - 00:43:25: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "анлак"
06/27/2025 - 00:43:26: Капитан Прах: я могу пуджу отдать
06/27/2025 - 00:43:26: L 06/27/2025 - 00:43:26: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "я могу пуджу отдать"
06/27/2025 - 00:43:30: однаждыебался: не
06/27/2025 - 00:43:30: L 06/27/2025 - 00:43:30: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team "не"
06/27/2025 - 00:43:38: 🖤domaprohladno: да они ники прячут заебали
06/27/2025 - 00:43:38: L 06/27/2025 - 00:43:38: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "да они ники прячут заебали"
06/27/2025 - 00:43:51: Game code tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:44:10: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:44:10: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:44:20: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:44:26: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:44:30: 🖤domaprohladno: +
06/27/2025 - 00:44:30: L 06/27/2025 - 00:44:30: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "+"
06/27/2025 - 00:44:36: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:44:36: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:44:47: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:44:47: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:44:55: MDLCache: Failed load of .VVD data for heroes/undying/undying_tower.mdl
06/27/2025 - 00:44:55: MDLCache: Failed load of .VVD data for heroes/undying/undying_minion_torso.mdl
06/27/2025 - 00:44:55: Game code tried to execute invalid order (14). Unit does not have enough mana to cast ability.
06/27/2025 - 00:44:58: MDLCache: Failed load of .VVD data for heroes/undying/undying_minion.mdl
06/27/2025 - 00:45:10: MDLCache: Failed load of .VVD data for heroes/techies/techies_sign.mdl
06/27/2025 - 00:45:19: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:45:19: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:45:20: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:45:20: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:45:20: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:45:20: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:45:21: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:45:23: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:45:29: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:45:40: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:45:44: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:45:51: 🖤domaprohladno: 1 лвла
06/27/2025 - 00:45:51: L 06/27/2025 - 00:45:51: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "1 лвла"
06/27/2025 - 00:45:52: 🖤domaprohladno: не достанет
06/27/2025 - 00:45:52: L 06/27/2025 - 00:45:52: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "не достанет"
06/27/2025 - 00:45:59: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:46:17: Drochiomaru: там такая торпеда на пудже)
06/27/2025 - 00:46:17: L 06/27/2025 - 00:46:17: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "там такая торпеда на пудже)"
06/27/2025 - 00:46:19: 🖤domaprohladno: я буду 1 качать он тут ебнуто дамажит
06/27/2025 - 00:46:19: L 06/27/2025 - 00:46:19: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "я буду 1 качать он тут ебнуто дамажит"
06/27/2025 - 00:46:23: 🖤domaprohladno: можно солить с ним бегать
06/27/2025 - 00:46:23: L 06/27/2025 - 00:46:23: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "можно солить с ним бегать"
06/27/2025 - 00:46:30: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:46:30: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:46:31: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:46:31: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:46:48: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:46:48: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:46:50: Drochiomaru: без слотов стоит
06/27/2025 - 00:46:50: L 06/27/2025 - 00:46:50: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "без слотов стоит"
06/27/2025 - 00:46:51: Drochiomaru: ))
06/27/2025 - 00:46:51: L 06/27/2025 - 00:46:51: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "))"
06/27/2025 - 00:46:56: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 00:46:56:  Ability: undying_decay
06/27/2025 - 00:47:09: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:47:09: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:47:09: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:47:11: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:47:11: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:47:15: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:47:19: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:47:19: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:47:20: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 00:47:20:  Ability: undying_decay
06/27/2025 - 00:47:20: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:47:20: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:47:29: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:47:29: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:47:29: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:47:36: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:47:36: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 00:47:36:  Ability: disruptor_thunder_strike
06/27/2025 - 00:47:48: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:47:48: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:47:57: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:47:57: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:48:03: Drochiomaru: без мозгов он играет
06/27/2025 - 00:48:03: L 06/27/2025 - 00:48:03: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "без мозгов он играет"
06/27/2025 - 00:48:05: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:48:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:48:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:48:07: Client tried to execute invalid order (14). Unit does not have enough mana to cast ability.
06/27/2025 - 00:48:09: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:48:21: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:48:21: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:48:21: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:48:31: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:48:31: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:48:43: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:48:43: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:48:54: Drochiomaru: апнешь?
06/27/2025 - 00:48:54: L 06/27/2025 - 00:48:54: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "апнешь?"
06/27/2025 - 00:49:08: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:49:10: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:49:13: 🖤domaprohladno: чувак отводит
06/27/2025 - 00:49:13: L 06/27/2025 - 00:49:13: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "чувак отводит"
06/27/2025 - 00:49:17: 🖤domaprohladno: чтобы нас задавили
06/27/2025 - 00:49:17: L 06/27/2025 - 00:49:17: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "чтобы нас задавили"
06/27/2025 - 00:49:19: 🖤domaprohladno: но повезло
06/27/2025 - 00:49:19: L 06/27/2025 - 00:49:19: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "но повезло"
06/27/2025 - 00:49:23: Drochiomaru: кто нас задайвит?
06/27/2025 - 00:49:23: L 06/27/2025 - 00:49:23: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "кто нас задайвит?"
06/27/2025 - 00:49:27: Drochiomaru: они умирают если дайвят
06/27/2025 - 00:49:27: L 06/27/2025 - 00:49:27: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "они умирают если дайвят"
06/27/2025 - 00:49:33: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:49:33: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:49:33: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:49:34: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:49:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:49:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:49:41: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:49:41: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:49:42: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:49:42: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:49:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:49:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:49:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:49:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:49:47: 🖤domaprohladno: я ее засолю с 6 щас
06/27/2025 - 00:49:47: L 06/27/2025 - 00:49:47: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "я ее засолю с 6 щас"
06/27/2025 - 00:49:50: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:49:50: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:50:03: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:50:03: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:50:04: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:50:04: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 00:50:14: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:50:20: Drochiomaru: )
06/27/2025 - 00:50:20: L 06/27/2025 - 00:50:20: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team ")"
06/27/2025 - 00:50:21: Drochiomaru: уебан
06/27/2025 - 00:50:21: L 06/27/2025 - 00:50:21: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "уебан"
06/27/2025 - 00:50:45: Game code tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:51:03: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:51:03: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:51:03: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:51:03: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:51:07: Client tried to execute invalid order (14). Unit does not have enough mana to cast ability.
06/27/2025 - 00:51:14: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:51:14: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:51:14: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:51:18: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:51:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:51:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:51:22: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:22: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:22: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:22: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:24: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:24: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:25: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:25: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:25: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:51:25: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:51:25: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:51:26: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:26: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:26: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:26: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:27: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:27: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:27: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:27: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:28: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:28: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:28: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:28: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:28: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:28: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:30: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:30: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:30: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:30: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:30: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:30: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:31: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:31: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:31: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:51:32: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:32: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:32: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:32: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:33: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:33: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:33: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:33: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:34: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:34: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:35: Game code tried to execute invalid order (14). Unit does not have enough mana to cast ability.
06/27/2025 - 00:51:36: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:36: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:51:37: Client tried to execute invalid order (61). Item is still in cooldown.
06/27/2025 - 00:51:37:  Ability: item_magic_wand
06/27/2025 - 00:51:42: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:51:47: Game code tried to execute invalid order (14). Unit does not have enough mana to cast ability.
06/27/2025 - 00:51:47: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:51:47: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:51:49: Client tried to execute invalid order (23). Can't attack target, target is attack immune.
06/27/2025 - 00:52:16: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:52:16: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:52:41: 🖤domaprohladno: получите
06/27/2025 - 00:52:41: L 06/27/2025 - 00:52:41: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "получите"
06/27/2025 - 00:52:42: 🖤domaprohladno: 6 лвла
06/27/2025 - 00:52:42: L 06/27/2025 - 00:52:42: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "6 лвла"
06/27/2025 - 00:52:48: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:52:48: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:53:01: tips left: 8 3
06/27/2025 - 00:53:01: reduce tips left: 8 3
06/27/2025 - 00:53:02: Drochiomaru: с
06/27/2025 - 00:53:02: L 06/27/2025 - 00:53:02: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "с"
06/27/2025 - 00:53:03: Drochiomaru: спс
06/27/2025 - 00:53:03: L 06/27/2025 - 00:53:03: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "спс"
06/27/2025 - 00:53:12: 🖤domaprohladno: С сентрями и дастами
06/27/2025 - 00:53:12: L 06/27/2025 - 00:53:12: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "С сентрями и дастами"
06/27/2025 - 00:53:14: 🖤domaprohladno: только
06/27/2025 - 00:53:14: L 06/27/2025 - 00:53:14: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "только"
06/27/2025 - 00:53:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:53:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:53:26: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:53:30: 🖤domaprohladno: у меня же не 150 с тычки
06/27/2025 - 00:53:30: L 06/27/2025 - 00:53:30: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "у меня же не 150 с тычки"
06/27/2025 - 00:53:31: 🖤domaprohladno: ты шо
06/27/2025 - 00:53:31: L 06/27/2025 - 00:53:31: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "ты шо"
06/27/2025 - 00:53:34: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:53:34: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:53:50: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:53:50: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:53:54: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:53:54: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:53:54: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:53:56: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 00:53:56:  Ability: disruptor_thunder_strike
06/27/2025 - 00:54:01: Client tried to execute invalid order (61). Item is still in cooldown.
06/27/2025 - 00:54:01:  Ability: item_magic_wand
06/27/2025 - 00:54:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:54:14: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:54:19: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:54:19: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:54:35: 🖤domaprohladno: не сольется же стрик об тавер не?
06/27/2025 - 00:54:35: L 06/27/2025 - 00:54:35: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "не сольется же стрик об тавер не?"
06/27/2025 - 00:54:38: 🖤domaprohladno: надо чтобы с героями
06/27/2025 - 00:54:38: L 06/27/2025 - 00:54:38: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "надо чтобы с героями"
06/27/2025 - 00:54:49: 🖤domaprohladno: там криты
06/27/2025 - 00:54:49: L 06/27/2025 - 00:54:49: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "там криты"
06/27/2025 - 00:54:49: 🖤domaprohladno: гучи
06/27/2025 - 00:54:49: L 06/27/2025 - 00:54:49: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "гучи"
06/27/2025 - 00:54:59: Drochiomaru: на та даун
06/27/2025 - 00:54:59: L 06/27/2025 - 00:54:59: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "на та даун"
06/27/2025 - 00:55:06: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:55:06: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:55:09: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 00:55:09:  Ability: elder_titan_echo_stomp
06/27/2025 - 00:55:15: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 00:55:15:  Ability: undying_tombstone
06/27/2025 - 00:55:18: Client tried to execute invalid order (61). Item is still in cooldown.
06/27/2025 - 00:55:18:  Ability: item_arcane_boots
06/27/2025 - 00:55:19: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:55:19: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:55:19: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:55:19: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:55:30: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:55:30: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 00:55:39: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:55:39: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:55:39: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:55:39: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:56:04: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:56:15: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:56:16: Drochiomaru: пугна снимает
06/27/2025 - 00:56:16: L 06/27/2025 - 00:56:16: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "пугна снимает"
06/27/2025 - 00:56:37: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 00:56:37:  Ability: disruptor_thunder_strike
06/27/2025 - 00:56:38: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:56:38: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:56:38: MDLCache: Failed load of .VVD data for heroes/techies/fx_techies_remotebomb.mdl
06/27/2025 - 00:56:40: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 00:56:40: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 00:56:41: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 00:56:42: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:56:42: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:57:05: 🖤domaprohladno: могу вейл могу даггер
06/27/2025 - 00:57:05: L 06/27/2025 - 00:57:05: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "могу вейл могу даггер"
06/27/2025 - 00:57:11: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 00:57:11:  Ability: pugna_nether_blast
06/27/2025 - 00:57:18: 🖤domaprohladno: есть 
06/27/2025 - 00:57:18: L 06/27/2025 - 00:57:18: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "есть "
06/27/2025 - 00:57:20: 🖤domaprohladno: смысл от раннего
06/27/2025 - 00:57:20: L 06/27/2025 - 00:57:20: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "смысл от раннего"
06/27/2025 - 00:57:21: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 00:57:21:  Ability: windrunner_windrun
06/27/2025 - 00:57:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:57:23: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:23: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:23: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:23: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:24: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:24: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:25: Client tried to execute invalid order (61). Item is still in cooldown.
06/27/2025 - 00:57:25:  Ability: item_magic_wand
06/27/2025 - 00:57:26: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 00:57:26:  Ability: undying_decay
06/27/2025 - 00:57:39: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:57:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:53: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:57:53: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:57:53: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:57:53: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:57:53: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:57:53: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:57:53: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:57:54: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:54: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:54: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:54: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:57: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:57: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:57: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:57:57: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:58:09: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:58:14: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:58:14: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:58:14: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:58:14: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:58:24: Drochiomaru: а хули 200
06/27/2025 - 00:58:24: L 06/27/2025 - 00:58:24: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "а хули 200"
06/27/2025 - 00:58:25: Drochiomaru: за нее
06/27/2025 - 00:58:25: L 06/27/2025 - 00:58:25: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "за нее"
06/27/2025 - 00:58:30: 🖤domaprohladno: 1-1 кда
06/27/2025 - 00:58:30: L 06/27/2025 - 00:58:30: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "1-1 кда"
06/27/2025 - 00:58:34: Drochiomaru: мидер
06/27/2025 - 00:58:34: L 06/27/2025 - 00:58:34: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "мидер"
06/27/2025 - 00:58:40: Drochiomaru: смешно
06/27/2025 - 00:58:40: L 06/27/2025 - 00:58:40: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "смешно"
06/27/2025 - 00:58:47: 🖤domaprohladno: стрика нет потому что
06/27/2025 - 00:58:47: L 06/27/2025 - 00:58:47: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "стрика нет потому что"
06/27/2025 - 00:58:54: MDLCache: Failed load of .VVD data for heroes/lanaya/lanaya_trap_crystal_invis.mdl
06/27/2025 - 00:58:54: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 00:58:54:  Ability: templar_assassin_psionic_trap
06/27/2025 - 00:58:57: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 00:58:58: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 00:58:58: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 00:58:58: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 00:59:04: tips left: 8 2
06/27/2025 - 00:59:04: reduce tips left: 8 2
06/27/2025 - 00:59:09: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:59:09: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:59:12: Drochiomaru: тут играй
06/27/2025 - 00:59:12: L 06/27/2025 - 00:59:12: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "тут играй"
06/27/2025 - 00:59:33: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:59:39: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 00:59:39:  Ability: pugna_nether_blast
06/27/2025 - 00:59:40: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 00:59:41: MDLCache: Failed load of .VVD data for heroes/techies/fx_techiesfx_stasis.mdl
06/27/2025 - 00:59:42: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:59:49: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:59:50: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:59:50: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 00:59:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:59:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 00:59:52: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:59:52: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 00:59:52: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:00:06: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:06: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:06: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:06: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:06: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:06: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:06: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:06: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:06: Sending full update to Client Капитан Прах (Капитан Прах can't find frame from tick -1)
06/27/2025 - 01:00:07: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:07: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:07: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:07: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:07: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:07: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:07: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:07: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:08: Client tried to execute invalid order (2). Specified ability is not actually an ability.
06/27/2025 - 01:00:10: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:00:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:12: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:00:12: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:12: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:12: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:13: Drochiomaru: 3
06/27/2025 - 01:00:13: L 06/27/2025 - 01:00:13: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "3"
06/27/2025 - 01:00:15: Drochiomaru: 900 урона
06/27/2025 - 01:00:15: L 06/27/2025 - 01:00:15: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "900 урона"
06/27/2025 - 01:00:22: Drochiomaru: ~
06/27/2025 - 01:00:22: L 06/27/2025 - 01:00:22: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "~"
06/27/2025 - 01:00:23: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:23: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:00:29: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:00:29: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:00:29: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:00:29: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:00:33: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:33: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:33: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:39: MDLCache: Failed load of .VVD data for creeps/neutral_creeps/n_creep_troll_skeleton/n_creep_skeleton_melee.mdl
06/27/2025 - 01:00:39: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:00:39: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:00:39: Drochiomaru: 1
06/27/2025 - 01:00:39: L 06/27/2025 - 01:00:39: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "1"
06/27/2025 - 01:00:39: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:00:39: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:00:39: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:00:39: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:00:39: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:00:39: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:00:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:00:45: Капитан Прах: плакич тогда
06/27/2025 - 01:00:45: L 06/27/2025 - 01:00:45: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "плакич тогда"
06/27/2025 - 01:00:54: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:00:54:  Ability: undying_decay
06/27/2025 - 01:00:55: 🖤domaprohladno: надо дроаться
06/27/2025 - 01:00:55: L 06/27/2025 - 01:00:55: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "надо дроаться"
06/27/2025 - 01:00:56: 🖤domaprohladno: с ними
06/27/2025 - 01:00:56: L 06/27/2025 - 01:00:56: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "с ними"
06/27/2025 - 01:01:04: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:01:04:  Ability: disruptor_thunder_strike
06/27/2025 - 01:01:10: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:01:17: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:01:17: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:01:17: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:01:30: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:01:30: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:01:33: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:01:33: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:01:34: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:01:34: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:01:52: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:01:52: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:01:52: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:01:53: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:01:53: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:01:53: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:01:53: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:01:53: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:01:56: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:01:56: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:01:56: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:01:56: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:01:56: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:04: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:02:04: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:02:04: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:02:04:  Ability: elder_titan_echo_stomp
06/27/2025 - 01:02:12: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:02:12:  Ability: undying_decay
06/27/2025 - 01:02:13: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:02:13:  Ability: undying_tombstone
06/27/2025 - 01:02:14: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:02:14: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:02:14: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:02:14: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:02:14: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:02:14: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:02:15: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:02:15: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:02:16: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:02:16:  Ability: zuus_arc_lightning
06/27/2025 - 01:02:17: Game code tried to execute invalid order (14). Unit does not have enough mana to cast ability.
06/27/2025 - 01:02:20: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:21: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:21: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:21: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:02:21: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:21: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:23: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:23: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:23: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:23: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:23: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:23: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:23: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:23: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:23: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:02:24: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:02:24: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:02:27: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:02:27: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:02:35: 🖤domaprohladno: вы 3 в 5
06/27/2025 - 01:02:35: L 06/27/2025 - 01:02:35: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "вы 3 в 5"
06/27/2025 - 01:02:36: 🖤domaprohladno: подрались
06/27/2025 - 01:02:36: L 06/27/2025 - 01:02:36: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "подрались"
06/27/2025 - 01:02:36: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:02:36: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:02:56: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:02:56:  Ability: disruptor_thunder_strike
06/27/2025 - 01:03:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:06: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:17: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:03:17: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:03:18: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:03:18: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:03:18: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:03:28: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:03:28:  Ability: pugna_life_drain
06/27/2025 - 01:03:28: Game code tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:03:29: Client tried to execute a custom invalid order: (null)
06/27/2025 - 01:03:30: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:03:30: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:03:46: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:46: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:46: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:03:46: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:03:46: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:03:46: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:46: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:03:51: Drochiomaru: ручкам
06/27/2025 - 01:03:51: L 06/27/2025 - 01:03:51: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "ручкам"
06/27/2025 - 01:03:52: Drochiomaru: и
06/27/2025 - 01:03:52: L 06/27/2025 - 01:03:52: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "и"
06/27/2025 - 01:03:56: 🖤domaprohladno: я не абузил
06/27/2025 - 01:03:56: L 06/27/2025 - 01:03:56: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "я не абузил"
06/27/2025 - 01:03:59: 🖤domaprohladno: у меня 800 ммр было
06/27/2025 - 01:03:59: L 06/27/2025 - 01:03:59: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "у меня 800 ммр было"
06/27/2025 - 01:04:03: Client tried to execute invalid order (23). Can't attack target, target is attack immune.
06/27/2025 - 01:04:08: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:08: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:08: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:08: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:08: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:08: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:08: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:08: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:09: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:09: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:09: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:09: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:09: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:09: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:09: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:09: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:10: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:10: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:10: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:10: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:10: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:10: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:10: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:10: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:11: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:11: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:11: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:11: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:11: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:11: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:11: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:11: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:12: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:12: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:12: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:12: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:12: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:12: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:12: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:12: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:13: Client tried to execute invalid order (23). Can't attack target, target is attack immune.
06/27/2025 - 01:04:15: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:04:15: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:04:16: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:16: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:16: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:16: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:17: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:17: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:17: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:17: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:17: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:17: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:17: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:17: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:18: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:18: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:18: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:04:18: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:04:18: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:18: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:18: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:04:18: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:04:18: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:18: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:18: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:18: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:19: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:19: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:19: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:19: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:19: 🖤domaprohladno: апни тапок уже
06/27/2025 - 01:04:19: L 06/27/2025 - 01:04:19: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "апни тапок уже"
06/27/2025 - 01:04:19: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:19: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:19: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:19: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:20: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:20: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:20: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:20: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:20: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:20: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:20: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:20: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:21: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:21: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:21: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:21: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:21: 🖤domaprohladno: кираса нужна 100%
06/27/2025 - 01:04:21: L 06/27/2025 - 01:04:21: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "кираса нужна 100%"
06/27/2025 - 01:04:21: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:21: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:21: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:21: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:22: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:22: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:22: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:22: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:22: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:22: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:22: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:22: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:23: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:04:23: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:23: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:04:25: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:04:27: 10: npc_dota_hero_windrunner
06/27/2025 - 01:04:33: 🖤domaprohladno: пугна аегис
06/27/2025 - 01:04:33: L 06/27/2025 - 01:04:33: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "пугна аегис"
06/27/2025 - 01:04:34: 🖤domaprohladno: заденаил
06/27/2025 - 01:04:34: L 06/27/2025 - 01:04:34: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "заденаил"
06/27/2025 - 01:04:36: однаждыебался: у них нет аеги
06/27/2025 - 01:04:36: L 06/27/2025 - 01:04:36: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team "у них нет аеги"
06/27/2025 - 01:04:41: 🖤domaprohladno: 20 сек
06/27/2025 - 01:04:41: L 06/27/2025 - 01:04:41: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "20 сек"
06/27/2025 - 01:04:42: L 06/27/2025 - 01:04:42: "✞Пилот Болида✞<11><[U:1:229840067]><#DOTA_BadGuys>" disconnected (reason "2")
06/27/2025 - 01:04:42: On disconnect 1 0
06/27/2025 - 01:04:42: Create timer called!
06/27/2025 - 01:04:42: Voice: Listener ✞Пилот Болида✞(8) state cleared due to Disconnected
06/27/2025 - 01:04:42: PR:SetConnectionState 8:[U:1:229840067] DOTA_CONNECTION_STATE_DISCONNECTED NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:04:42: Setting player ✞Пилот Болида✞ to DOTA_LEAVER_DISCONNECTED
06/27/2025 - 01:04:42: PR:SetLeaverStatus 8:[U:1:229840067] DOTA_LEAVER_DISCONNECTED
06/27/2025 - 01:04:42: 20: npc_dota_hero_pugna
06/27/2025 - 01:04:42: Dropped ✞Пилот Болида✞ from server(2): NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:04:43: 🖤domaprohladno: и подраться можно
06/27/2025 - 01:04:43: L 06/27/2025 - 01:04:43: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "и подраться можно"
06/27/2025 - 01:04:49: L 06/27/2025 - 01:04:49: "✞Пилот Болида✞<13><[U:1:229840067]><>" connected, address "95.159.188.117:56579"
06/27/2025 - 01:04:49: Client "✞Пилот Болида✞" connected (95.159.188.117:56579).
06/27/2025 - 01:04:49: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:04:50: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:04:50: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:04:50: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:04:50: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:04:50: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:04:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:04:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:04:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:04:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:04:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:04:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:04:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:04:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:04:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:04:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:04:50: "✞Пилот Болида✞<13><[U:1:229840067]><>" STEAM USERID validated
06/27/2025 - 01:04:50: L 06/27/2025 - 01:04:50: "✞Пилот Болида✞<13><[U:1:229840067]><>" STEAM USERID validated
06/27/2025 - 01:04:51: OnClientAuthorized 229840067
06/27/2025 - 01:04:51: Unable to create object of type 2017
06/27/2025 - 01:04:55: L 06/27/2025 - 01:04:55: "✞Пилот Болида✞<13><[U:1:229840067]><Unassigned>" joined team "#DOTA_BadGuys"
06/27/2025 - 01:04:55: I send request that player 229840067 did connect first time? 0
06/27/2025 - 01:04:55: Loading time: 1525.866699
06/27/2025 - 01:04:56: PR:SetConnectionState 8:[U:1:229840067] DOTA_CONNECTION_STATE_CONNECTED NETWORK_DISCONNECT_INVALID
06/27/2025 - 01:04:56: PR:SetPlayerReservedState 8:[U:1:229840067] false
06/27/2025 - 01:04:56: PR:SetSelectedHero 8:[U:1:229840067] npc_dota_hero_pugna(45)
06/27/2025 - 01:04:56: 14: npc_dota_hero_pugna
06/27/2025 - 01:04:56: L 06/27/2025 - 01:04:56: "✞Пилот Болида✞<13><[U:1:229840067]><>" entered the game
06/27/2025 - 01:04:56: Sending full update to Client ✞Пилот Болида✞ (✞Пилот Болида✞ can't find frame from tick -1)
06/27/2025 - 01:04:56: Voice: Listener all_mute(6) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 01:04:56: Engine:Voice: Client all_mute(1) does listen to client ✞Пилот Болида✞(9)
06/27/2025 - 01:04:56: Voice: Listener asd829458(5) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 01:04:56: Engine:Voice: Client asd829458(2) does listen to client ✞Пилот Болида✞(9)
06/27/2025 - 01:04:56: Voice: Listener однаждыебался(2) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 01:04:56: Voice: Listener dec4dence(9) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 01:04:56: Engine:Voice: Client dec4dence(4) does listen to client ✞Пилот Болида✞(9)
06/27/2025 - 01:04:56: Voice: Listener мммолли(7) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 01:04:56: Engine:Voice: Client мммолли(5) does listen to client ✞Пилот Болида✞(9)
06/27/2025 - 01:04:56: Voice: Listener ПОКЛОНИСЬ БОГУ(3) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 01:04:56: Voice: Listener 🖤domaprohladno(4) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 01:04:56: Voice: Listener Капитан Прах(1) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 01:04:56: Voice: Listener ✞Пилот Болида✞(8) to Talker all_mute(6) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 01:04:56: Voice: Listener ✞Пилот Болида✞(8) to Talker asd829458(5) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 01:04:56: Voice: Listener ✞Пилот Болида✞(8) to Talker однаждыебался(2) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 01:04:56: Voice: Listener ✞Пилот Болида✞(8) to Talker dec4dence(9) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 01:04:56: Voice: Listener ✞Пилот Болида✞(8) to Talker мммолли(7) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 01:04:56: Voice: Listener ✞Пилот Болида✞(8) to Talker ПОКЛОНИСЬ БОГУ(3) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 01:04:56: Voice: Listener ✞Пилот Болида✞(8) to Talker 🖤domaprohladno(4) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 01:04:56: Voice: Listener ✞Пилот Болида✞(8) to Talker Капитан Прах(1) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 01:04:56: Voice: Listener ✞Пилот Болида✞(8) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_AllowSameTeam
06/27/2025 - 01:04:56: Voice: Listener ✞Пилот Болида✞(8) to Talker Drochiomaru(0) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 01:04:56: Engine:Voice: Client ✞Пилот Болида✞(9) does listen to client ✞Пилот Болида✞(9)
06/27/2025 - 01:04:56: Voice: Listener Drochiomaru(0) to Talker ✞Пилот Болида✞(8) change from kPVLS_None to kPVLS_Denied
06/27/2025 - 01:04:59: PR:SetFullyJoinedServer 8:[U:1:229840067] true
06/27/2025 - 01:04:59: PR:SetLeaverStatus 8:[U:1:229840067] DOTA_LEAVER_NONE
06/27/2025 - 01:04:59: PR:SetConnectionState 8:[U:1:229840067] DOTA_CONNECTION_STATE_CONNECTED NETWORK_DISCONNECT_INVALID
06/27/2025 - 01:05:01: Client tried to execute a custom invalid order: (null)
06/27/2025 - 01:05:02: Client tried to execute a custom invalid order: (null)
06/27/2025 - 01:05:03: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:05:03: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:05:03: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:05:05: 🖤domaprohladno: xd
06/27/2025 - 01:05:05: L 06/27/2025 - 01:05:05: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say "xd"
06/27/2025 - 01:05:09: 🖤domaprohladno: thx
06/27/2025 - 01:05:09: L 06/27/2025 - 01:05:09: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say "thx"
06/27/2025 - 01:05:11: Sending full update to Client Капитан Прах (Капитан Прах can't find frame from tick -1)
06/27/2025 - 01:05:12: Client tried to execute invalid order (2). Specified ability is not actually an ability.
06/27/2025 - 01:05:17: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:05:17:  Ability: disruptor_static_storm
06/27/2025 - 01:05:29: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:05:38: Client tried to execute invalid order (23). Can't attack target, target is attack immune.
06/27/2025 - 01:05:41: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:05:41:  Ability: undying_decay
06/27/2025 - 01:05:41: Game code tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:05:43: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:05:44: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:05:45: DataTable warning: neutral_spell_immunity: Out-of-range value (5.860000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:05:45: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (5.860000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:05:45: DataTable warning: neutral_spell_immunity: Out-of-range value (5.860000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:05:45: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (5.860000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:05:45: DataTable warning: neutral_spell_immunity: Out-of-range value (5.860000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:05:45: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (5.860000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:05:45: DataTable warning: neutral_spell_immunity: Out-of-range value (5.860000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:05:45: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (5.860000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:05:46: DataTable warning: neutral_spell_immunity: Out-of-range value (5.860000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:05:46: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (5.860000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:05:46: Game code tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:05:46: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:05:46: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:05:51: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:05:51: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:05:51: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:05:51: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:05:52: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:05:54: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:05:54: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:05:57: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:05:57: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:06:08: однаждыебался: всё норм бро не переживай
06/27/2025 - 01:06:08: L 06/27/2025 - 01:06:08: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team "всё норм бро не переживай"
06/27/2025 - 01:06:49: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:06:52: Client tried to execute invalid order (61). Item is still in cooldown.
06/27/2025 - 01:06:52:  Ability: item_veil_of_discord
06/27/2025 - 01:06:54: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:06:54: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:06:54: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:07:01: 8: npc_dota_hero_windrunner
06/27/2025 - 01:07:01: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:07:01: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:07:01: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:07:01: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:07:01: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:07:01: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:07:01: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:07:01: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:07:01: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:07:21: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:07:21: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:07:26: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:07:27: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:07:29: 15: npc_dota_hero_windrunner
06/27/2025 - 01:07:38: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:07:38: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:07:41: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:07:53: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:07:53: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:07:57: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:07:57: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:07:57: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:08:02: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:08:02:  Ability: undying_decay
06/27/2025 - 01:08:09: L 06/27/2025 - 01:08:09: "asd829458<4><[U:1:1909044259]><#DOTA_BadGuys>" disconnected (reason "2")
06/27/2025 - 01:08:09: On disconnect 1 0
06/27/2025 - 01:08:09: Create timer called!
06/27/2025 - 01:08:09: Voice: Listener asd829458(5) state cleared due to Disconnected
06/27/2025 - 01:08:09: PR:SetConnectionState 5:[U:1:1909044259] DOTA_CONNECTION_STATE_DISCONNECTED NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:08:09: Setting player asd829458 to DOTA_LEAVER_DISCONNECTED
06/27/2025 - 01:08:09: PR:SetLeaverStatus 5:[U:1:1909044259] DOTA_LEAVER_DISCONNECTED
06/27/2025 - 01:08:09: Dropped asd829458 from server(2): NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:08:35: Client tried to execute invalid order (27). Target is invisible and is not on the unit's team.
06/27/2025 - 01:08:35: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:35: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:35: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:08:35:  Ability: disruptor_kinetic_field
06/27/2025 - 01:08:35: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:08:35:  Ability: disruptor_static_storm
06/27/2025 - 01:08:35: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:35: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:36: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:08:36:  Ability: disruptor_thunder_strike
06/27/2025 - 01:08:36: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:08:36: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:36: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:37: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:08:37: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:37: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:37: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:37: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:37: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:37: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:37: Game code tried to execute invalid order (14). Unit does not have enough mana to cast ability.
06/27/2025 - 01:08:38: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:38: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:39: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:39: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:39: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:39: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:39: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:39: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:39: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:39: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:40: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:40: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:40: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:40: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:40: Client tried to execute invalid order (61). Item is still in cooldown.
06/27/2025 - 01:08:40:  Ability: item_magic_wand
06/27/2025 - 01:08:40: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:40: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:08:41: Game code tried to execute invalid order (14). Unit does not have enough mana to cast ability.
06/27/2025 - 01:08:42: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:08:53: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:08:53:  Ability: disruptor_thunder_strike
06/27/2025 - 01:08:53: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:08:53:  Ability: pugna_nether_blast
06/27/2025 - 01:09:04: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:09:04:  Ability: skeleton_king_hellfire_blast
06/27/2025 - 01:09:04: Client tried to execute invalid order (61). Item is still in cooldown.
06/27/2025 - 01:09:04:  Ability: item_glimmer_cape
06/27/2025 - 01:09:11: Game code tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:09:37: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:09:38: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:09:38: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:09:38: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:09:38: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:09:39: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:09:39: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:09:50: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:09:50: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:09:50: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:09:50: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:09:50: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:10:02: однаждыебался: блять точно
06/27/2025 - 01:10:02: L 06/27/2025 - 01:10:02: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team "блять точно"
06/27/2025 - 01:10:08: 🖤domaprohladno: ахаха
06/27/2025 - 01:10:08: L 06/27/2025 - 01:10:08: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "ахаха"
06/27/2025 - 01:10:10: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:10:10: 🖤domaprohladno: он даже не читал
06/27/2025 - 01:10:10: L 06/27/2025 - 01:10:10: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "он даже не читал"
06/27/2025 - 01:10:15: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:10:17: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:10:17: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:10:18: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:10:28: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:10:34: 🖤domaprohladno: повардите хотя бы с пуджем
06/27/2025 - 01:10:34: L 06/27/2025 - 01:10:34: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "повардите хотя бы с пуджем"
06/27/2025 - 01:10:34: 🖤domaprohladno: ну да
06/27/2025 - 01:10:34: L 06/27/2025 - 01:10:34: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "ну да"
06/27/2025 - 01:10:35: Client "Main" connected (54.36.174.134:65120).
06/27/2025 - 01:10:36: 🖤domaprohladno: но он нищ
06/27/2025 - 01:10:36: L 06/27/2025 - 01:10:36: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "но он нищ"
06/27/2025 - 01:10:43: 🖤domaprohladno: пусть уже делает аган рефреш
06/27/2025 - 01:10:43: L 06/27/2025 - 01:10:43: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "пусть уже делает аган рефреш"
06/27/2025 - 01:10:49: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:10:51: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:10:51: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:10:51: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:10:51: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:10:51: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:10:51: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:10:51: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:10:51: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:10:52: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:10:52: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:10:52: DataTable warning: neutral_spell_immunity: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:10:52: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:10:55: CHLTVClient::ExecuteStringCommand: Unknown command VModEnable 1.
06/27/2025 - 01:10:57: 4: npc_dota_hero_windrunner
06/27/2025 - 01:10:59: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:10:59: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:10:59: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:10:59: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:10:59: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:10:59: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:11:00: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:00: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:01: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:01: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:01: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:01: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:01: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:01: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:01: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:01: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:01: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:01: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:02: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:11:02:  Ability: undying_decay
06/27/2025 - 01:11:02: Капитан Прах: блудстоун или еула думал
06/27/2025 - 01:11:02: L 06/27/2025 - 01:11:02: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "блудстоун или еула думал"
06/27/2025 - 01:11:16: 🖤domaprohladno: он глимер купил на пугне чтобы я его не шотел
06/27/2025 - 01:11:16: L 06/27/2025 - 01:11:16: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "он глимер купил на пугне чтобы я его не шотел"
06/27/2025 - 01:11:19: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:11:19: 🖤domaprohladno: он тоже со стриками бегает
06/27/2025 - 01:11:19: L 06/27/2025 - 01:11:19: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "он тоже со стриками бегает"
06/27/2025 - 01:11:20: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:20: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:21: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:21: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:11:21: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:11:21: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:11:24: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:11:24: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:11:24: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:11:29: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:11:29: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:11:46: Drochiomaru: мангусы
06/27/2025 - 01:11:46: L 06/27/2025 - 01:11:46: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "мангусы"
06/27/2025 - 01:11:50: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:12:02: 🖤domaprohladno: над зафорсить их как будто
06/27/2025 - 01:12:02: L 06/27/2025 - 01:12:02: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "над зафорсить их как будто"
06/27/2025 - 01:12:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:12:27: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:12:27: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:12:31: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:12:31: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:12:31: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:12:34: 🖤domaprohladno: нет
06/27/2025 - 01:12:34: L 06/27/2025 - 01:12:34: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "нет"
06/27/2025 - 01:12:35: 🖤domaprohladno: спадает здесь
06/27/2025 - 01:12:35: L 06/27/2025 - 01:12:35: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "спадает здесь"
06/27/2025 - 01:12:36: 🖤domaprohladno: же
06/27/2025 - 01:12:36: L 06/27/2025 - 01:12:36: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "же"
06/27/2025 - 01:12:37: однаждыебался: 2 бот
06/27/2025 - 01:12:37: L 06/27/2025 - 01:12:37: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team "2 бот"
06/27/2025 - 01:12:39: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:12:39: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:12:39: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:12:39: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:12:39: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:12:39: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:12:39: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:12:39: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:12:47: Drochiomaru: это в новой доте же
06/27/2025 - 01:12:47: L 06/27/2025 - 01:12:47: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "это в новой доте же"
06/27/2025 - 01:12:47: 🖤domaprohladno: надо было рампу форсить
06/27/2025 - 01:12:47: L 06/27/2025 - 01:12:47: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "надо было рампу форсить"
06/27/2025 - 01:12:49: 🖤domaprohladno: пока ланая сдохла
06/27/2025 - 01:12:49: L 06/27/2025 - 01:12:49: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "пока ланая сдохла"
06/27/2025 - 01:12:55: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:12:55: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:12:55: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:12:55: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:13:01: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:13:01: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:13:01: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:13:03: 🖤domaprohladno: т3*
06/27/2025 - 01:13:03: L 06/27/2025 - 01:13:03: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "т3*"
06/27/2025 - 01:13:06: Dropped Main from server(2): NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:13:07: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:13:07: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:13:07: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:13:10: Client tried to execute invalid order (24). Unit can't cast, unit is silenced.
06/27/2025 - 01:13:10: Player Abandoned: 1909044259, asd829458
06/27/2025 - 01:13:10: I send request that player 1909044259 did abandon
06/27/2025 - 01:13:29: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:13:41: Drochiomaru: их 4
06/27/2025 - 01:13:41: L 06/27/2025 - 01:13:41: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "их 4"
06/27/2025 - 01:13:55: 🖤domaprohladno: пуджа надо
06/27/2025 - 01:13:55: L 06/27/2025 - 01:13:55: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "пуджа надо"
06/27/2025 - 01:13:56: Drochiomaru: хватит
06/27/2025 - 01:13:56: L 06/27/2025 - 01:13:56: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "хватит"
06/27/2025 - 01:13:58: 🖤domaprohladno: он в ебенях
06/27/2025 - 01:13:58: L 06/27/2025 - 01:13:58: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "он в ебенях"
06/27/2025 - 01:14:01: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:14:01: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:14:04: Drochiomaru: 2з+3к
06/27/2025 - 01:14:04: L 06/27/2025 - 01:14:04: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "2з+3к"
06/27/2025 - 01:14:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:14:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:14:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:14:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:14:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:14:10: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:14:24: Client tried to execute a custom invalid order: (null)
06/27/2025 - 01:14:25: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:14:25: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:14:25: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:14:31: Drochiomaru: да не нажет он)
06/27/2025 - 01:14:31: L 06/27/2025 - 01:14:31: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "да не нажет он)"
06/27/2025 - 01:14:38: Drochiomaru: +
06/27/2025 - 01:14:38: L 06/27/2025 - 01:14:38: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "+"
06/27/2025 - 01:14:44: Drochiomaru: кнш
06/27/2025 - 01:14:44: L 06/27/2025 - 01:14:44: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "кнш"
06/27/2025 - 01:14:44: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:14:44: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:14:45: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:14:53: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:14:53:  Ability: pugna_nether_blast
06/27/2025 - 01:14:58: 🖤domaprohladno: го
06/27/2025 - 01:14:58: L 06/27/2025 - 01:14:58: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "го"
06/27/2025 - 01:15:11: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:15:11:  Ability: undying_tombstone
06/27/2025 - 01:15:13: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:15:14: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:15:14:  Ability: disruptor_kinetic_field
06/27/2025 - 01:15:19: Drochiomaru: засолил файт
06/27/2025 - 01:15:19: L 06/27/2025 - 01:15:19: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "засолил файт"
06/27/2025 - 01:15:20: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:15:20: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:15:20: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:15:20: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:15:20: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:15:21: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:15:21: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:15:21: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:15:21: Client tried to execute invalid order (61). Item is still in cooldown.
06/27/2025 - 01:15:21:  Ability: item_blink
06/27/2025 - 01:15:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:15:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:15:23: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:15:25: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:15:29: 🖤domaprohladno: минер соло получается кто пиздекл
06/27/2025 - 01:15:29: L 06/27/2025 - 01:15:29: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "минер соло получается кто пиздекл"
06/27/2025 - 01:15:31: однаждыебался: ЛУЧШИЕН НАХУЙ
06/27/2025 - 01:15:31: L 06/27/2025 - 01:15:31: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team "ЛУЧШИЕН НАХУЙ"
06/27/2025 - 01:15:32: Drochiomaru: не зря в шахматы играю
06/27/2025 - 01:15:32: L 06/27/2025 - 01:15:32: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "не зря в шахматы играю"
06/27/2025 - 01:15:44: Drochiomaru: на блудстоун брат
06/27/2025 - 01:15:44: L 06/27/2025 - 01:15:44: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "на блудстоун брат"
06/27/2025 - 01:16:02: Drochiomaru: что не дали в рот
06/27/2025 - 01:16:02: L 06/27/2025 - 01:16:02: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "что не дали в рот"
06/27/2025 - 01:16:02: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:16:03: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:16:03:  Ability: elder_titan_ancestral_spirit
06/27/2025 - 01:16:04: Drochiomaru: уже и рад
06/27/2025 - 01:16:04: L 06/27/2025 - 01:16:04: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "уже и рад"
06/27/2025 - 01:16:05: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:16:05:  Ability: elder_titan_echo_stomp
06/27/2025 - 01:16:10: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:16:10:  Ability: disruptor_thunder_strike
06/27/2025 - 01:16:12: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:16:12: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:16:13: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:13: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:13: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:13: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:13: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:13: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:14: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:14: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:15: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:15: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:15: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:15: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:15: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:15: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:16: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:16: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:16:27: Client tried to execute invalid order (27). Target is invisible and is not on the unit's team.
06/27/2025 - 01:16:27: Client tried to execute invalid order (27). Target is invisible and is not on the unit's team.
06/27/2025 - 01:16:27: Client tried to execute invalid order (27). Target is invisible and is not on the unit's team.
06/27/2025 - 01:16:27: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:16:28: Client tried to execute invalid order (27). Target is invisible and is not on the unit's team.
06/27/2025 - 01:16:34: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:16:34:  Ability: undying_decay
06/27/2025 - 01:16:39: Game code tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:16:39: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:16:39: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:16:39: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:16:41: 🖤domaprohladno: ну а вот в масс не смогли
06/27/2025 - 01:16:41: L 06/27/2025 - 01:16:41: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "ну а вот в масс не смогли"
06/27/2025 - 01:16:41: 🖤domaprohladno: анлак
06/27/2025 - 01:16:41: L 06/27/2025 - 01:16:41: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "анлак"
06/27/2025 - 01:16:51: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:16:54: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:16:54: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:16:54: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:16:54: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:16:54: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:16:54: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:16:54: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:16:54: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:16:54: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:16:54: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:16:54: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:16:54: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:17:00: Drochiomaru: бля мне эта дота так нравится))
06/27/2025 - 01:17:00: L 06/27/2025 - 01:17:00: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "бля мне эта дота так нравится))"
06/27/2025 - 01:17:04: Drochiomaru: рефракш чел нажал
06/27/2025 - 01:17:04: L 06/27/2025 - 01:17:04: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "рефракш чел нажал"
06/27/2025 - 01:17:06: Drochiomaru: а его не видно
06/27/2025 - 01:17:06: L 06/27/2025 - 01:17:06: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "а его не видно"
06/27/2025 - 01:17:07: 🖤domaprohladno: пудж денай зевс денай
06/27/2025 - 01:17:07: L 06/27/2025 - 01:17:07: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "пудж денай зевс денай"
06/27/2025 - 01:17:10: 🖤domaprohladno: и минер денай
06/27/2025 - 01:17:10: L 06/27/2025 - 01:17:10: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "и минер денай"
06/27/2025 - 01:17:14: 🖤domaprohladno: по итогу мы вдвоем нафидили ток с вк
06/27/2025 - 01:17:14: L 06/27/2025 - 01:17:14: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "по итогу мы вдвоем нафидили ток с вк"
06/27/2025 - 01:17:17: 🖤domaprohladno: похуй
06/27/2025 - 01:17:17: L 06/27/2025 - 01:17:17: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "похуй"
06/27/2025 - 01:17:19: Drochiomaru: да кайф
06/27/2025 - 01:17:19: L 06/27/2025 - 01:17:19: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "да кайф"
06/27/2025 - 01:17:24: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:24: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:24: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:24: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:24: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:24: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:25: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:25: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:25: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:25: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:25: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:25: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:25: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:25: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:26: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:26: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:26: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:26: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:26: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:26: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:26: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:26: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:26: Drochiomaru: я еблан
06/27/2025 - 01:17:26: L 06/27/2025 - 01:17:26: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "я еблан"
06/27/2025 - 01:17:27: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:27: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:27: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:27: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:27: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:27: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:27: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:27: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:28: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:28: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:28: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:28: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:28: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:28: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:28: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:28: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:29: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:29: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:29: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:29: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:17:34: Капитан Прах: еула покупать 
06/27/2025 - 01:17:34: L 06/27/2025 - 01:17:34: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "еула покупать "
06/27/2025 - 01:17:39: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:17:39: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:17:39: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:17:41: Drochiomaru: да зачилься уже)
06/27/2025 - 01:17:41: L 06/27/2025 - 01:17:41: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "да зачилься уже)"
06/27/2025 - 01:17:45: Капитан Прах: поздно сказали
06/27/2025 - 01:17:45: L 06/27/2025 - 01:17:45: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "поздно сказали"
06/27/2025 - 01:17:50: Drochiomaru: играем же по кайфу
06/27/2025 - 01:17:50: L 06/27/2025 - 01:17:50: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "играем же по кайфу"
06/27/2025 - 01:17:51: 🖤domaprohladno: у тебя нулик один был
06/27/2025 - 01:17:51: L 06/27/2025 - 01:17:51: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "у тебя нулик один был"
06/27/2025 - 01:17:51: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:17:51: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:17:51: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:17:51: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:04: 🖤domaprohladno: они же убивали рошу
06/27/2025 - 01:18:04: L 06/27/2025 - 01:18:04: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "они же убивали рошу"
06/27/2025 - 01:18:05: Капитан Прах: у меня был шар крутой за 3 к
06/27/2025 - 01:18:05: L 06/27/2025 - 01:18:05: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "у меня был шар крутой за 3 к"
06/27/2025 - 01:18:10: Капитан Прах: когда вы сказали
06/27/2025 - 01:18:10: L 06/27/2025 - 01:18:10: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "когда вы сказали"
06/27/2025 - 01:18:18: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:18:22: 🖤domaprohladno: либо пугну либо та с зомби
06/27/2025 - 01:18:22: L 06/27/2025 - 01:18:22: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "либо пугну либо та с зомби"
06/27/2025 - 01:18:30: Капитан Прах: лан
06/27/2025 - 01:18:30: L 06/27/2025 - 01:18:30: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "лан"
06/27/2025 - 01:18:37: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:37: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:37: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:37: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:40: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:18:41: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:18:42: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:18:48: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:18:49: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:49: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:52: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:18:54: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:18:54: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:18:54: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:18:54: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:18:54: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:18:54: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:18:54:  Ability: undying_decay
06/27/2025 - 01:18:54: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:54: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:54: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:54: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:54: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:54: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:54: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:54: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:18:58: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:18:58:  Ability: disruptor_kinetic_field
06/27/2025 - 01:19:00: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:19:00: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:19:00: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:19:00: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:19:00: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:19:15: Drochiomaru: как ты много говоришь
06/27/2025 - 01:19:15: L 06/27/2025 - 01:19:15: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "как ты много говоришь"
06/27/2025 - 01:19:16: Drochiomaru: в 4 утра
06/27/2025 - 01:19:16: L 06/27/2025 - 01:19:16: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "в 4 утра"
06/27/2025 - 01:19:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:19:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:19:25: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:19:28: 🖤domaprohladno: потому что хил с задержкой в пол секунды
06/27/2025 - 01:19:28: L 06/27/2025 - 01:19:28: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "потому что хил с задержкой в пол секунды"
06/27/2025 - 01:19:30: Drochiomaru: я тож
06/27/2025 - 01:19:30: L 06/27/2025 - 01:19:30: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "я тож"
06/27/2025 - 01:19:34: Drochiomaru: но экзамен в 9
06/27/2025 - 01:19:34: L 06/27/2025 - 01:19:34: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "но экзамен в 9"
06/27/2025 - 01:19:35: Drochiomaru: анлак
06/27/2025 - 01:19:35: L 06/27/2025 - 01:19:35: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "анлак"
06/27/2025 - 01:19:38: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:19:44: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:19:45: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:19:45: 🖤domaprohladno: ебать да
06/27/2025 - 01:19:45: L 06/27/2025 - 01:19:45: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "ебать да"
06/27/2025 - 01:19:45: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:19:45: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:19:45: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:19:46: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:19:46: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:19:46: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:19:48: 🖤domaprohladno: даже я уже диплом получил
06/27/2025 - 01:19:48: L 06/27/2025 - 01:19:48: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "даже я уже диплом получил"
06/27/2025 - 01:20:03: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:03: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:03: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:03: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:03: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:03: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:03: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:03: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:04: Client tried to execute invalid order (94). Game is Paused
06/27/2025 - 01:20:04: Client tried to execute invalid order (94). Game is Paused
06/27/2025 - 01:20:04: Client tried to execute invalid order (94). Game is Paused
06/27/2025 - 01:20:04: Client tried to execute invalid order (94). Game is Paused
06/27/2025 - 01:20:04: Client tried to execute invalid order (94). Game is Paused
06/27/2025 - 01:20:04: Client tried to execute invalid order (94). Game is Paused
06/27/2025 - 01:20:05: Client tried to execute invalid order (94). Game is Paused
06/27/2025 - 01:20:21: 🖤domaprohladno: уходи
06/27/2025 - 01:20:21: L 06/27/2025 - 01:20:21: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "уходи"
06/27/2025 - 01:20:23: 🖤domaprohladno: с бкб же она
06/27/2025 - 01:20:23: L 06/27/2025 - 01:20:23: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "с бкб же она"
06/27/2025 - 01:20:28: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:20:28:  Ability: undying_decay
06/27/2025 - 01:20:29: 🖤domaprohladno: мкб
06/27/2025 - 01:20:29: L 06/27/2025 - 01:20:29: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "мкб"
06/27/2025 - 01:20:29: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:29: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:29: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:29: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:29: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:29: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:29: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:29: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:29: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:30: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:30: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:30: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:30: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:30: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:30: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:30: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:30: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:30: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:30: 🖤domaprohladno: против врки
06/27/2025 - 01:20:30: L 06/27/2025 - 01:20:30: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "против врки"
06/27/2025 - 01:20:30: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:20:30: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:30: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:30: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:31: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:31: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:31: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:31: 🖤domaprohladno: не?
06/27/2025 - 01:20:31: L 06/27/2025 - 01:20:31: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "не?"
06/27/2025 - 01:20:35: 🖤domaprohladno: линку собьют
06/27/2025 - 01:20:35: L 06/27/2025 - 01:20:35: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "линку собьют"
06/27/2025 - 01:20:38: 🖤domaprohladno: супербаш руина
06/27/2025 - 01:20:38: L 06/27/2025 - 01:20:38: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "супербаш руина"
06/27/2025 - 01:20:40: 🖤domaprohladno: если я жив
06/27/2025 - 01:20:40: L 06/27/2025 - 01:20:40: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "если я жив"
06/27/2025 - 01:20:46: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:20:47: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:20:47: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:20:52: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:20:55: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:20:55: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:20:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:21:00: 🖤domaprohladno: так зачем супербашер
06/27/2025 - 01:21:00: L 06/27/2025 - 01:21:00: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "так зачем супербашер"
06/27/2025 - 01:21:02: 🖤domaprohladno: если мкб башит
06/27/2025 - 01:21:02: L 06/27/2025 - 01:21:02: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "если мкб башит"
06/27/2025 - 01:21:10: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:21:10:  Ability: pugna_decrepify
06/27/2025 - 01:21:15: Game code tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:21:15: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:21:15: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:21:15: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:21:16: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:21:16: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:21:18: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:18: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:18: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:18: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:19: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:19: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:19: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:19: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:19: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:19: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:20: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:20: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:20: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:20: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:20: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:20: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:21: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:21: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:21: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:21:21:  Ability: disruptor_kinetic_field
06/27/2025 - 01:21:22: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:22: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:22: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:22: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:23: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:23: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:23: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:23: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:23: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:23: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:23: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:23: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:24: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:24: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:24: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:21:24:  Ability: disruptor_static_storm
06/27/2025 - 01:21:24: Client tried to execute invalid order (24). Unit can't cast, unit is silenced.
06/27/2025 - 01:21:24: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:24: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:25: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:25: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:21:30: Game code tried to execute invalid order (14). Unit does not have enough mana to cast ability.
06/27/2025 - 01:21:33: Game code tried to execute invalid order (14). Unit does not have enough mana to cast ability.
06/27/2025 - 01:21:35: Client tried to execute invalid order (27). Target is invisible and is not on the unit's team.
06/27/2025 - 01:21:35: Client tried to execute invalid order (27). Target is invisible and is not on the unit's team.
06/27/2025 - 01:21:35: Client tried to execute invalid order (27). Target is invisible and is not on the unit's team.
06/27/2025 - 01:21:36: Client tried to execute invalid order (27). Target is invisible and is not on the unit's team.
06/27/2025 - 01:21:36: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:21:36: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:21:37: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:21:40: Client tried to execute invalid order (61). Item is still in cooldown.
06/27/2025 - 01:21:40:  Ability: item_blink
06/27/2025 - 01:21:44: Client tried to execute invalid order (27). Target is invisible and is not on the unit's team.
06/27/2025 - 01:21:44: Client tried to execute invalid order (27). Target is invisible and is not on the unit's team.
06/27/2025 - 01:21:48: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:21:48:  Ability: elder_titan_echo_stomp
06/27/2025 - 01:21:48: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:21:48: Game code tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:21:48: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:21:48: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:21:48: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:22:06: Drochiomaru: хуйня байт
06/27/2025 - 01:22:06: L 06/27/2025 - 01:22:06: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "хуйня байт"
06/27/2025 - 01:22:07: dec4dence: Я не могу бегать под ультой?
06/27/2025 - 01:22:07: L 06/27/2025 - 01:22:07: "dec4dence<6><[U:1:1209125835]><#DOTA_BadGuys>" say "Я не могу бегать под ультой?"
06/27/2025 - 01:22:12: 🖤domaprohladno: не должен
06/27/2025 - 01:22:12: L 06/27/2025 - 01:22:12: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say "не должен"
06/27/2025 - 01:22:13: dec4dence: Я как турель стреляю
06/27/2025 - 01:22:13: L 06/27/2025 - 01:22:13: "dec4dence<6><[U:1:1209125835]><#DOTA_BadGuys>" say "Я как турель стреляю"
06/27/2025 - 01:22:25: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:22:36: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:22:39: ✞Пилот Болида✞: АГАНИМ КУПИ ВРКА!!
06/27/2025 - 01:22:39: L 06/27/2025 - 01:22:39: "✞Пилот Болида✞<13><[U:1:229840067]><#DOTA_BadGuys>" say_team "АГАНИМ КУПИ ВРКА!!"
06/27/2025 - 01:22:46: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:22:46:  Ability: pugna_nether_blast
06/27/2025 - 01:22:52: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:22:53: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:22:54: ✞Пилот Болида✞: АГАНИМ ВРКА КУПИ БЕГАТЬ СМОЖЕШ!!!
06/27/2025 - 01:22:54: L 06/27/2025 - 01:22:54: "✞Пилот Болида✞<13><[U:1:229840067]><#DOTA_BadGuys>" say_team "АГАНИМ ВРКА КУПИ БЕГАТЬ СМОЖЕШ!!!"
06/27/2025 - 01:22:57: Client tried to execute invalid order (14). Unit does not have enough mana to cast ability.
06/27/2025 - 01:23:02: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:23:02: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:23:04: Game code tried to execute invalid order (14). Unit does not have enough mana to cast ability.
06/27/2025 - 01:23:04: Client tried to execute invalid order (14). Unit does not have enough mana to cast ability.
06/27/2025 - 01:23:08: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:23:12: однаждыебался: кому гем
06/27/2025 - 01:23:12: L 06/27/2025 - 01:23:12: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team "кому гем"
06/27/2025 - 01:23:17: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:23:17: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:23:17: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:23:27: 🖤domaprohladno: на базу лучше
06/27/2025 - 01:23:27: L 06/27/2025 - 01:23:27: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "на базу лучше"
06/27/2025 - 01:23:28: 🖤domaprohladno: у нас течис
06/27/2025 - 01:23:28: L 06/27/2025 - 01:23:28: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "у нас течис"
06/27/2025 - 01:23:43: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:23:43: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:23:44: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:23:45: однаждыебался: а
06/27/2025 - 01:23:45: L 06/27/2025 - 01:23:45: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team "а"
06/27/2025 - 01:23:47: однаждыебался: ща
06/27/2025 - 01:23:47: L 06/27/2025 - 01:23:47: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team "ща"
06/27/2025 - 01:23:49: Капитан Прах: аганим рефрешер?
06/27/2025 - 01:23:49: L 06/27/2025 - 01:23:49: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "аганим рефрешер?"
06/27/2025 - 01:23:50: Drochiomaru: гем забрали?
06/27/2025 - 01:23:50: L 06/27/2025 - 01:23:50: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "гем забрали?"
06/27/2025 - 01:23:57: однаждыебался: 3 игра просто сори ес чо
06/27/2025 - 01:23:57: L 06/27/2025 - 01:23:57: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team "3 игра просто сори ес чо"
06/27/2025 - 01:23:58: 🖤domaprohladno: на зевсе все равно уебал еул
06/27/2025 - 01:23:58: L 06/27/2025 - 01:23:58: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "на зевсе все равно уебал еул"
06/27/2025 - 01:24:07: 🖤domaprohladno: уже надо было аган рефрешер
06/27/2025 - 01:24:07: L 06/27/2025 - 01:24:07: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "уже надо было аган рефрешер"
06/27/2025 - 01:24:12: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:12: 🖤domaprohladno: иметь
06/27/2025 - 01:24:12: L 06/27/2025 - 01:24:12: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "иметь"
06/27/2025 - 01:24:16: 🖤domaprohladno: чтобы тебя фокусить хотели
06/27/2025 - 01:24:16: L 06/27/2025 - 01:24:16: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "чтобы тебя фокусить хотели"
06/27/2025 - 01:24:16: Капитан Прах: а что тогда
06/27/2025 - 01:24:16: L 06/27/2025 - 01:24:16: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "а что тогда"
06/27/2025 - 01:24:18: 🖤domaprohladno: а ты собирал форс глимер
06/27/2025 - 01:24:18: L 06/27/2025 - 01:24:18: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "а ты собирал форс глимер"
06/27/2025 - 01:24:25: Game code tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:24:25: 🖤domaprohladno: а щас ты соберешь все равно не оч урона будет
06/27/2025 - 01:24:25: L 06/27/2025 - 01:24:25: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "а щас ты соберешь все равно не оч урона будет"
06/27/2025 - 01:24:26: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:24:29: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:24:29: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:24:29: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:24:30: 🖤domaprohladno: ну собирай все равно шмоток нет других
06/27/2025 - 01:24:30: L 06/27/2025 - 01:24:30: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "ну собирай все равно шмоток нет других"
06/27/2025 - 01:24:32: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:24:34: 🖤domaprohladno: кроме хекса
06/27/2025 - 01:24:34: L 06/27/2025 - 01:24:34: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "кроме хекса"
06/27/2025 - 01:24:35: Капитан Прах: что собирать тогда
06/27/2025 - 01:24:35: L 06/27/2025 - 01:24:35: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "что собирать тогда"
06/27/2025 - 01:24:38: 🖤domaprohladno: аган рефреш
06/27/2025 - 01:24:38: L 06/27/2025 - 01:24:38: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "аган рефреш"
06/27/2025 - 01:24:41: 🖤domaprohladno: пугну шотать
06/27/2025 - 01:24:41: L 06/27/2025 - 01:24:41: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "пугну шотать"
06/27/2025 - 01:24:42: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:42: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:42: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:42: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:42: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:42: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:42: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:42: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:42: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:43: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:43: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:43: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:46: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:46: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:46: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:46: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:46: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:46: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:48: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:49: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:49: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:49: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:49: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:49: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:49: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:51: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:51: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:51: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:55: Client tried to execute invalid order (23). Can't attack target, target is attack immune.
06/27/2025 - 01:24:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:24:55: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:24:55: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:25:01: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:25:01: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:25:03: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:25:16: 🖤domaprohladno: в бот надо идти
06/27/2025 - 01:25:16: L 06/27/2025 - 01:25:16: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "в бот надо идти"
06/27/2025 - 01:25:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:25:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:25:32: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:25:32: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:25:38: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:25:38: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:25:39: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:25:39: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:25:49: DataTable warning: npc_dota_creep_lane: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:49: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:49: DataTable warning: npc_dota_creep_lane: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:49: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:49: DataTable warning: npc_dota_creep_lane: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:49: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:50: DataTable warning: npc_dota_creep_lane: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:50: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:50: DataTable warning: npc_dota_creep_lane: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:50: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:50: DataTable warning: npc_dota_creep_lane: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:50: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:50: DataTable warning: npc_dota_creep_lane: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:50: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:51: DataTable warning: npc_dota_creep_lane: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:51: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:51: DataTable warning: npc_dota_creep_lane: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:51: Game code tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:25:51: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:51: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:25:51: DataTable warning: npc_dota_creep_lane: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:51: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:25:51: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:25:51: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:25:51: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:25:55: Drochiomaru: бля я так ошибся)
06/27/2025 - 01:25:55: L 06/27/2025 - 01:25:55: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "бля я так ошибся)"
06/27/2025 - 01:25:57: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:25:58: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:26:03: 🖤domaprohladno: ренж сломать
06/27/2025 - 01:26:03: L 06/27/2025 - 01:26:03: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "ренж сломать"
06/27/2025 - 01:26:06: Client tried to execute invalid order (44). Ability cannot be auto-cast.
06/27/2025 - 01:26:07: Drochiomaru: не, я мог спасти аегу
06/27/2025 - 01:26:07: L 06/27/2025 - 01:26:07: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "не, я мог спасти аегу"
06/27/2025 - 01:26:09: 🖤domaprohladno: или мили
06/27/2025 - 01:26:09: L 06/27/2025 - 01:26:09: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "или мили"
06/27/2025 - 01:26:12: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:26:12:  Ability: skeleton_king_hellfire_blast
06/27/2025 - 01:26:17: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:26:17: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:26:21: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:26:21: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:26:21: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:26:21:  Ability: pugna_nether_blast
06/27/2025 - 01:26:22: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:26:22: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:26:29: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:26:29: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:26:29: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:26:29: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:26:37: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:26:37:  Ability: disruptor_static_storm
06/27/2025 - 01:26:38: Client tried to execute invalid order (21). Can't cast on target, target is a magic immune enemy.
06/27/2025 - 01:26:47: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:26:48: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:26:49: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:26:49: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:26:49: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:26:49: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:26:51: 🖤domaprohladno: уходить
06/27/2025 - 01:26:51: L 06/27/2025 - 01:26:51: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "уходить"
06/27/2025 - 01:26:53: Client tried to execute invalid order (61). Item is still in cooldown.
06/27/2025 - 01:26:53:  Ability: item_black_king_bar
06/27/2025 - 01:26:54: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:26:54:  Ability: undying_decay
06/27/2025 - 01:26:54: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:26:54:  Ability: windrunner_windrun
06/27/2025 - 01:26:55: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:55: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:56: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:56: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:56: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:56: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:56: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:56: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:56: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:56: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:57: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:57: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:57: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:57: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:57: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:57: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:57: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:57: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:58: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:58: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:58: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:58: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:58: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:58: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:59: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:59: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:59: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:26:59: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:00: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:00: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:00: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:00: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:00: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:00: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:00: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:00: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:01: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:01: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:01: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:01: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:01: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:01: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:01: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:01: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:02: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:02: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:02: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:02: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:02: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:02: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:27:02: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:27:09: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:27:09:  Ability: undying_decay
06/27/2025 - 01:27:21: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:27:21: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:27:29: Client tried to execute invalid order (22). Can't attack or cast on target, target is invulnerable.
06/27/2025 - 01:27:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:39: 🖤domaprohladno: похуй пусть не продает
06/27/2025 - 01:27:39: L 06/27/2025 - 01:27:39: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "похуй пусть не продает"
06/27/2025 - 01:27:42: 🖤domaprohladno: у него 0 нетворса будет
06/27/2025 - 01:27:42: L 06/27/2025 - 01:27:42: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "у него 0 нетворса будет"
06/27/2025 - 01:27:43: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:43: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:43: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:43: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:50: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:27:55: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:28:00: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:28:00: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:28:07: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:28:07:  Ability: undying_soul_rip
06/27/2025 - 01:28:09: 🖤domaprohladno: аега то у кого там?
06/27/2025 - 01:28:09: L 06/27/2025 - 01:28:09: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "аега то у кого там?"
06/27/2025 - 01:28:12: Drochiomaru: бкб выбил
06/27/2025 - 01:28:12: L 06/27/2025 - 01:28:12: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "бкб выбил"
06/27/2025 - 01:28:13: Drochiomaru: ахах
06/27/2025 - 01:28:13: L 06/27/2025 - 01:28:13: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "ахах"
06/27/2025 - 01:28:14: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:28:14:  Ability: pugna_nether_blast
06/27/2025 - 01:28:17: Drochiomaru: забей
06/27/2025 - 01:28:17: L 06/27/2025 - 01:28:17: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "забей"
06/27/2025 - 01:28:19: Drochiomaru: да
06/27/2025 - 01:28:19: L 06/27/2025 - 01:28:19: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "да"
06/27/2025 - 01:28:27: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:28:27: Drochiomaru: 3 маны не хватило
06/27/2025 - 01:28:27: L 06/27/2025 - 01:28:27: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "3 маны не хватило"
06/27/2025 - 01:28:36: Drochiomaru: 840
06/27/2025 - 01:28:36: L 06/27/2025 - 01:28:36: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "840"
06/27/2025 - 01:28:38: Game code tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:28:38: Drochiomaru: немного
06/27/2025 - 01:28:38: L 06/27/2025 - 01:28:38: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" say_team "немного"
06/27/2025 - 01:28:39: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:28:39: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:28:42: 🖤domaprohladno: ну че я попробую сделать хекс
06/27/2025 - 01:28:42: L 06/27/2025 - 01:28:42: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "ну че я попробую сделать хекс"
06/27/2025 - 01:28:46: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:28:47: 🖤domaprohladno: и езериал
06/27/2025 - 01:28:47: L 06/27/2025 - 01:28:47: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "и езериал"
06/27/2025 - 01:28:49: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:28:49: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:28:51: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:29:02: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:29:02: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:29:11: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:29:11: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:29:11: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:29:12: 🖤domaprohladno: там взрывать надо через мины
06/27/2025 - 01:29:12: L 06/27/2025 - 01:29:12: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "там взрывать надо через мины"
06/27/2025 - 01:29:13: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:29:14: 🖤domaprohladno: а не героя
06/27/2025 - 01:29:14: L 06/27/2025 - 01:29:14: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "а не героя"
06/27/2025 - 01:29:16: 🖤domaprohladno: чтобы они с задержко
06/27/2025 - 01:29:16: L 06/27/2025 - 01:29:16: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "чтобы они с задержко"
06/27/2025 - 01:29:17: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:29:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:29:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:29:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:29:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:29:22: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:29:38: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:29:40: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:29:40:  Ability: disruptor_kinetic_field
06/27/2025 - 01:29:40: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:29:40:  Ability: disruptor_static_storm
06/27/2025 - 01:29:40: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:29:40:  Ability: disruptor_thunder_strike
06/27/2025 - 01:29:44: Game code tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:29:44: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:29:44: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:29:45: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:29:45: Client tried to execute invalid order (24). Unit can't cast, unit is silenced.
06/27/2025 - 01:29:46: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:29:46: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:29:52: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:29:52: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:29:52: 🖤domaprohladno: а
06/27/2025 - 01:29:52: L 06/27/2025 - 01:29:52: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "а"
06/27/2025 - 01:29:52: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:29:52: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:29:53: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:29:53: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:29:53: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:29:53: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:29:53: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:29:53: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:29:54: 🖤domaprohladno: я на хуйню зафорсил
06/27/2025 - 01:29:54: L 06/27/2025 - 01:29:54: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "я на хуйню зафорсил"
06/27/2025 - 01:29:55: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:29:55: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:29:56: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:29:57: 🖤domaprohladno: я думал аегиса то нет
06/27/2025 - 01:29:57: L 06/27/2025 - 01:29:57: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "я думал аегиса то нет"
06/27/2025 - 01:29:58: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:29:58: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:29:58: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:29:59: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:29:59:  Ability: skeleton_king_hellfire_blast
06/27/2025 - 01:29:59: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:29:59:  Ability: skeleton_king_hellfire_blast
06/27/2025 - 01:30:01: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:30:01:  Ability: undying_soul_rip
06/27/2025 - 01:30:02: Client tried to execute a custom invalid order: (null)
06/27/2025 - 01:30:06: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:30:06: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:30:06: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:30:06: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:30:06: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:30:08: Game code tried to execute invalid order (14). Unit does not have enough mana to cast ability.
06/27/2025 - 01:30:11: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:30:11: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:30:11: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:30:15: 🖤domaprohladno: я на хуйню зафорсил думал аегиса нет уже
06/27/2025 - 01:30:15: L 06/27/2025 - 01:30:15: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "я на хуйню зафорсил думал аегиса нет уже"
06/27/2025 - 01:30:36: 🖤domaprohladno: не запушат бтв не критично
06/27/2025 - 01:30:36: L 06/27/2025 - 01:30:36: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "не запушат бтв не критично"
06/27/2025 - 01:30:40: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:30:40: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:30:40: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:30:40: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:30:42: 🖤domaprohladno: я уже как кор собрался так что пох
06/27/2025 - 01:30:42: L 06/27/2025 - 01:30:42: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "я уже как кор собрался так что пох"
06/27/2025 - 01:30:46: однаждыебался: услышал
06/27/2025 - 01:30:46: L 06/27/2025 - 01:30:46: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team "услышал"
06/27/2025 - 01:30:50: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:30:50:  Ability: undying_decay
06/27/2025 - 01:30:51: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:30:51: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:30:51: 🖤domaprohladno: пудж без обратки в та + вр хуярит
06/27/2025 - 01:30:51: L 06/27/2025 - 01:30:51: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "пудж без обратки в та + вр хуярит"
06/27/2025 - 01:30:51: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:31:01: Капитан Прах: я могу еула и ботл продать
06/27/2025 - 01:31:01: L 06/27/2025 - 01:31:01: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "я могу еула и ботл продать"
06/27/2025 - 01:31:04: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:31:04:  Ability: undying_decay
06/27/2025 - 01:31:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:31:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:31:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:31:36: dec4dence: аквилу
06/27/2025 - 01:31:36: L 06/27/2025 - 01:31:36: "dec4dence<6><[U:1:1209125835]><#DOTA_BadGuys>" say_team "аквилу"
06/27/2025 - 01:31:37: 🖤domaprohladno: вижн если че
06/27/2025 - 01:31:37: L 06/27/2025 - 01:31:37: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "вижн если че"
06/27/2025 - 01:31:38: однаждыебался: мида нет у них
06/27/2025 - 01:31:38: L 06/27/2025 - 01:31:38: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team "мида нет у них"
06/27/2025 - 01:31:39: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:31:39: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:31:39: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:31:39: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:32:12: 🖤domaprohladno: смок в вр мб?
06/27/2025 - 01:32:12: L 06/27/2025 - 01:32:12: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "смок в вр мб?"
06/27/2025 - 01:32:14: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:32:17: 🖤domaprohladno: ланая не оч проблема
06/27/2025 - 01:32:17: L 06/27/2025 - 01:32:17: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "ланая не оч проблема"
06/27/2025 - 01:32:23: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:32:25: ✞Пилот Болида✞: САТАНИК НЕ СТАКОЕТСЯ
06/27/2025 - 01:32:25: L 06/27/2025 - 01:32:25: "✞Пилот Болида✞<13><[U:1:229840067]><#DOTA_BadGuys>" say_team "САТАНИК НЕ СТАКОЕТСЯ"
06/27/2025 - 01:32:27: ✞Пилот Болида✞: С ДЕЗОЛЬ
06/27/2025 - 01:32:27: L 06/27/2025 - 01:32:27: "✞Пилот Болида✞<13><[U:1:229840067]><#DOTA_BadGuys>" say_team "С ДЕЗОЛЬ"
06/27/2025 - 01:32:29: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:31: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:32:31: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:32:31: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:32:32: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:32:32: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:32:32: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:32:32: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:32:35: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:32:35: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:35: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:35: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:35: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:35: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:35: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:35: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:35: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:38: dec4dence: ахаахахах
06/27/2025 - 01:32:38: L 06/27/2025 - 01:32:38: "dec4dence<6><[U:1:1209125835]><#DOTA_BadGuys>" say_team "ахаахахах"
06/27/2025 - 01:32:40: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:32:40: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:32:41: dec4dence: похуй говорит
06/27/2025 - 01:32:41: L 06/27/2025 - 01:32:41: "dec4dence<6><[U:1:1209125835]><#DOTA_BadGuys>" say_team "похуй говорит"
06/27/2025 - 01:32:41: ✞Пилот Болида✞: НИЗЯ САТАНИК И ДЕЗОЛЬ
06/27/2025 - 01:32:41: L 06/27/2025 - 01:32:41: "✞Пилот Болида✞<13><[U:1:229840067]><#DOTA_BadGuys>" say_team "НИЗЯ САТАНИК И ДЕЗОЛЬ"
06/27/2025 - 01:32:43: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:43: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:44: dec4dence: ахахаах
06/27/2025 - 01:32:44: L 06/27/2025 - 01:32:44: "dec4dence<6><[U:1:1209125835]><#DOTA_BadGuys>" say_team "ахахаах"
06/27/2025 - 01:32:45: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:45: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:45: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:46: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:46: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:46: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:48: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:32:48: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:32:48: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:32:50: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:32:50: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:32:55: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:32:59: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:59: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:59: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:59: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:59: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:32:59: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:33:03: 🖤domaprohladno: октарин на ульту без к
06/27/2025 - 01:33:03: L 06/27/2025 - 01:33:03: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "октарин на ульту без к"
06/27/2025 - 01:33:04: 🖤domaprohladno: без кд
06/27/2025 - 01:33:04: L 06/27/2025 - 01:33:04: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "без кд"
06/27/2025 - 01:33:08: 🖤domaprohladno: но он заебет декрепифаем
06/27/2025 - 01:33:08: L 06/27/2025 - 01:33:08: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "но он заебет декрепифаем"
06/27/2025 - 01:33:11: ✞Пилот Болида✞: ФАНТОМКА ПРОСТО БАБОЧКУ ДЕЛАЙ
06/27/2025 - 01:33:11: L 06/27/2025 - 01:33:11: "✞Пилот Болида✞<13><[U:1:229840067]><#DOTA_BadGuys>" say_team "ФАНТОМКА ПРОСТО БАБОЧКУ ДЕЛАЙ"
06/27/2025 - 01:33:35: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:33:35: однаждыебался: у них топ пушится
06/27/2025 - 01:33:35: L 06/27/2025 - 01:33:35: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team "у них топ пушится"
06/27/2025 - 01:33:37: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:33:37: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:33:41: 🖤domaprohladno: помоги мне
06/27/2025 - 01:33:41: L 06/27/2025 - 01:33:41: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "помоги мне"
06/27/2025 - 01:33:42: 🖤domaprohladno: на пудже
06/27/2025 - 01:33:42: L 06/27/2025 - 01:33:42: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "на пудже"
06/27/2025 - 01:34:05: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:34:05: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:34:17: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:34:17: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:34:17: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:34:17: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:34:17: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:34:17: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:34:17: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:34:22: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:34:22: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:34:26: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:34:32: 🖤domaprohladno: нет там пугна заебет
06/27/2025 - 01:34:32: L 06/27/2025 - 01:34:32: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "нет там пугна заебет"
06/27/2025 - 01:34:36: 🖤domaprohladno: она не даст вк бить ваще
06/27/2025 - 01:34:36: L 06/27/2025 - 01:34:36: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "она не даст вк бить ваще"
06/27/2025 - 01:34:54: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:35:00: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:35:00: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:07: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:35:08: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:35:08: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:35:13: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:35:15: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:35:15: Sending full update to Client Капитан Прах (Капитан Прах can't find frame from tick -1)
06/27/2025 - 01:35:17: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:35:17: Client tried to execute invalid order (2). Specified ability is not actually an ability.
06/27/2025 - 01:35:38: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:35:38: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:35:43: dec4dence: го смок
06/27/2025 - 01:35:43: L 06/27/2025 - 01:35:43: "dec4dence<6><[U:1:1209125835]><#DOTA_BadGuys>" say_team "го смок"
06/27/2025 - 01:35:44: dec4dence: они на рошге
06/27/2025 - 01:35:44: L 06/27/2025 - 01:35:44: "dec4dence<6><[U:1:1209125835]><#DOTA_BadGuys>" say_team "они на рошге"
06/27/2025 - 01:35:56: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:35:57: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:35:57: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:35:57: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:35:59: 🖤domaprohladno: 4
06/27/2025 - 01:35:59: L 06/27/2025 - 01:35:59: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "4"
06/27/2025 - 01:36:16: Client tried to execute invalid order (61). Item is still in cooldown.
06/27/2025 - 01:36:16:  Ability: item_blade_mail
06/27/2025 - 01:36:17: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:36:17: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:36:20: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:36:20: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:36:21: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:36:21: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:36:21: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:36:21: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:36:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:36:23: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:36:25: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:36:25: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:36:25: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:36:25: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:36:25: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:36:25: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:36:25: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:36:26: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:36:30: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:36:30: Game code tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:36:30: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:36:30: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:36:30: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:36:31: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:36:31: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:36:31: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:36:34: Client tried to execute invalid order (21). Can't cast on target, target is a magic immune enemy.
06/27/2025 - 01:36:37: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:36:37:  Ability: disruptor_thunder_strike
06/27/2025 - 01:36:37: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:36:37: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:36:38: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:36:38:  Ability: disruptor_static_storm
06/27/2025 - 01:36:43: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:36:43: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:36:44: Client tried to execute invalid order (27). Target is invisible and is not on the unit's team.
06/27/2025 - 01:36:45: Client tried to execute invalid order (23). Can't attack target, target is attack immune.
06/27/2025 - 01:36:45: Client tried to execute invalid order (27). Target is invisible and is not on the unit's team.
06/27/2025 - 01:36:46: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:36:46:  Ability: disruptor_kinetic_field
06/27/2025 - 01:36:48: Game code tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:36:51: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:36:51:  Ability: pugna_nether_ward
06/27/2025 - 01:37:05: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:37:05:  Ability: pugna_nether_blast
06/27/2025 - 01:37:07: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:37:07: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:37:17: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:37:17: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:37:17: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:37:17: Client tried to execute invalid order (10). Order requires a rune target, but specified target is not a rune.
06/27/2025 - 01:37:19: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:37:19: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:37:28: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:37:33: Client tried to execute invalid order (20). Unit is dead.
06/27/2025 - 01:37:38: dec4dence: ну тп
06/27/2025 - 01:37:38: L 06/27/2025 - 01:37:38: "dec4dence<6><[U:1:1209125835]><#DOTA_BadGuys>" say_team "ну тп"
06/27/2025 - 01:37:40: dec4dence: дайте
06/27/2025 - 01:37:40: L 06/27/2025 - 01:37:40: "dec4dence<6><[U:1:1209125835]><#DOTA_BadGuys>" say_team "дайте"
06/27/2025 - 01:37:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:37:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:37:48: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:37:50: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:37:50: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:37:50: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:37:50: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:37:52: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:37:54: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:37:57: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:37:57:  Ability: disruptor_static_storm
06/27/2025 - 01:37:58: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:37:58:  Ability: disruptor_thunder_strike
06/27/2025 - 01:37:59: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:38:02: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:38:09: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:38:09: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:38:09: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:38:17: 🖤domaprohladno: согл рефреш
06/27/2025 - 01:38:17: L 06/27/2025 - 01:38:17: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "согл рефреш"
06/27/2025 - 01:38:19: 🖤domaprohladno: но я там вр кайтил
06/27/2025 - 01:38:19: L 06/27/2025 - 01:38:19: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "но я там вр кайтил"
06/27/2025 - 01:38:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:38:22: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:38:25: 🖤domaprohladno: она с хексом и бкб в меня бежала
06/27/2025 - 01:38:25: L 06/27/2025 - 01:38:25: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "она с хексом и бкб в меня бежала"
06/27/2025 - 01:38:26: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:38:26: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:38:27: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:36: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:38:41: 🖤domaprohladno: может на зевсе подраться с нами 
06/27/2025 - 01:38:41: L 06/27/2025 - 01:38:41: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "может на зевсе подраться с нами "
06/27/2025 - 01:38:52: Капитан Прах: меня томбав убивает
06/27/2025 - 01:38:52: L 06/27/2025 - 01:38:52: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "меня томбав убивает"
06/27/2025 - 01:39:04: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:39:11: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:39:11: Client tried to execute invalid order (9). Order requires a physical item target, but specified target is not a physical item.
06/27/2025 - 01:39:15: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:39:15:  Ability: disruptor_static_storm
06/27/2025 - 01:39:16: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:39:16:  Ability: disruptor_thunder_strike
06/27/2025 - 01:39:16: dec4dence: убейтье 
06/27/2025 - 01:39:16: L 06/27/2025 - 01:39:16: "dec4dence<6><[U:1:1209125835]><#DOTA_BadGuys>" say_team "убейтье "
06/27/2025 - 01:39:17: Client tried to execute invalid order (31). Order invalid for units with movement capability DOTA_UNIT_CAP_MOVE_NONE.
06/27/2025 - 01:39:17: Client tried to execute invalid order (31). Order invalid for units with movement capability DOTA_UNIT_CAP_MOVE_NONE.
06/27/2025 - 01:39:17: Client tried to execute invalid order (31). Order invalid for units with movement capability DOTA_UNIT_CAP_MOVE_NONE.
06/27/2025 - 01:39:18: Client tried to execute invalid order (31). Order invalid for units with movement capability DOTA_UNIT_CAP_MOVE_NONE.
06/27/2025 - 01:39:18: Client tried to execute invalid order (31). Order invalid for units with movement capability DOTA_UNIT_CAP_MOVE_NONE.
06/27/2025 - 01:39:18: Client tried to execute invalid order (31). Order invalid for units with movement capability DOTA_UNIT_CAP_MOVE_NONE.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:19: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:20: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:39:20: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:39:20: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:39:35: ✞Пилот Болида✞: ФАНТОМК АНЕ СЛУШАЙ ИХ
06/27/2025 - 01:39:35: L 06/27/2025 - 01:39:35: "✞Пилот Болида✞<13><[U:1:229840067]><#DOTA_BadGuys>" say_team "ФАНТОМК АНЕ СЛУШАЙ ИХ"
06/27/2025 - 01:39:40: ✞Пилот Болида✞: ТЫ НОРМАЛЬНЫЙ
06/27/2025 - 01:39:40: L 06/27/2025 - 01:39:40: "✞Пилот Болида✞<13><[U:1:229840067]><#DOTA_BadGuys>" say_team "ТЫ НОРМАЛЬНЫЙ"
06/27/2025 - 01:39:42: ✞Пилот Болида✞: ЛЕЙН СТОЯЛИ
06/27/2025 - 01:39:42: L 06/27/2025 - 01:39:42: "✞Пилот Болида✞<13><[U:1:229840067]><#DOTA_BadGuys>" say_team "ЛЕЙН СТОЯЛИ"
06/27/2025 - 01:39:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:44: Client tried to execute invalid order (41). Order invalid for units with attack capability DOTA_UNIT_CAP_NO_ATTACK.
06/27/2025 - 01:39:48: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:39:52: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:40:01: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:40:01:  Ability: pugna_nether_blast
06/27/2025 - 01:40:01: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:40:01:  Ability: pugna_nether_blast
06/27/2025 - 01:40:05: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:40:05:  Ability: disruptor_thunder_strike
06/27/2025 - 01:40:09: Client tried to execute invalid order (45). Target position is off the map.
06/27/2025 - 01:40:14: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:40:14:  Ability: undying_soul_rip
06/27/2025 - 01:40:14: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:40:14:  Ability: undying_soul_rip
06/27/2025 - 01:40:15: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:15: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:15: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:15: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:15: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:15: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:15: Game code tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:40:15:  Ability: undying_decay
06/27/2025 - 01:40:16: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:16: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:16: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:16: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:16: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:16: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:16: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:16: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:17: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:17: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:17: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:17: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:17: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:17: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:17: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:17: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:17: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:17: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:17: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:17: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:18: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:18: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:19: Sending full update to Client Капитан Прах (Капитан Прах can't find frame from tick -1)
06/27/2025 - 01:40:19: DataTable warning: : Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:19: DataTable warning: npc_dota_hero_windrunner: Out-of-range value (6.000000) in SendPropFloat 'm_flPlaybackRate', clamping.
06/27/2025 - 01:40:21: Client tried to execute invalid order (2). Specified ability is not actually an ability.
06/27/2025 - 01:40:29: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:40:29:  Ability: disruptor_static_storm
06/27/2025 - 01:40:30: Client tried to execute invalid order (15). Ability is still in cooldown.
06/27/2025 - 01:40:30:  Ability: disruptor_thunder_strike
06/27/2025 - 01:40:36: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:36: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:36: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:36: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:36: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:36: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:45: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:45: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:45: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:45: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:45: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:45: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:40:54: 🖤domaprohladno: 2в5
06/27/2025 - 01:40:54: L 06/27/2025 - 01:40:54: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "2в5"
06/27/2025 - 01:40:57: Client "АЛДИЯРЧИК" connected (188.244.32.161:54144).
06/27/2025 - 01:40:57: 🖤domaprohladno: ну минер
06/27/2025 - 01:40:57: L 06/27/2025 - 01:40:57: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "ну минер"
06/27/2025 - 01:40:59: Unable to create object of type 2017
06/27/2025 - 01:41:00: 🖤domaprohladno: ну ладно
06/27/2025 - 01:41:00: L 06/27/2025 - 01:41:00: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say_team "ну ладно"
06/27/2025 - 01:41:07: S:Gamerules: entering state 'DOTA_GAMERULES_STATE_POST_GAME'
06/27/2025 - 01:41:07: PIM [0] processed, ok: 1
06/27/2025 - 01:41:07: PIM [1] processed, ok: 1
06/27/2025 - 01:41:07: PIM [2] processed, ok: 1
06/27/2025 - 01:41:07: PIM [3] processed, ok: 1
06/27/2025 - 01:41:07: PIM [4] processed, ok: 1
06/27/2025 - 01:41:07: PIM [5] processed, ok: 1
06/27/2025 - 01:41:07: PIM [6] processed, ok: 1
06/27/2025 - 01:41:07: PIM [7] processed, ok: 1
06/27/2025 - 01:41:07: PIM [8] processed, ok: 1
06/27/2025 - 01:41:07: PIM [9] processed, ok: 1
06/27/2025 - 01:41:07: {"matchId": 35720, "winner": 2, "duration": 3472, "type": 1, "gameMode": 22, "timestamp": 1750988467, "server": "46.174.53.173:28320", "players": [{"hero": "npc_dota_hero_techies", "party_id": "cf6c38fa-1a8f-4132-a4c0-ba3c4e8b96b2", "steam_id": 136893774, "team": 2, "level": 21, "kills": 13, "deaths": 12, "assists": 2, "gpm": 323, "xpm": 401, "last_hits": 86, "denies": 0, "tower_kills": 0, "roshan_kills": 1008.0, "networth": 15630, "connection": 2, "items": ["item_bloodstone", "item_empty", "item_travel_boots", "item_ultimate_scepter", "item_empty", "item_empty"]}, {"hero": "npc_dota_hero_zuus", "party_id": "3666fb94-97bd-486a-ba27-d9e159378fbe", "steam_id": 1837892499, "team": 2, "level": 19, "kills": 5, "deaths": 8, "assists": 19, "gpm": 311, "xpm": 325, "last_hits": 132, "denies": 4, "tower_kills": 0, "roshan_kills": 1991.0, "networth": 14948, "connection": 2, "items": ["item_cyclone", "item_refresher", "item_bottle", "item_arcane_boots", "item_null_talisman", "item_point_booster"]}, {"hero": "npc_dota_
06/27/2025 - 01:41:07: CDOTAUserMsg_PlayerMMR check: lobbyType=-1, GameEndReason=0
06/27/2025 - 01:41:07: GameRules change to: 6
06/27/2025 - 01:41:07: GameRules change to: 6
06/27/2025 - 01:41:07: GameRules change to: 6
06/27/2025 - 01:41:07: CDOTAGCServerSystem::MatchSignOut gathering sign out stats. Duration in minutes = 57.867954
06/27/2025 - 01:41:07:    Player 76561198097159502 Account 136893774 TotalGold = 20049.000000 TotalXP = 24895.000000 nGoldPerMinute = 346 nXPPerMinute = 430
06/27/2025 - 01:41:07:    Player 76561199798158227 Account 1837892499 TotalGold = 19312.000000 TotalXP = 20164.000000 nGoldPerMinute = 333 nXPPerMinute = 348
06/27/2025 - 01:41:07:    Player 76561198146350771 Account 186085043 TotalGold = 18981.000000 TotalXP = 24889.000000 nGoldPerMinute = 328 nXPPerMinute = 430
06/27/2025 - 01:41:07:    Player 76561198262463011 Account 302197283 TotalGold = 33519.000000 TotalXP = 32811.000000 nGoldPerMinute = 579 nXPPerMinute = 566
06/27/2025 - 01:41:07:    Player 76561198113328202 Account 153062474 TotalGold = 23158.000000 TotalXP = 24887.000000 nGoldPerMinute = 400 nXPPerMinute = 430
06/27/2025 - 01:41:07:    Player 76561199869309987 Account 1909044259 TotalGold = 12036.000000 TotalXP = 7215.000000 nGoldPerMinute = 207 nXPPerMinute = 124
06/27/2025 - 01:41:07:    Player 76561198282714902 Account 322449174 TotalGold = 20656.000000 TotalXP = 29293.000000 nGoldPerMinute = 356 nXPPerMinute = 506
06/27/2025 - 01:41:07:    Player 76561198990699474 Account 1030433746 TotalGold = 27927.000000 TotalXP = 32914.000000 nGoldPerMinute = 482 nXPPerMinute = 568
06/27/2025 - 01:41:07:    Player 76561198190105795 Account 229840067 TotalGold = 23035.000000 TotalXP = 24482.000000 nGoldPerMinute = 398 nXPPerMinute = 423
06/27/2025 - 01:41:07:    Player 76561199169391563 Account 1209125835 TotalGold = 26944.000000 TotalXP = 32202.000000 nGoldPerMinute = 465 nXPPerMinute = 556
06/27/2025 - 01:41:07: Match signout:  duration = 3472 (3472.077072) good guys win = 1
06/27/2025 - 01:41:07:   Match start date: Fri Jun 27 00:41:40 2025
06/27/2025 - 01:41:07:   Num players on teams:  Good: 5  Bad: 5
06/27/2025 - 01:41:07: Team 0 Player 0 m_unAccountID = 76561198097159502  Items: 121, 0, 48, 108, 0, 0
06/27/2025 - 01:41:07:   LastHit = 86  Deny = 0  ClaimedMiss = 16  ClaimedDeny = 0  Miss = 7
06/27/2025 - 01:41:07:   Level: 21 Gold: 4080  KDA: 13 / 12 / 2
06/27/2025 - 01:41:07:   Scaled Player Damage: 17922 Scaled Building Damage: 974 Scaled Healing: 422
06/27/2025 - 01:41:07:   XP per min: 346  Gold per min: 430  Claimed Farm: 4498  Support Gold 200
06/27/2025 - 01:41:07: Team 0 Player 1 m_unAccountID = 76561199798158227  Items: 100, 110, 41, 180, 77, 60
06/27/2025 - 01:41:07:   LastHit = 132  Deny = 4  ClaimedMiss = 73  ClaimedDeny = 10  Miss = 20
06/27/2025 - 01:41:07:   Level: 19 Gold: 78  KDA: 5 / 8 / 19
06/27/2025 - 01:41:07:   Scaled Player Damage: 15064 Scaled Building Damage: 341 Scaled Healing: 566
06/27/2025 - 01:41:07:   XP per min: 333  Gold per min: 348  Claimed Farm: 8854  Support Gold 0
06/27/2025 - 01:41:07: Team 0 Player 2 m_unAccountID = 76561198146350771  Items: 0, 214, 36, 127, 90, 108
06/27/2025 - 01:41:07:   LastHit = 136  Deny = 1  ClaimedMiss = 42  ClaimedDeny = 0  Miss = 20
06/27/2025 - 01:41:07:   Level: 21 Gold: 3176  KDA: 1 / 11 / 15
06/27/2025 - 01:41:07:   Scaled Player Damage: 4542 Scaled Building Damage: 948 Scaled Healing: 0
06/27/2025 - 01:41:07:   XP per min: 328  Gold per min: 430  Claimed Farm: 7664  Support Gold 735
06/27/2025 - 01:41:07: Team 0 Player 3 m_unAccountID = 76561198262463011  Items: 116, 112, 137, 135, 1, 63
06/27/2025 - 01:41:07:   LastHit = 375  Deny = 5  ClaimedMiss = 57  ClaimedDeny = 2  Miss = 17
06/27/2025 - 01:41:07:   Level: 25 Gold: 5932  KDA: 14 / 8 / 15
06/27/2025 - 01:41:07:   Scaled Player Damage: 25917 Scaled Building Damage: 2899 Scaled Healing: 356
06/27/2025 - 01:41:07:   XP per min: 579  Gold per min: 566  Claimed Farm: 18559  Support Gold 0
06/27/2025 - 01:41:07: Team 0 Player 4 m_unAccountID = 76561198113328202  Items: 180, 0, 1, 254, 190, 108
06/27/2025 - 01:41:07:   LastHit = 83  Deny = 3  ClaimedMiss = 25  ClaimedDeny = 0  Miss = 28
06/27/2025 - 01:41:07:   Level: 21 Gold: 3973  KDA: 14 / 6 / 15
06/27/2025 - 01:41:07:   Scaled Player Damage: 16265 Scaled Building Damage: 1631 Scaled Healing: 0
06/27/2025 - 01:41:07:   XP per min: 400  Gold per min: 430  Claimed Farm: 4801  Support Gold 3235
06/27/2025 - 01:41:07: Team 1 Player 0 m_unAccountID = 76561199869309987  Items: 0, 0, 0, 0, 0, 0
06/27/2025 - 01:41:07: *** Left at time 24:57 ***
06/27/2025 - 01:41:07:   LastHit = 77  Deny = 2  ClaimedMiss = 17  ClaimedDeny = 1  Miss = 7
06/27/2025 - 01:41:07:   Level: 11 Gold: 2  KDA: 4 / 14 / 5
06/27/2025 - 01:41:07:   Scaled Player Damage: 6040 Scaled Building Damage: 214 Scaled Healing: 0
06/27/2025 - 01:41:07:   XP per min: 207  Gold per min: 124  Claimed Farm: 3990  Support Gold 0
06/27/2025 - 01:41:07: Team 1 Player 1 m_unAccountID = 76561198282714902  Items: 0, 242, 127, 9, 48, 90
06/27/2025 - 01:41:07:   LastHit = 138  Deny = 3  ClaimedMiss = 48  ClaimedDeny = 0  Miss = 23
06/27/2025 - 01:41:07:   Level: 23 Gold: 645  KDA: 5 / 8 / 24
06/27/2025 - 01:41:07:   Scaled Player Damage: 12066 Scaled Building Damage: 581 Scaled Healing: 1275
06/27/2025 - 01:41:07:   XP per min: 356  Gold per min: 506  Claimed Farm: 7821  Support Gold 2620
06/27/2025 - 01:41:07: Team 1 Player 2 m_unAccountID = 76561198990699474  Items: 168, 52, 141, 1, 116, 63
06/27/2025 - 01:41:07:   LastHit = 348  Deny = 11  ClaimedMiss = 44  ClaimedDeny = 0  Miss = 12
06/27/2025 - 01:41:07:   Level: 25 Gold: 1197  KDA: 7 / 10 / 7
06/27/2025 - 01:41:07:   Scaled Player Damage: 14350 Scaled Building Damage: 600 Scaled Healing: 0
06/27/2025 - 01:41:07:   XP per min: 482  Gold per min: 568  Claimed Farm: 15288  Support Gold 120
06/27/2025 - 01:41:07: Team 1 Player 3 m_unAccountID = 76561198190105795  Items: 212, 53, 254, 108, 235, 214
06/27/2025 - 01:41:07:   LastHit = 232  Deny = 6  ClaimedMiss = 48  ClaimedDeny = 0  Miss = 17
06/27/2025 - 01:41:07:   Level: 21 Gold: 996  KDA: 8 / 10 / 8
06/27/2025 - 01:41:07:   Scaled Player Damage: 12793 Scaled Building Damage: 714 Scaled Healing: 2485
06/27/2025 - 01:41:07:   XP per min: 398  Gold per min: 423  Claimed Farm: 11577  Support Gold 295
06/27/2025 - 01:41:07: Team 1 Player 4 m_unAccountID = 76561199169391563  Items: 96, 135, 116, 123, 48, 50
06/27/2025 - 01:41:07:   LastHit = 277  Deny = 13  ClaimedMiss = 61  ClaimedDeny = 0  Miss = 17
06/27/2025 - 01:41:07:   Level: 24 Gold: 1294  KDA: 11 / 5 / 12
06/27/2025 - 01:41:07:   Scaled Player Damage: 18183 Scaled Building Damage: 577 Scaled Healing: 0
06/27/2025 - 01:41:07:   XP per min: 465  Gold per min: 556  Claimed Farm: 14179  Support Gold 0
06/27/2025 - 01:41:07: KILLEATER: Signing out with 0 adjustments
06/27/2025 - 01:41:07: KILLEATER: Message has 0 player blocks
06/27/2025 - 01:41:07: SIGNOUT: Job created, Protobuf:
06/27/2025 - 01:41:07: duration: 3472
06/27/2025 - 01:41:07: good_guys_win: true
06/27/2025 - 01:41:07: date: 1750984900
06/27/2025 - 01:41:07: num_players: 5
06/27/2025 - 01:41:07: num_players: 5
06/27/2025 - 01:41:07: teams {
06/27/2025 - 01:41:07:   players {
06/27/2025 - 01:41:07:     steam_id: 76561198097159502
06/27/2025 - 01:41:07:     hero_id: 105
06/27/2025 - 01:41:07:     items: 121
06/27/2025 - 01:41:07:     items: 0
06/27/2025 - 01:41:07:     items: 48
06/27/2025 - 01:41:07:     items: 108
06/27/2025 - 01:41:07:     items: 0
06/27/2025 - 01:41:07:     items: 0
06/27/2025 - 01:41:07:     gold: 4080
06/27/2025 - 01:41:07:     kills: 13
06/27/2025 - 01:41:07:     deaths: 12
06/27/2025 - 01:41:07:     assists: 2
06/27/2025 - 01:41:07:     leaver_status: 0
06/27/2025 - 01:41:07:     last_hits: 86
06/27/2025 - 01:41:07:     denies: 0
06/27/2025 - 01:41:07:     gold_per_min: 346
06/27/2025 - 01:41:07:     xp_per_minute: 430
06/27/2025 - 01:41:07:     gold_spent: 17300
06/27/2025 - 01:41:07:     level: 21
06/27/2025 - 01:41:07:     hero_damage: 17922
06/27/2025 - 01:41:07:     tower_damage: 974
06/27/2025 - 01:41:07:     hero_healing: 422
06/27/2025 - 01:41:07:     time_last_seen: 0
06/27/2025 - 01:41:07:     support_ability_value: 1290
06/27/2025 - 01:41:07:     party_id: 0
06/27/2025 - 01:41:07:     scaled_kills: 13.03444
06/27/2025 - 01:41:07:     scaled_deaths: 12
06/27/2025 - 01:41:07:     scaled_assists: 2.0069332
06/27/2025 - 01:41:07:     claimed_farm_gold: 4498
06/27/2025 - 01:41:07:     support_gold: 200
06/27/2025 - 01:41:07:     claimed_denies: 0
06/27/2025 - 01:41:07:     claimed_misses: 16
06/27/2025 - 01:41:07:     misses: 7
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5599
06/27/2025 - 01:41:07:       time: 143
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5601
06/27/2025 - 01:41:07:       time: 495
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5599
06/27/2025 - 01:41:07:       time: 579
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5601
06/27/2025 - 01:41:07:       time: 758
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5599
06/27/2025 - 01:41:07:       time: 864
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5602
06/27/2025 - 01:41:07:       time: 939
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5599
06/27/2025 - 01:41:07:       time: 1035
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5600
06/27/2025 - 01:41:07:       time: 1211
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5601
06/27/2025 - 01:41:07:       time: 1374
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5601
06/27/2025 - 01:41:07:       time: 1516
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5600
06/27/2025 - 01:41:07:       time: 1654
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5602
06/27/2025 - 01:41:07:       time: 1894
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5600
06/27/2025 - 01:41:07:       time: 1973
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5600
06/27/2025 - 01:41:07:       time: 2127
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2135
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5602
06/27/2025 - 01:41:07:       time: 2289
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2611
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3079
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3083
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3430
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3512
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     net_worth: 15630
06/27/2025 - 01:41:07:   }
06/27/2025 - 01:41:07:   players {
06/27/2025 - 01:41:07:     steam_id: 76561199798158227
06/27/2025 - 01:41:07:     hero_id: 22
06/27/2025 - 01:41:07:     items: 100
06/27/2025 - 01:41:07:     items: 110
06/27/2025 - 01:41:07:     items: 41
06/27/2025 - 01:41:07:     items: 180
06/27/2025 - 01:41:07:     items: 77
06/27/2025 - 01:41:07:     items: 60
06/27/2025 - 01:41:07:     gold: 78
06/27/2025 - 01:41:07:     kills: 5
06/27/2025 - 01:41:07:     deaths: 8
06/27/2025 - 01:41:07:     assists: 19
06/27/2025 - 01:41:07:     leaver_status: 0
06/27/2025 - 01:41:07:     last_hits: 132
06/27/2025 - 01:41:07:     denies: 4
06/27/2025 - 01:41:07:     gold_per_min: 333
06/27/2025 - 01:41:07:     xp_per_minute: 348
06/27/2025 - 01:41:07:     gold_spent: 21295
06/27/2025 - 01:41:07:     level: 19
06/27/2025 - 01:41:07:     hero_damage: 15064
06/27/2025 - 01:41:07:     tower_damage: 341
06/27/2025 - 01:41:07:     hero_healing: 566
06/27/2025 - 01:41:07:     time_last_seen: 0
06/27/2025 - 01:41:07:     support_ability_value: 183
06/27/2025 - 01:41:07:     party_id: 0
06/27/2025 - 01:41:07:     scaled_kills: 4.9709864
06/27/2025 - 01:41:07:     scaled_deaths: 8
06/27/2025 - 01:41:07:     scaled_assists: 18.981281
06/27/2025 - 01:41:07:     claimed_farm_gold: 8854
06/27/2025 - 01:41:07:     support_gold: 0
06/27/2025 - 01:41:07:     claimed_denies: 10
06/27/2025 - 01:41:07:     claimed_misses: 73
06/27/2025 - 01:41:07:     misses: 20
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5110
06/27/2025 - 01:41:07:       time: 147
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5112
06/27/2025 - 01:41:07:       time: 283
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5110
06/27/2025 - 01:41:07:       time: 325
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5111
06/27/2025 - 01:41:07:       time: 406
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5110
06/27/2025 - 01:41:07:       time: 496
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5113
06/27/2025 - 01:41:07:       time: 593
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5111
06/27/2025 - 01:41:07:       time: 670
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5111
06/27/2025 - 01:41:07:       time: 793
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5111
06/27/2025 - 01:41:07:       time: 920
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5110
06/27/2025 - 01:41:07:       time: 1174
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5113
06/27/2025 - 01:41:07:       time: 1311
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5112
06/27/2025 - 01:41:07:       time: 1707
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5112
06/27/2025 - 01:41:07:       time: 1960
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5112
06/27/2025 - 01:41:07:       time: 2141
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2436
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5113
06/27/2025 - 01:41:07:       time: 2617
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3245
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3432
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3639
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     net_worth: 14948
06/27/2025 - 01:41:07:   }
06/27/2025 - 01:41:07:   players {
06/27/2025 - 01:41:07:     steam_id: 76561198146350771
06/27/2025 - 01:41:07:     hero_id: 14
06/27/2025 - 01:41:07:     items: 0
06/27/2025 - 01:41:07:     items: 214
06/27/2025 - 01:41:07:     items: 36
06/27/2025 - 01:41:07:     items: 127
06/27/2025 - 01:41:07:     items: 90
06/27/2025 - 01:41:07:     items: 108
06/27/2025 - 01:41:07:     gold: 3176
06/27/2025 - 01:41:07:     kills: 1
06/27/2025 - 01:41:07:     deaths: 11
06/27/2025 - 01:41:07:     assists: 15
06/27/2025 - 01:41:07:     leaver_status: 0
06/27/2025 - 01:41:07:     last_hits: 136
06/27/2025 - 01:41:07:     denies: 1
06/27/2025 - 01:41:07:     gold_per_min: 328
06/27/2025 - 01:41:07:     xp_per_minute: 430
06/27/2025 - 01:41:07:     gold_spent: 12550
06/27/2025 - 01:41:07:     level: 21
06/27/2025 - 01:41:07:     hero_damage: 4542
06/27/2025 - 01:41:07:     tower_damage: 948
06/27/2025 - 01:41:07:     hero_healing: 0
06/27/2025 - 01:41:07:     time_last_seen: 0
06/27/2025 - 01:41:07:     support_ability_value: 2560
06/27/2025 - 01:41:07:     party_id: 0
06/27/2025 - 01:41:07:     scaled_kills: 1.0026491
06/27/2025 - 01:41:07:     scaled_deaths: 11
06/27/2025 - 01:41:07:     scaled_assists: 14.925118
06/27/2025 - 01:41:07:     claimed_farm_gold: 7664
06/27/2025 - 01:41:07:     support_gold: 735
06/27/2025 - 01:41:07:     claimed_denies: 0
06/27/2025 - 01:41:07:     claimed_misses: 42
06/27/2025 - 01:41:07:     misses: 20
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5075
06/27/2025 - 01:41:07:       time: 147
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5076
06/27/2025 - 01:41:07:       time: 332
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5075
06/27/2025 - 01:41:07:       time: 425
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5074
06/27/2025 - 01:41:07:       time: 521
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5076
06/27/2025 - 01:41:07:       time: 675
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5077
06/27/2025 - 01:41:07:       time: 885
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5074
06/27/2025 - 01:41:07:       time: 1163
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5074
06/27/2025 - 01:41:07:       time: 1278
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5076
06/27/2025 - 01:41:07:       time: 1466
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5076
06/27/2025 - 01:41:07:       time: 1561
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5077
06/27/2025 - 01:41:07:       time: 1591
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5075
06/27/2025 - 01:41:07:       time: 2039
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5075
06/27/2025 - 01:41:07:       time: 2094
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5074
06/27/2025 - 01:41:07:       time: 2293
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2434
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5077
06/27/2025 - 01:41:07:       time: 2619
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2748
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2844
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3178
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3330
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3670
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     net_worth: 14746
06/27/2025 - 01:41:07:   }
06/27/2025 - 01:41:07:   players {
06/27/2025 - 01:41:07:     steam_id: 76561198262463011
06/27/2025 - 01:41:07:     hero_id: 42
06/27/2025 - 01:41:07:     items: 116
06/27/2025 - 01:41:07:     items: 112
06/27/2025 - 01:41:07:     items: 137
06/27/2025 - 01:41:07:     items: 135
06/27/2025 - 01:41:07:     items: 1
06/27/2025 - 01:41:07:     items: 63
06/27/2025 - 01:41:07:     gold: 5932
06/27/2025 - 01:41:07:     kills: 14
06/27/2025 - 01:41:07:     deaths: 8
06/27/2025 - 01:41:07:     assists: 15
06/27/2025 - 01:41:07:     leaver_status: 0
06/27/2025 - 01:41:07:     last_hits: 375
06/27/2025 - 01:41:07:     denies: 5
06/27/2025 - 01:41:07:     gold_per_min: 579
06/27/2025 - 01:41:07:     xp_per_minute: 566
06/27/2025 - 01:41:07:     gold_spent: 24900
06/27/2025 - 01:41:07:     level: 25
06/27/2025 - 01:41:07:     hero_damage: 25917
06/27/2025 - 01:41:07:     tower_damage: 2899
06/27/2025 - 01:41:07:     hero_healing: 356
06/27/2025 - 01:41:07:     time_last_seen: 0
06/27/2025 - 01:41:07:     support_ability_value: 6290
06/27/2025 - 01:41:07:     party_id: 0
06/27/2025 - 01:41:07:     scaled_kills: 13.952571
06/27/2025 - 01:41:07:     scaled_deaths: 8
06/27/2025 - 01:41:07:     scaled_assists: 14.967412
06/27/2025 - 01:41:07:     claimed_farm_gold: 18559
06/27/2025 - 01:41:07:     support_gold: 0
06/27/2025 - 01:41:07:     claimed_denies: 2
06/27/2025 - 01:41:07:     claimed_misses: 57
06/27/2025 - 01:41:07:     misses: 17
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5086
06/27/2025 - 01:41:07:       time: 251
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5088
06/27/2025 - 01:41:07:       time: 322
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5086
06/27/2025 - 01:41:07:       time: 372
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5088
06/27/2025 - 01:41:07:       time: 420
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5086
06/27/2025 - 01:41:07:       time: 523
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5087
06/27/2025 - 01:41:07:       time: 641
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5086
06/27/2025 - 01:41:07:       time: 833
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5089
06/27/2025 - 01:41:07:       time: 944
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5088
06/27/2025 - 01:41:07:       time: 1195
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5088
06/27/2025 - 01:41:07:       time: 1283
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5089
06/27/2025 - 01:41:07:       time: 1341
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5087
06/27/2025 - 01:41:07:       time: 1455
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5087
06/27/2025 - 01:41:07:       time: 1519
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5087
06/27/2025 - 01:41:07:       time: 1718
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 1761
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 1899
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5089
06/27/2025 - 01:41:07:       time: 2038
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2160
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2406
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2632
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2709
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2764
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2856
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3242
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3446
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     net_worth: 29432
06/27/2025 - 01:41:07:   }
06/27/2025 - 01:41:07:   players {
06/27/2025 - 01:41:07:     steam_id: 76561198113328202
06/27/2025 - 01:41:07:     hero_id: 87
06/27/2025 - 01:41:07:     items: 180
06/27/2025 - 01:41:07:     items: 0
06/27/2025 - 01:41:07:     items: 1
06/27/2025 - 01:41:07:     items: 254
06/27/2025 - 01:41:07:     items: 190
06/27/2025 - 01:41:07:     items: 108
06/27/2025 - 01:41:07:     gold: 3973
06/27/2025 - 01:41:07:     kills: 14
06/27/2025 - 01:41:07:     deaths: 6
06/27/2025 - 01:41:07:     assists: 15
06/27/2025 - 01:41:07:     leaver_status: 0
06/27/2025 - 01:41:07:     last_hits: 83
06/27/2025 - 01:41:07:     denies: 3
06/27/2025 - 01:41:07:     gold_per_min: 400
06/27/2025 - 01:41:07:     xp_per_minute: 430
06/27/2025 - 01:41:07:     gold_spent: 18455
06/27/2025 - 01:41:07:     level: 21
06/27/2025 - 01:41:07:     hero_damage: 16265
06/27/2025 - 01:41:07:     tower_damage: 1631
06/27/2025 - 01:41:07:     hero_healing: 0
06/27/2025 - 01:41:07:     time_last_seen: 0
06/27/2025 - 01:41:07:     support_ability_value: 4810
06/27/2025 - 01:41:07:     party_id: 0
06/27/2025 - 01:41:07:     scaled_kills: 13.988899
06/27/2025 - 01:41:07:     scaled_deaths: 6
06/27/2025 - 01:41:07:     scaled_assists: 14.967412
06/27/2025 - 01:41:07:     claimed_farm_gold: 4801
06/27/2025 - 01:41:07:     support_gold: 3235
06/27/2025 - 01:41:07:     claimed_denies: 0
06/27/2025 - 01:41:07:     claimed_misses: 25
06/27/2025 - 01:41:07:     misses: 28
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5458
06/27/2025 - 01:41:07:       time: 267
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5459
06/27/2025 - 01:41:07:       time: 294
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5458
06/27/2025 - 01:41:07:       time: 403
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5460
06/27/2025 - 01:41:07:       time: 488
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5458
06/27/2025 - 01:41:07:       time: 556
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5461
06/27/2025 - 01:41:07:       time: 703
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5458
06/27/2025 - 01:41:07:       time: 812
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5459
06/27/2025 - 01:41:07:       time: 853
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5459
06/27/2025 - 01:41:07:       time: 1036
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5459
06/27/2025 - 01:41:07:       time: 1312
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5461
06/27/2025 - 01:41:07:       time: 1390
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5460
06/27/2025 - 01:41:07:       time: 1556
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5460
06/27/2025 - 01:41:07:       time: 1647
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5460
06/27/2025 - 01:41:07:       time: 1758
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 1760
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5461
06/27/2025 - 01:41:07:       time: 2163
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2427
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2748
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3324
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3511
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3590
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     net_worth: 18373
06/27/2025 - 01:41:07:   }
06/27/2025 - 01:41:07: }
06/27/2025 - 01:41:07: teams {
06/27/2025 - 01:41:07:   players {
06/27/2025 - 01:41:07:     steam_id: 76561199869309987
06/27/2025 - 01:41:07:     hero_id: 103
06/27/2025 - 01:41:07:     items: 0
06/27/2025 - 01:41:07:     items: 0
06/27/2025 - 01:41:07:     items: 0
06/27/2025 - 01:41:07:     items: 0
06/27/2025 - 01:41:07:     items: 0
06/27/2025 - 01:41:07:     items: 0
06/27/2025 - 01:41:07:     gold: 2
06/27/2025 - 01:41:07:     kills: 4
06/27/2025 - 01:41:07:     deaths: 14
06/27/2025 - 01:41:07:     assists: 5
06/27/2025 - 01:41:07:     leaver_status: 1
06/27/2025 - 01:41:07:     last_hits: 77
06/27/2025 - 01:41:07:     denies: 2
06/27/2025 - 01:41:07:     gold_per_min: 207
06/27/2025 - 01:41:07:     xp_per_minute: 124
06/27/2025 - 01:41:07:     gold_spent: 5935
06/27/2025 - 01:41:07:     level: 11
06/27/2025 - 01:41:07:     hero_damage: 6040
06/27/2025 - 01:41:07:     tower_damage: 214
06/27/2025 - 01:41:07:     hero_healing: 0
06/27/2025 - 01:41:07:     time_last_seen: 1497
06/27/2025 - 01:41:07:     support_ability_value: 650
06/27/2025 - 01:41:07:     party_id: 0
06/27/2025 - 01:41:07:     scaled_kills: 4.0105963
06/27/2025 - 01:41:07:     scaled_deaths: 14
06/27/2025 - 01:41:07:     scaled_assists: 5.017333
06/27/2025 - 01:41:07:     claimed_farm_gold: 3990
06/27/2025 - 01:41:07:     support_gold: 0
06/27/2025 - 01:41:07:     claimed_denies: 1
06/27/2025 - 01:41:07:     claimed_misses: 17
06/27/2025 - 01:41:07:     misses: 7
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5591
06/27/2025 - 01:41:07:       time: 142
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5593
06/27/2025 - 01:41:07:       time: 338
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5591
06/27/2025 - 01:41:07:       time: 383
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5589
06/27/2025 - 01:41:07:       time: 540
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5591
06/27/2025 - 01:41:07:       time: 688
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5594
06/27/2025 - 01:41:07:       time: 886
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5591
06/27/2025 - 01:41:07:       time: 962
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5593
06/27/2025 - 01:41:07:       time: 1067
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5593
06/27/2025 - 01:41:07:       time: 1372
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5593
06/27/2025 - 01:41:07:       time: 1533
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5594
06/27/2025 - 01:41:07:       time: 1636
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     net_worth: 2
06/27/2025 - 01:41:07:   }
06/27/2025 - 01:41:07:   players {
06/27/2025 - 01:41:07:     steam_id: 76561198282714902
06/27/2025 - 01:41:07:     hero_id: 85
06/27/2025 - 01:41:07:     items: 0
06/27/2025 - 01:41:07:     items: 242
06/27/2025 - 01:41:07:     items: 127
06/27/2025 - 01:41:07:     items: 9
06/27/2025 - 01:41:07:     items: 48
06/27/2025 - 01:41:07:     items: 90
06/27/2025 - 01:41:07:     gold: 645
06/27/2025 - 01:41:07:     kills: 5
06/27/2025 - 01:41:07:     deaths: 8
06/27/2025 - 01:41:07:     assists: 24
06/27/2025 - 01:41:07:     leaver_status: 0
06/27/2025 - 01:41:07:     last_hits: 138
06/27/2025 - 01:41:07:     denies: 3
06/27/2025 - 01:41:07:     gold_per_min: 356
06/27/2025 - 01:41:07:     xp_per_minute: 506
06/27/2025 - 01:41:07:     gold_spent: 18685
06/27/2025 - 01:41:07:     level: 23
06/27/2025 - 01:41:07:     hero_damage: 12066
06/27/2025 - 01:41:07:     tower_damage: 581
06/27/2025 - 01:41:07:     hero_healing: 1275
06/27/2025 - 01:41:07:     time_last_seen: 0
06/27/2025 - 01:41:07:     support_ability_value: 6670
06/27/2025 - 01:41:07:     party_id: 0
06/27/2025 - 01:41:07:     scaled_kills: 5.0132456
06/27/2025 - 01:41:07:     scaled_deaths: 8
06/27/2025 - 01:41:07:     scaled_assists: 24.083206
06/27/2025 - 01:41:07:     claimed_farm_gold: 7821
06/27/2025 - 01:41:07:     support_gold: 2620
06/27/2025 - 01:41:07:     claimed_denies: 0
06/27/2025 - 01:41:07:     claimed_misses: 48
06/27/2025 - 01:41:07:     misses: 23
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5442
06/27/2025 - 01:41:07:       time: 186
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5444
06/27/2025 - 01:41:07:       time: 277
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5442
06/27/2025 - 01:41:07:       time: 322
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5444
06/27/2025 - 01:41:07:       time: 442
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5442
06/27/2025 - 01:41:07:       time: 613
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5447
06/27/2025 - 01:41:07:       time: 742
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5442
06/27/2025 - 01:41:07:       time: 877
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5443
06/27/2025 - 01:41:07:       time: 965
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5444
06/27/2025 - 01:41:07:       time: 1290
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5444
06/27/2025 - 01:41:07:       time: 1393
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5447
06/27/2025 - 01:41:07:       time: 1505
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5443
06/27/2025 - 01:41:07:       time: 1721
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5443
06/27/2025 - 01:41:07:       time: 1803
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5443
06/27/2025 - 01:41:07:       time: 1866
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 1931
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5447
06/27/2025 - 01:41:07:       time: 2253
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2353
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2520
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2625
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2820
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2935
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3133
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3384
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     net_worth: 14470
06/27/2025 - 01:41:07:   }
06/27/2025 - 01:41:07:   players {
06/27/2025 - 01:41:07:     steam_id: 76561198990699474
06/27/2025 - 01:41:07:     hero_id: 46
06/27/2025 - 01:41:07:     items: 168
06/27/2025 - 01:41:07:     items: 52
06/27/2025 - 01:41:07:     items: 141
06/27/2025 - 01:41:07:     items: 1
06/27/2025 - 01:41:07:     items: 116
06/27/2025 - 01:41:07:     items: 63
06/27/2025 - 01:41:07:     gold: 1197
06/27/2025 - 01:41:07:     kills: 7
06/27/2025 - 01:41:07:     deaths: 10
06/27/2025 - 01:41:07:     assists: 7
06/27/2025 - 01:41:07:     leaver_status: 0
06/27/2025 - 01:41:07:     last_hits: 348
06/27/2025 - 01:41:07:     denies: 11
06/27/2025 - 01:41:07:     gold_per_min: 482
06/27/2025 - 01:41:07:     xp_per_minute: 568
06/27/2025 - 01:41:07:     gold_spent: 24515
06/27/2025 - 01:41:07:     level: 25
06/27/2025 - 01:41:07:     hero_damage: 14350
06/27/2025 - 01:41:07:     tower_damage: 600
06/27/2025 - 01:41:07:     hero_healing: 0
06/27/2025 - 01:41:07:     time_last_seen: 0
06/27/2025 - 01:41:07:     support_ability_value: 850
06/27/2025 - 01:41:07:     party_id: 0
06/27/2025 - 01:41:07:     scaled_kills: 6.976285
06/27/2025 - 01:41:07:     scaled_deaths: 10
06/27/2025 - 01:41:07:     scaled_assists: 7.0242662
06/27/2025 - 01:41:07:     claimed_farm_gold: 15288
06/27/2025 - 01:41:07:     support_gold: 120
06/27/2025 - 01:41:07:     claimed_denies: 0
06/27/2025 - 01:41:07:     claimed_misses: 44
06/27/2025 - 01:41:07:     misses: 12
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5196
06/27/2025 - 01:41:07:       time: 140
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5194
06/27/2025 - 01:41:07:       time: 331
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5196
06/27/2025 - 01:41:07:       time: 381
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5194
06/27/2025 - 01:41:07:       time: 444
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5196
06/27/2025 - 01:41:07:       time: 560
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5194
06/27/2025 - 01:41:07:       time: 620
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5197
06/27/2025 - 01:41:07:       time: 714
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5194
06/27/2025 - 01:41:07:       time: 778
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5195
06/27/2025 - 01:41:07:       time: 942
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5195
06/27/2025 - 01:41:07:       time: 1040
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5196
06/27/2025 - 01:41:07:       time: 1155
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5195
06/27/2025 - 01:41:07:       time: 1416
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5197
06/27/2025 - 01:41:07:       time: 1533
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5195
06/27/2025 - 01:41:07:       time: 1636
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 1839
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5197
06/27/2025 - 01:41:07:       time: 2098
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2271
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2433
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2543
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2815
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2850
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2938
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3046
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3250
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3487
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     net_worth: 23717
06/27/2025 - 01:41:07:   }
06/27/2025 - 01:41:07:   players {
06/27/2025 - 01:41:07:     steam_id: 76561198190105795
06/27/2025 - 01:41:07:     hero_id: 45
06/27/2025 - 01:41:07:     items: 212
06/27/2025 - 01:41:07:     items: 53
06/27/2025 - 01:41:07:     items: 254
06/27/2025 - 01:41:07:     items: 108
06/27/2025 - 01:41:07:     items: 235
06/27/2025 - 01:41:07:     items: 214
06/27/2025 - 01:41:07:     gold: 996
06/27/2025 - 01:41:07:     kills: 8
06/27/2025 - 01:41:07:     deaths: 10
06/27/2025 - 01:41:07:     assists: 8
06/27/2025 - 01:41:07:     leaver_status: 0
06/27/2025 - 01:41:07:     last_hits: 232
06/27/2025 - 01:41:07:     denies: 6
06/27/2025 - 01:41:07:     gold_per_min: 398
06/27/2025 - 01:41:07:     xp_per_minute: 423
06/27/2025 - 01:41:07:     gold_spent: 19945
06/27/2025 - 01:41:07:     level: 21
06/27/2025 - 01:41:07:     hero_damage: 12793
06/27/2025 - 01:41:07:     tower_damage: 714
06/27/2025 - 01:41:07:     hero_healing: 2485
06/27/2025 - 01:41:07:     time_last_seen: 0
06/27/2025 - 01:41:07:     support_ability_value: 2580
06/27/2025 - 01:41:07:     party_id: 0
06/27/2025 - 01:41:07:     scaled_kills: 8.0211935
06/27/2025 - 01:41:07:     scaled_deaths: 10
06/27/2025 - 01:41:07:     scaled_assists: 8.0277328
06/27/2025 - 01:41:07:     claimed_farm_gold: 11577
06/27/2025 - 01:41:07:     support_gold: 295
06/27/2025 - 01:41:07:     claimed_denies: 0
06/27/2025 - 01:41:07:     claimed_misses: 48
06/27/2025 - 01:41:07:     misses: 17
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5186
06/27/2025 - 01:41:07:       time: 223
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5187
06/27/2025 - 01:41:07:       time: 331
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5186
06/27/2025 - 01:41:07:       time: 463
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5187
06/27/2025 - 01:41:07:       time: 616
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5186
06/27/2025 - 01:41:07:       time: 739
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5189
06/27/2025 - 01:41:07:       time: 944
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5186
06/27/2025 - 01:41:07:       time: 1092
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5187
06/27/2025 - 01:41:07:       time: 1212
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5188
06/27/2025 - 01:41:07:       time: 1573
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5187
06/27/2025 - 01:41:07:       time: 1731
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5189
06/27/2025 - 01:41:07:       time: 1766
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5188
06/27/2025 - 01:41:07:       time: 1930
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5188
06/27/2025 - 01:41:07:       time: 2096
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5188
06/27/2025 - 01:41:07:       time: 2245
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2469
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5189
06/27/2025 - 01:41:07:       time: 2617
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2711
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3004
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3177
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3272
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3438
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     net_worth: 19156
06/27/2025 - 01:41:07:   }
06/27/2025 - 01:41:07:   players {
06/27/2025 - 01:41:07:     steam_id: 76561199169391563
06/27/2025 - 01:41:07:     hero_id: 21
06/27/2025 - 01:41:07:     items: 96
06/27/2025 - 01:41:07:     items: 135
06/27/2025 - 01:41:07:     items: 116
06/27/2025 - 01:41:07:     items: 123
06/27/2025 - 01:41:07:     items: 48
06/27/2025 - 01:41:07:     items: 50
06/27/2025 - 01:41:07:     gold: 1294
06/27/2025 - 01:41:07:     kills: 11
06/27/2025 - 01:41:07:     deaths: 5
06/27/2025 - 01:41:07:     assists: 12
06/27/2025 - 01:41:07:     leaver_status: 0
06/27/2025 - 01:41:07:     last_hits: 277
06/27/2025 - 01:41:07:     denies: 13
06/27/2025 - 01:41:07:     gold_per_min: 465
06/27/2025 - 01:41:07:     xp_per_minute: 556
06/27/2025 - 01:41:07:     gold_spent: 28540
06/27/2025 - 01:41:07:     level: 24
06/27/2025 - 01:41:07:     hero_damage: 18183
06/27/2025 - 01:41:07:     tower_damage: 577
06/27/2025 - 01:41:07:     hero_healing: 0
06/27/2025 - 01:41:07:     time_last_seen: 0
06/27/2025 - 01:41:07:     support_ability_value: 2150
06/27/2025 - 01:41:07:     party_id: 0
06/27/2025 - 01:41:07:     scaled_kills: 11.029141
06/27/2025 - 01:41:07:     scaled_deaths: 5
06/27/2025 - 01:41:07:     scaled_assists: 11.999306
06/27/2025 - 01:41:07:     claimed_farm_gold: 14179
06/27/2025 - 01:41:07:     support_gold: 0
06/27/2025 - 01:41:07:     claimed_denies: 0
06/27/2025 - 01:41:07:     claimed_misses: 61
06/27/2025 - 01:41:07:     misses: 17
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5131
06/27/2025 - 01:41:07:       time: 254
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5132
06/27/2025 - 01:41:07:       time: 272
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5131
06/27/2025 - 01:41:07:       time: 317
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5130
06/27/2025 - 01:41:07:       time: 353
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5131
06/27/2025 - 01:41:07:       time: 449
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5133
06/27/2025 - 01:41:07:       time: 511
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5132
06/27/2025 - 01:41:07:       time: 580
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5132
06/27/2025 - 01:41:07:       time: 656
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5132
06/27/2025 - 01:41:07:       time: 851
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5131
06/27/2025 - 01:41:07:       time: 1003
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5133
06/27/2025 - 01:41:07:       time: 1139
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5130
06/27/2025 - 01:41:07:       time: 1385
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5130
06/27/2025 - 01:41:07:       time: 1514
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5130
06/27/2025 - 01:41:07:       time: 1690
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 1842
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5133
06/27/2025 - 01:41:07:       time: 2229
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2262
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2522
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2637
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2789
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 2879
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3003
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3054
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     ability_upgrades {
06/27/2025 - 01:41:07:       ability: 5002
06/27/2025 - 01:41:07:       time: 3349
06/27/2025 - 01:41:07:     }
06/27/2025 - 01:41:07:     net_worth: 25259
06/27/2025 - 01:41:07:   }
06/27/2025 - 01:41:07: }
06/27/2025 - 01:41:07: tower_status: 1828
06/27/2025 - 01:41:07: tower_status: 0
06/27/2025 - 01:41:07: barracks_status: 63
06/27/2025 - 01:41:07: barracks_status: 0
06/27/2025 - 01:41:07: cluster: 0
06/27/2025 - 01:41:07: server_addr: "46.174.53.173:28320"
06/27/2025 - 01:41:07: first_blood_time: 10
06/27/2025 - 01:41:07: game_balance: 0.0109701
06/27/2025 - 01:41:07: automatic_surrender: false
06/27/2025 - 01:41:07: server_version: 0
06/27/2025 - 01:41:07: additional_msgs {
06/27/2025 - 01:41:07:   id: 7545
06/27/2025 - 01:41:07:   contents: "\\n\\037\\010\\316\\252\\243A\\020-\\030\\n \\000(\\0000A8\\000@\\nH\\000P\\000X&\`Th\\000p\\000\\n \\010\\223\\207\\260\\354\\006\\020\\001\\030\\001 \\000(\\0000\\0228\\000@\\013H\\000P\\000X\\000\`\\000h\\000p\\000\\n\\037\\010\\263\\335\\335X\\020\\002\\030\\001 \\000(\\0000\\0178\\000@\\000H\\000P\\000X\\000\`\\000h\\000p\\000\\n!\\010\\243\\324\\214\\220\\001\\020\\004\\030\\002 \\000(\\0000\\0008\\000@\\004H\\000P\\000X\\000\`\\262\\th\\000p\\000\\n \\010\\312\\230\\376H\\020S\\030\\n \\010(\\0020\\207\\0018\\003@\`H\\000P\\000Xu\`\\000h\\000p\\000\\n!\\010\\226\\336\\340\\231\\001\\020\\024\\030\\004 \\000(\\0000\\0008\\000@\\005H\\000P\\001X\\021\`\\244\\007h\\000p\\000\\n \\010\\322\\327\\254\\353\\003\\020\\004\\030\\002 \\000(\\0000\\0018\\000@\\010H\\000P\\000X\\000\`\\000h\\000p\\000\\n\\037\\010\\303\\251\\314m\\020:\\030$ \\005(\\0040\\t8\\000@\\000H\\001P\\000X\\000\`\\000h\\000p\\000\\n \\010\\313\\227\\307\\300\\004\\0204\\030\\010 \\003(\\0030\\n8\\002@\\tH\\000P\\000X\\013\`Zh\\000p\\000"
06/27/2025 - 01:41:07: }
06/27/2025 - 01:41:07: average_networth_delta: 35
06/27/2025 - 01:41:07: networth_delta_min10: -3338
06/27/2025 - 01:41:07: networth_delta_min20: -2042
06/27/2025 - 01:41:07: maximum_losing_networth_lead: 7969
06/27/2025 - 01:41:07: average_experience_delta: -422
06/27/2025 - 01:41:07: experience_delta_min10: -1364
06/27/2025 - 01:41:07: experience_delta_min20: 718
06/27/2025 - 01:41:07: bonus_gold_winner_min10: 601
06/27/2025 - 01:41:07: bonus_gold_winner_min20: 2360
06/27/2025 - 01:41:07: bonus_gold_winner_total: 3812
06/27/2025 - 01:41:07: bonus_gold_loser_min10: 0
06/27/2025 - 01:41:07: bonus_gold_loser_min20: 0
06/27/2025 - 01:41:07: bonus_gold_loser_total: 1284
06/27/2025 - 01:41:07: match_id: 0
06/27/2025 - 01:41:07: region_id: 255
06/27/2025 - 01:41:07: players {
06/27/2025 - 01:41:07:   account_id: 322449174
06/27/2025 - 01:41:07:   ip: 1294845562
06/27/2025 - 01:41:07:   avg_ping_ms: 91
06/27/2025 - 01:41:07:   packet_loss: 0
06/27/2025 - 01:41:07:   ping_deviation: 15.206322
06/27/2025 - 01:41:07:   full_resends: 1
06/27/2025 - 01:41:07: }
06/27/2025 - 01:41:07: players {
06/27/2025 - 01:41:07:   account_id: 186085043
06/27/2025 - 01:41:07:   ip: 2965523583
06/27/2025 - 01:41:07:   avg_ping_ms: 97
06/27/2025 - 01:41:07:   packet_loss: 0
06/27/2025 - 01:41:07:   ping_deviation: 18.0014
06/27/2025 - 01:41:07:   full_resends: 1
06/27/2025 - 01:41:07: }
06/27/2025 - 01:41:07: players {
06/27/2025 - 01:41:07:   account_id: 1209125835
06/27/2025 - 01:41:07:   ip: 3587768588
06/27/2025 - 01:41:07:   avg_ping_ms: 98
06/27/2025 - 01:41:07:   packet_loss: 0.00031656446
06/27/2025 - 01:41:07:   ping_deviation: 8.2774172
06/27/2025 - 01:41:07:   full_resends: 1
06/27/2025 - 01:41:07: }
06/27/2025 - 01:41:07: players {
06/27/2025 - 01:41:07:   account_id: 1030433746
06/27/2025 - 01:41:07:   ip: 2459858534
06/27/2025 - 01:41:07:   avg_ping_ms: 100
06/27/2025 - 01:41:07:   packet_loss: 9.0869435e-06
06/27/2025 - 01:41:07:   ping_deviation: 8.54995
06/27/2025 - 01:41:07:   full_resends: 1
06/27/2025 - 01:41:07: }
06/27/2025 - 01:41:07: players {
06/27/2025 - 01:41:07:   account_id: 302197283
06/27/2025 - 01:41:07:   ip: 3165278518
06/27/2025 - 01:41:07:   avg_ping_ms: 135
06/27/2025 - 01:41:07:   packet_loss: 2.7204222e-05
06/27/2025 - 01:41:07:   ping_deviation: 18.673916
06/27/2025 - 01:41:07:   full_resends: 1
06/27/2025 - 01:41:07: }
06/27/2025 - 01:41:07: players {
06/27/2025 - 01:41:07:   account_id: 153062474
06/27/2025 - 01:41:07:   ip: 1595531492
06/27/2025 - 01:41:07:   avg_ping_ms: 80
06/27/2025 - 01:41:07:   packet_loss: 0
06/27/2025 - 01:41:07:   ping_deviation: 16.610085
06/27/2025 - 01:41:07:   full_resends: 1
06/27/2025 - 01:41:07: }
06/27/2025 - 01:41:07: players {
06/27/2025 - 01:41:07:   account_id: 1837892499
06/27/2025 - 01:41:07:   ip: 93247171
06/27/2025 - 01:41:07:   avg_ping_ms: 167
06/27/2025 - 01:41:07:   packet_loss: 0.00079207559
06/27/2025 - 01:41:07:   ping_deviation: 259.30658
06/27/2025 - 01:41:07:   full_resends: 5
06/27/2025 - 01:41:07: }
06/27/2025 - 01:41:07: players {
06/27/2025 - 01:41:07:   account_id: 229840067
06/27/2025 - 01:41:07:   ip: 1604303989
06/27/2025 - 01:41:07:   avg_ping_ms: 199
06/27/2025 - 01:41:07:   packet_loss: 9.1394313e-06
06/27/2025 - 01:41:07:   ping_deviation: 8.3538456
06/27/2025 - 01:41:07:   full_resends: 2
06/27/2025 - 01:41:07: }
06/27/2025 - 01:41:07: players {
06/27/2025 - 01:41:07:   account_id: 136893774
06/27/2025 - 01:41:07:   ip: 1845243967
06/27/2025 - 01:41:07:   avg_ping_ms: 86
06/27/2025 - 01:41:07:   packet_loss: 0
06/27/2025 - 01:41:07:   ping_deviation: 16.909874
06/27/2025 - 01:41:07:   full_resends: 1
06/27/2025 - 01:41:07: }
06/27/2025 - 01:41:07: players {
06/27/2025 - 01:41:07:   account_id: 1909044259
06/27/2025 - 01:41:07:   ip: 1530155938
06/27/2025 - 01:41:07:   avg_ping_ms: 131
06/27/2025 - 01:41:07:   packet_loss: 0
06/27/2025 - 01:41:07:   ping_deviation: 10.35809
06/27/2025 - 01:41:07:   full_resends: 1
06/27/2025 - 01:41:07: }
06/27/2025 - 01:41:07: cluster_id: 0
06/27/2025 - 01:41:07: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:41:07: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:41:07: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:41:07: Client tried to execute invalid order (19). Target NPC is dead.
06/27/2025 - 01:41:08: SIGNOUT: Told to wait by GC for 247 seconds
06/27/2025 - 01:41:11: 🖤domaprohladno: gg
06/27/2025 - 01:41:11: L 06/27/2025 - 01:41:11: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say "gg"
06/27/2025 - 01:41:12: Капитан Прах: сор
06/27/2025 - 01:41:12: L 06/27/2025 - 01:41:12: "Капитан Прах<10><[U:1:1837892499]><#DOTA_GoodGuys>" say_team "сор"
06/27/2025 - 01:41:12: ✞Пилот Болида✞: всем удачи все старались
06/27/2025 - 01:41:12: L 06/27/2025 - 01:41:12: "✞Пилот Болида✞<13><[U:1:229840067]><#DOTA_BadGuys>" say "всем удачи все старались"
06/27/2025 - 01:41:15: однаждыебался: )
06/27/2025 - 01:41:15: L 06/27/2025 - 01:41:15: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" say_team ")"
06/27/2025 - 01:41:17: ✞Пилот Болида✞: противники оказались сильнее
06/27/2025 - 01:41:17: L 06/27/2025 - 01:41:17: "✞Пилот Болида✞<13><[U:1:229840067]><#DOTA_BadGuys>" say "противники оказались сильнее"
06/27/2025 - 01:41:25: L 06/27/2025 - 01:41:25: "Drochiomaru<12><[U:1:136893774]><#DOTA_GoodGuys>" disconnected (reason "2")
06/27/2025 - 01:41:25: On disconnect 0 0
06/27/2025 - 01:41:25: Voice: Listener Drochiomaru(0) state cleared due to Disconnected
06/27/2025 - 01:41:25: PR:SetConnectionState 0:[U:1:136893774] DOTA_CONNECTION_STATE_DISCONNECTED NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:41:25: Setting player Drochiomaru to DOTA_LEAVER_DISCONNECTED
06/27/2025 - 01:41:25: PR:SetLeaverStatus 0:[U:1:136893774] DOTA_LEAVER_DISCONNECTED
06/27/2025 - 01:41:25: 9: npc_dota_techies_remote_mine
06/27/2025 - 01:41:25: 11: npc_dota_techies_remote_mine
06/27/2025 - 01:41:25: 15: npc_dota_techies_remote_mine
06/27/2025 - 01:41:25: 18: npc_dota_techies_remote_mine
06/27/2025 - 01:41:25: 28: npc_dota_techies_remote_mine
06/27/2025 - 01:41:25: 30: npc_dota_techies_remote_mine
06/27/2025 - 01:41:25: 37: npc_dota_techies_remote_mine
06/27/2025 - 01:41:25: 42: npc_dota_techies_stasis_trap
06/27/2025 - 01:41:25: 43: npc_dota_techies_remote_mine
06/27/2025 - 01:41:25: 44: npc_dota_techies_remote_mine
06/27/2025 - 01:41:25: 45: npc_dota_techies_remote_mine
06/27/2025 - 01:41:25: 54: npc_dota_techies_remote_mine
06/27/2025 - 01:41:25: 56: npc_dota_techies_remote_mine
06/27/2025 - 01:41:25: 65: npc_dota_hero_techies
06/27/2025 - 01:41:25: 75: npc_dota_techies_remote_mine
06/27/2025 - 01:41:25: 81: npc_dota_techies_remote_mine
06/27/2025 - 01:41:25: 91: npc_dota_techies_remote_mine
06/27/2025 - 01:41:25: Dropped Drochiomaru from server(2): NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:41:26: 🖤domaprohladno: ты как будто недоволен
06/27/2025 - 01:41:26: L 06/27/2025 - 01:41:26: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say "ты как будто недоволен"
06/27/2025 - 01:41:29: L 06/27/2025 - 01:41:29: "однаждыебался<5><[U:1:186085043]><#DOTA_GoodGuys>" disconnected (reason "2")
06/27/2025 - 01:41:29: On disconnect 0 0
06/27/2025 - 01:41:29: Voice: Listener однаждыебался(2) state cleared due to Disconnected
06/27/2025 - 01:41:29: PR:SetConnectionState 2:[U:1:186085043] DOTA_CONNECTION_STATE_DISCONNECTED NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:41:29: Setting player однаждыебался to DOTA_LEAVER_DISCONNECTED
06/27/2025 - 01:41:29: PR:SetLeaverStatus 2:[U:1:186085043] DOTA_LEAVER_DISCONNECTED
06/27/2025 - 01:41:29: Dropped однаждыебался from server(2): NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:41:29: Unable to create object of type 2017
06/27/2025 - 01:41:29: L 06/27/2025 - 01:41:29: "мммолли<7><[U:1:1030433746]><#DOTA_BadGuys>" disconnected (reason "2")
06/27/2025 - 01:41:29: On disconnect 0 0
06/27/2025 - 01:41:29: Voice: Listener мммолли(7) state cleared due to Disconnected
06/27/2025 - 01:41:29: PR:SetConnectionState 7:[U:1:1030433746] DOTA_CONNECTION_STATE_DISCONNECTED NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:41:29: Setting player мммолли to DOTA_LEAVER_DISCONNECTED
06/27/2025 - 01:41:29: PR:SetLeaverStatus 7:[U:1:1030433746] DOTA_LEAVER_DISCONNECTED
06/27/2025 - 01:41:29: 2: npc_dota_templar_assassin_psionic_trap
06/27/2025 - 01:41:29: 3: npc_dota_hero_templar_assassin
06/27/2025 - 01:41:29: Dropped мммолли from server(2): NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:41:31: L 06/27/2025 - 01:41:31: "dec4dence<6><[U:1:1209125835]><#DOTA_BadGuys>" disconnected (reason "2")
06/27/2025 - 01:41:31: On disconnect 0 0
06/27/2025 - 01:41:31: Voice: Listener dec4dence(9) state cleared due to Disconnected
06/27/2025 - 01:41:31: PR:SetConnectionState 9:[U:1:1209125835] DOTA_CONNECTION_STATE_DISCONNECTED NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:41:31: Setting player dec4dence to DOTA_LEAVER_DISCONNECTED
06/27/2025 - 01:41:31: PR:SetLeaverStatus 9:[U:1:1209125835] DOTA_LEAVER_DISCONNECTED
06/27/2025 - 01:41:31: 0: npc_dota_hero_windrunner
06/27/2025 - 01:41:31: Dropped dec4dence from server(2): NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:41:38: L 06/27/2025 - 01:41:38: "all_mute<3><[U:1:322449174]><#DOTA_BadGuys>" disconnected (reason "2")
06/27/2025 - 01:41:38: On disconnect 0 0
06/27/2025 - 01:41:38: Voice: Listener all_mute(6) state cleared due to Disconnected
06/27/2025 - 01:41:38: PR:SetConnectionState 6:[U:1:322449174] DOTA_CONNECTION_STATE_DISCONNECTED NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:41:38: Setting player all_mute to DOTA_LEAVER_DISCONNECTED
06/27/2025 - 01:41:38: PR:SetLeaverStatus 6:[U:1:322449174] DOTA_LEAVER_DISCONNECTED
06/27/2025 - 01:41:38: Dropped all_mute from server(2): NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:41:39: Unable to create object of type 2017
06/27/2025 - 01:41:41: Dropped АЛДИЯРЧИК from server(2): NETWORK_DISCONNECT_DISCONNECT_BY_USER
06/27/2025 - 01:42:02: CDOTAHLTVDirector::FinishRecording  m_szLastReplayFilename = replays/35720.dem
06/27/2025 - 01:42:02: Completed SourceTV demo "replays/35720.dem", recording time 3751.7
06/27/2025 - 01:42:08: On disconnect 0 1
06/27/2025 - 01:42:08: On disconnect 0 0
06/27/2025 - 01:42:08: On disconnect 0 0
06/27/2025 - 01:42:08: On disconnect 0 0
06/27/2025 - 01:42:08: On disconnect 0 0
06/27/2025 - 01:42:08: Steamworks Stats: CDOTASteamWorksGameStatsServer Ending CLIENT session id: 8923141718881
06/27/2025 - 01:42:08: Steamworks Stats: CDOTASteamWorksGameStatsServer Ending SERVER session id: 8923141718881
06/27/2025 - 01:42:08: CWorld::~CWorld deleting game rules
06/27/2025 - 01:42:08: CDOTAGamerules::~CDOTAGamerules, calling shutdown
06/27/2025 - 01:42:08: CSoundEmitterSystem:  Registered 1431 sounds
06/27/2025 - 01:42:08: L 06/27/2025 - 01:42:08: [META] Loaded 0 plugins (2 already loaded)
06/27/2025 - 01:42:08: L 06/27/2025 - 01:42:08: "✞Пилот Болида✞<13><[U:1:229840067]><>" disconnected (reason "1")
06/27/2025 - 01:42:08: Dropped ✞Пилот Болида✞ from server(1): NETWORK_DISCONNECT_SHUTDOWN
06/27/2025 - 01:42:08: L 06/27/2025 - 01:42:08: "Капитан Прах<10><[U:1:1837892499]><>" disconnected (reason "1")
06/27/2025 - 01:42:08: Dropped Капитан Прах from server(1): NETWORK_DISCONNECT_SHUTDOWN
06/27/2025 - 01:42:08: L 06/27/2025 - 01:42:08: "🖤domaprohladno<9><[U:1:153062474]><>" disconnected (reason "1")
06/27/2025 - 01:42:08: Dropped 🖤domaprohladno from server(1): NETWORK_DISCONNECT_SHUTDOWN
06/27/2025 - 01:42:08: L 06/27/2025 - 01:42:08: "ПОКЛОНИСЬ БОГУ<8><[U:1:302197283]><>" disconnected (reason "1")
06/27/2025 - 01:42:08: Dropped ПОКЛОНИСЬ БОГУ from server(1): NETWORK_DISCONNECT_SHUTDOWN
06/27/2025 - 01:42:08: L 06/27/2025 - 01:42:08: "SourceTV<2><BOT><>" disconnected (reason "1")
06/27/2025 - 01:42:08: Closed hltv(28325) (threaded)
06/27/2025 - 01:42:08: L 06/27/2025 - 01:42:08: server_message: "quit"
06/27/2025 - 01:42:09: Closed server(28320) (threaded)
06/27/2025 - 01:42:09: L 06/27/2025 - 01:42:09: server_message: "restart"
06/27/2025 - 01:42:09: L 06/27/2025 - 01:42:09: Log file closed.
06/27/2025 - 01:42:09: L 06/27/2025 - 01:42:09: Error log file session closed.`;

  it("should parse log file messages", () => {
    const msgs = parseLogFile(log);

    console.log(msgs);
  });

  it("should parse dire say_team log line", () => {
    const some = parseLogLine(
      `06/27/2025 - 00:40:11: L 06/27/2025 - 00:40:11: "asd829458<4><[U:1:1909044259]><#DOTA_BadGuys>" say_team "я керри, потому тихоньуо"`,
    );
    expect(some).toEqual({
      steamId: "1909044259",
      message: "я керри, потому тихоньуо",
      team: DotaTeam.DIRE,
      allChat: false,
    });
  });

  it("should parse radiant say log line", () => {
    const some = parseLogLine(
      `06/27/2025 - 01:41:26: L 06/27/2025 - 01:41:26: "🖤domaprohladno<9><[U:1:153062474]><#DOTA_GoodGuys>" say "ты как будто недоволен"`,
    );
    expect(some).toEqual({
      steamId: "153062474",
      message: "ты как будто недоволен",
      team: DotaTeam.RADIANT,
      allChat: true,
    });
  });
});
