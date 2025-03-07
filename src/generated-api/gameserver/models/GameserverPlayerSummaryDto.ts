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
    calibrationGamesLeft: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerSummaryDto
     */
    accessLevel: GameserverPlayerSummaryDtoAccessLevelEnum;
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
    steamId: string;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerSummaryDto
     */
    seasonId: number;
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
    playtime: number;
}

export function GameserverPlayerSummaryDtoFromJSON(json: any): GameserverPlayerSummaryDto {
    return GameserverPlayerSummaryDtoFromJSONTyped(json, false);
}

export function GameserverPlayerSummaryDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GameserverPlayerSummaryDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {

        'calibrationGamesLeft': json['calibrationGamesLeft'],
        'accessLevel': json['accessLevel'],
        'rank': json['rank'],
        'steamId': json['steamId'],
        'seasonId': json['seasonId'],
        'mmr': json['mmr'],
        'games': json['games'],
        'wins': json['wins'],
        'kills': json['kills'],
        'deaths': json['deaths'],
        'assists': json['assists'],
        'playtime': json['playtime'],
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

        'calibrationGamesLeft': value.calibrationGamesLeft,
        'accessLevel': value.accessLevel,
        'rank': value.rank,
        'steamId': value.steamId,
        'seasonId': value.seasonId,
        'mmr': value.mmr,
        'games': value.games,
        'wins': value.wins,
        'kills': value.kills,
        'deaths': value.deaths,
        'assists': value.assists,
        'playtime': value.playtime,
    };
}

/**
* @export
* @enum {string}
*/
export enum GameserverPlayerSummaryDtoAccessLevelEnum {
    NUMBER_0 = 0,
    NUMBER_1 = 1,
    NUMBER_2 = 2
}


