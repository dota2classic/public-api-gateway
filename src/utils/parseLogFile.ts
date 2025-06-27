// import { parse } from "@blastorg/srcds-log-parser"

const r = /<\[U:1:(\d+)]><#DOTA_.+>" (say_team|say) "(.+)"/g;

export interface LogMessage {
  steamId: string;
  message: string;
  allChat: boolean;
}
export function parseLogLine(line: string): LogMessage | undefined {
  try {
    const arr = r.exec(line);
    return {
      steamId: arr[1],
      message: arr[3],
      allChat: arr[2] === "say",
    };
  } catch (e) {
    // console.log(e);
    return undefined;
  }
}

export function parseLogFile(text: string) {
  return text
    .split("\n")
    .map((line) => parseLogLine(line))
    .filter(Boolean);
}
