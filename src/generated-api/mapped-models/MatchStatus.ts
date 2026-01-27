import { MatchStatus } from "../../gateway/shared-types/tournament";

export type TournamentMatchStatus = MatchStatus;

export function TournamentMatchStatusFromJSON(
  json: any,
): TournamentMatchStatus {
  return TournamentMatchStatusFromJSONTyped(json, false);
}

export function TournamentMatchStatusFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): TournamentMatchStatus {
  return json as TournamentMatchStatus;
}

export function TournamentMatchStatusToJSON(
  value?: TournamentMatchStatus | null,
): any {
  return value as any;
}
