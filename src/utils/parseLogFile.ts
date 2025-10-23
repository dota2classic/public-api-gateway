// import { parse } from "@blastorg/srcds-log-parser"

import { DotaTeam } from "../gateway/shared-types/dota-team";

export interface LogMessage {
  steamId: string;
  message: string;
  allChat: boolean;
  team: DotaTeam;
}
export function parseLogLine(line: string): LogMessage | undefined {
  try {
    const r = /<\[U:1:(\d+)]><#DOTA_(.+)>" (say_team|say) "(.+)"/g;

    const arr = r.exec(line);
    return {
      steamId: arr[1],
      message: arr[4],
      team: arr[2] === "BadGuys" ? DotaTeam.DIRE : DotaTeam.RADIANT,
      allChat: arr[3] === "say",
    };
  } catch (e) {
    return undefined;
  }
}

export function parseLogFile(text: string) {
  return text
    .split("\n")
    .map((line) => parseLogLine(line))
    .filter(Boolean);
}
