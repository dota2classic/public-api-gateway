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
 * @interface GameserverPlayerHeroPerformance
 */
export class GameserverPlayerHeroPerformance {
    /**
     *
     * @type {string}
     * @memberof GameserverPlayerHeroPerformance
     */
    steam_id: string;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerHeroPerformance
     */
    games: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerHeroPerformance
     */
    wins: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerHeroPerformance
     */
    kills: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerHeroPerformance
     */
    deaths: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerHeroPerformance
     */
    assists: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerHeroPerformance
     */
    score: number;
}

export function GameserverPlayerHeroPerformanceFromJSON(json: any): GameserverPlayerHeroPerformance {
    return GameserverPlayerHeroPerformanceFromJSONTyped(json, false);
}

export function GameserverPlayerHeroPerformanceFromJSONTyped(json: any, ignoreDiscriminator: boolean): GameserverPlayerHeroPerformance {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {

        'steam_id': json['steam_id'],
        'games': json['games'],
        'wins': json['wins'],
        'kills': json['kills'],
        'deaths': json['deaths'],
        'assists': json['assists'],
        'score': json['score'],
    };
}

export function GameserverPlayerHeroPerformanceToJSON(value?: GameserverPlayerHeroPerformance | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {

        'steam_id': value.steam_id,
        'games': value.games,
        'wins': value.wins,
        'kills': value.kills,
        'deaths': value.deaths,
        'assists': value.assists,
        'score': value.score,
    };
}

