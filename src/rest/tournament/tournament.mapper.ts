import { Injectable } from "@nestjs/common";
import {
  TournamentBracketMatchDto,
  TournamentBracketMatchGameDto,
  TournamentBracketParticipantDto,
  TournamentParticipantResultDto,
  TournamentRegistrationDto,
  TournamentRegistrationPlayerDto,
  TournamentRoundDto,
  TournamentStageDto,
  TournamentStageStandingsResultDto,
  TournamentStageStandingsResultRankDto,
  TournamentTournamentBracketInfoDto,
  TournamentTournamentDto,
} from "../../generated-api/tournament";
import {
  BracketMatchDto,
  BracketParticipantDto,
  MatchGameDto,
  ParticipantResultDto,
  RegistrationDto,
  RegistrationPlayerDto,
  RoundDto,
  StageDto,
  StageStandingRankedDto,
  StageStandingsDto,
  TournamentBracketInfoDto,
  TournamentDto,
} from "./tournament.dto";
import { UserProfileService } from "../../service/user-profile.service";

@Injectable()
export class TournamentMapper {
  constructor(private readonly user: UserProfileService) {}

  mapTournament = async (
    t: TournamentTournamentDto,
  ): Promise<TournamentDto> => ({
    id: t.id,
    name: t.name,
    imageUrl: t.imageUrl,
    prize: t.prize,
    teamSize: t.teamSize,
    strategy: t.strategy,
    status: t.status,
    startDate: t.startDate,
    description: t.description,
    bestOfConfig: t.bestOfStrategy,
    registrations: await Promise.all(t.registrations.map(this.mapRegistration)),
    gameMode: t.gameMode,
    scheduleStrategy: t.scheduleStrategy,
  });

  mapRegistration = async (
    t: TournamentRegistrationDto,
  ): Promise<RegistrationDto> => {
    const players = await Promise.all(
      t.players.map(this.mapRegistrationPlayer),
    );
    return {
      id: t.id,
      players,
      state: t.state,
      title:
        `${players[0].user.name}` +
        (players.length === 1 ? "" : ` + ${players.length - 1}`),
    };
  };

  mapRegistrationPlayer = async (
    t: TournamentRegistrationPlayerDto,
  ): Promise<RegistrationPlayerDto> => ({
    user: await this.user.userDto(t.steamId),
    state: t.state,
  });

  mapStage = (stage: TournamentStageDto): StageDto => ({
    id: stage.id,
    tournament_id: stage.tournament_id,
    name: stage.name,
    type: stage.type as unknown as string,
    settings: stage.settings,
    number: stage.number,
  });

  mapRound = (round: TournamentRoundDto): RoundDto => ({
    id: round.id,
    number: round.number,
    stage_id: Number(round.stage_id),
    group_id: round.group_id,
  });

  mapParticipant = async (
    part: TournamentBracketParticipantDto,
  ): Promise<BracketParticipantDto> => {
    const sortedPlayers = await Promise.all(
      (part.players || []).map(this.user.userDto),
    ).then((it) => it.sort());

    let name: string;
    let avatar = "/avatar.png";
    if (part.team) {
      name = part.team.name;
      avatar = part.team.imageUrl;
    } else if (sortedPlayers.length > 0) {
      name = sortedPlayers[0].name;
      avatar = sortedPlayers[0].avatar;
      if (sortedPlayers.length > 1) {
        name += ` +${sortedPlayers.length - 1}`;
      }
    }

    return {
      id: part.id,
      tournament_id: part.tournament_id,
      players: sortedPlayers,
      name,
      avatar,
    };
  };

  mapBracket = async (
    t: TournamentTournamentBracketInfoDto,
  ): Promise<TournamentBracketInfoDto> => {
    return {
      stage: t.stage.map(this.mapStage),
      group: t.group,
      round: t.round.map(this.mapRound),
      participant: await Promise.all(t.participant.map(this.mapParticipant)),
      match: await Promise.all(t.match.map(this.mapMatch)),
    };
  };

  mapMatch = async (
    m: TournamentBracketMatchDto,
  ): Promise<BracketMatchDto> => ({
    id: m.id,
    stage_id: m.stage_id,
    group_id: m.group_id,
    round_id: m.round_id,
    child_count: m.child_count,
    number: m.number,
    status: m.status,
    opponent1: m.opponent1 && (await this.mapOpponent(m.opponent1)),
    opponent2: m.opponent2 && (await this.mapOpponent(m.opponent2)),
    startDate: m.startDate.toISOString(),
    games: await Promise.all(m.games.map(this.mapMatchGame)),
  });

  mapMatchGame = async (
    t: TournamentBracketMatchGameDto,
  ): Promise<MatchGameDto> => ({
    id: t.id,
    bracketMatchId: t.bracket_match_id,
    externalMatchId: t.externalMatchId,
    scheduledDate: t.scheduledDate.toISOString(),
    teamOffset: t.teamOffset,
    number: t.number,
    status: t.status,
    finished: t.finished,
    opponent1: t.opponent1 && (await this.mapOpponent(t.opponent1)),
    opponent2: t.opponent2 && (await this.mapOpponent(t.opponent2)),
  });

  mapOpponent = async (
    t: TournamentParticipantResultDto,
  ): Promise<ParticipantResultDto> => ({
    id: t.id || null,
    // tournament_id: t.tournament_id,
    score: t.score,
    position: t.position,
    result: t.result as unknown as any,
    participant: t.participant && (await this.mapParticipant(t.participant)),
  });

  mapStandingDto = async (
    t: TournamentStageStandingsResultRankDto,
  ): Promise<StageStandingRankedDto> => ({
    rank: t.rank,
    participant: await this.mapParticipant(t.participant),
  });

  mapStanding = async (
    t: TournamentStageStandingsResultDto,
  ): Promise<StageStandingsDto> => ({
    id: t.stage_id,
    name: t.name,
    standings: await Promise.all(t.standings.map(this.mapStandingDto)),
  });
}
