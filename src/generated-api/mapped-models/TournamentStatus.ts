import { TournamentStatus } from "../../gateway/shared-types/tournament";

export type TournamentTournamentStatus = TournamentStatus;

export function TournamentTournamentStatusFromJSON(
  json: any,
): TournamentTournamentStatus {
  return TournamentTournamentStatusFromJSONTyped(json, false);
}

export function TournamentTournamentStatusFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): TournamentTournamentStatus {
  return json as TournamentTournamentStatus;
}

export function TournamentTournamentStatusToJSON(
  value?: TournamentTournamentStatus | null,
): any {
  return value as any;
}
