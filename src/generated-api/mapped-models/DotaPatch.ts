import { DotaPatch } from "../../gateway/constants/patch";

export type GameserverDotaPatch = DotaPatch;

export function GameserverDotaPatchFromJSON(json: any): GameserverDotaPatch {
  return GameserverDotaPatchFromJSONTyped(json, false);
}

export function GameserverDotaPatchFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): GameserverDotaPatch {
  return json as GameserverDotaPatch;
}

export function GameserverDotaPatchToJSON(
  value?: GameserverDotaPatch | null,
): any {
  return value as any;
}
