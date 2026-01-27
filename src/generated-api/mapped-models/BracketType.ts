import { MatchStatus } from "../../gateway/shared-types/tournament";

export type TournamentBracketType = MatchStatus;

export function TournamentBracketTypeFromJSON(
  json: any,
): TournamentBracketType {
  return TournamentBracketTypeFromJSONTyped(json, false);
}

export function TournamentBracketTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): TournamentBracketType {
  return json as TournamentBracketType;
}

export function TournamentBracketTypeToJSON(
  value?: TournamentBracketType | null,
): any {
  return value as any;
}
