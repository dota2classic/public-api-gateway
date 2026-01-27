import { TournamentRegistrationState } from "../../rest/tournament/tournament.dto";

export type TournamentTournamentRegistrationState = TournamentRegistrationState;

export function TournamentTournamentRegistrationStateFromJSON(
  json: any,
): TournamentRegistrationState {
  return TournamentTournamentRegistrationStateFromJSONTyped(json, false);
}

export function TournamentTournamentRegistrationStateFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): TournamentRegistrationState {
  return json as TournamentRegistrationState;
}

export function TournamentTournamentRegistrationStateToJSON(
  value?: TournamentRegistrationState | null,
): any {
  return value as any;
}
