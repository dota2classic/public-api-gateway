/* tslint:disable */
/* eslint-disable */
/**
 * GameServer api
 * Matches, players, mmrs
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface GameserverPlayerSummaryDto
 */
export class GameserverPlayerSummaryDto {
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerSummaryDto
     */
    newbieUnrankedGamesLeft: number;
    /**
     *
     * @type {boolean}
     * @memberof GameserverPlayerSummaryDto
     */
    playedAnyGame: boolean;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerSummaryDto
     */
    rank: number | null;
    /**
     *
     * @type {string}
     * @memberof GameserverPlayerSummaryDto
     */
    steam_id: string;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerSummaryDto
     */
    mmr: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerSummaryDto
     */
    games: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerSummaryDto
     */
    wins: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerSummaryDto
     */
    kills: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerSummaryDto
     */
    deaths: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerSummaryDto
     */
    assists: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerSummaryDto
     */
    play_time: number;
}

export function GameserverPlayerSummaryDtoFromJSON(json: any): GameserverPlayerSummaryDto {
    return GameserverPlayerSummaryDtoFromJSONTyped(json, false);
}

export function GameserverPlayerSummaryDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GameserverPlayerSummaryDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {

        'newbieUnrankedGamesLeft': json['newbieUnrankedGamesLeft'],
        'playedAnyGame': json['playedAnyGame'],
        'rank': json['rank'],
        'steam_id': json['steam_id'],
        'mmr': json['mmr'],
        'games': json['games'],
        'wins': json['wins'],
        'kills': json['kills'],
        'deaths': json['deaths'],
        'assists': json['assists'],
        'play_time': json['play_time'],
    };
}

export function GameserverPlayerSummaryDtoToJSON(value?: GameserverPlayerSummaryDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {

        'newbieUnrankedGamesLeft': value.newbieUnrankedGamesLeft,
        'playedAnyGame': value.playedAnyGame,
        'rank': value.rank,
        'steam_id': value.steam_id,
        'mmr': value.mmr,
        'games': value.games,
        'wins': value.wins,
        'kills': value.kills,
        'deaths': value.deaths,
        'assists': value.assists,
        'play_time': value.play_time,
    };
}

