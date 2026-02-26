/**
 * Type compatibility layer for @dota2classic/gs-api-generated
 *
 * The generated API uses numeric enums (Value0 = 0, Value1 = 1, ...)
 * while our codebase uses named enums (RANKED = 0, UNRANKED = 1, ...).
 * Since the underlying values are identical, these conversions are safe.
 */
import type {
  MatchmakingMode as GsMatchmakingMode,
  DotaGameMode as GsDotaGameMode,
  PlayerAspect as GsPlayerAspect,
  BanReason as GsBanReason,
  MatchAccessLevel as GsMatchAccessLevel,
  AchievementKey as GsAchievementKey,
  DotaMap as GsDotaMap,
  DotaPatch as GsDotaPatch,
} from "@dota2classic/gs-api-generated/dist/Api";
import { MatchmakingMode } from "../gateway/shared-types/matchmaking-mode";
import { Dota_GameMode } from "../gateway/shared-types/dota-game-mode";
import { PlayerAspect } from "../gateway/shared-types/player-aspect";
import { BanReason } from "../gateway/shared-types/ban";
import { MatchAccessLevel } from "../gateway/shared-types/match-access-level";
import { AchievementKey } from "../gateway/shared-types/achievemen-key";
import { Dota_Map } from "../gateway/shared-types/dota-map";
import { DotaPatch } from "../gateway/constants/patch";

// Type-safe enum converters (values are identical, only type differs)
export const asMatchmakingMode = (v: GsMatchmakingMode) => v as unknown as MatchmakingMode;
export const asGameMode = (v: GsDotaGameMode) => v as unknown as Dota_GameMode;
export const asPlayerAspect = (v: GsPlayerAspect) => v as unknown as PlayerAspect;
export const asBanReason = (v: GsBanReason) => v as unknown as BanReason;
export const asMatchAccessLevel = (v: GsMatchAccessLevel) => v as unknown as MatchAccessLevel;
export const asAchievementKey = (v: GsAchievementKey) => v as unknown as AchievementKey;

// Additional enum converters
export const asDotaMap = (v: GsDotaMap) => v as unknown as Dota_Map;
export const asDotaPatch = (v: GsDotaPatch) => v as unknown as DotaPatch;

// Reverse converters (for sending data to API)
export const toApiMatchmakingMode = (v: MatchmakingMode) => v as unknown as GsMatchmakingMode;
export const toApiGameMode = (v: Dota_GameMode) => v as unknown as GsDotaGameMode;
export const toApiPlayerAspect = (v: PlayerAspect) => v as unknown as GsPlayerAspect;
export const toApiDotaMap = (v: Dota_Map) => v as unknown as GsDotaMap;
export const toApiDotaPatch = (v: DotaPatch) => v as unknown as GsDotaPatch;
