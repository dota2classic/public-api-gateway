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
 * @interface GameserverPlayerInMatchDto
 */
export class GameserverPlayerInMatchDto {
    /**
     *
     * @type {string}
     * @memberof GameserverPlayerInMatchDto
     */
    steam_id: string;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    team: number;
    /**
     *
     * @type {string}
     * @memberof GameserverPlayerInMatchDto
     */
    hero: string;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    level: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    kills: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    deaths: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    assists: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    gpm: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    xpm: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    hero_damage: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    hero_healing: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    tower_damage: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    last_hits: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    denies: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    gold: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    item0: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    item1: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    item2: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    item3: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    item4: number;
    /**
     *
     * @type {number}
     * @memberof GameserverPlayerInMatchDto
     */
    item5: number;
    /**
     *
     * @type {boolean}
     * @memberof GameserverPlayerInMatchDto
     */
    abandoned: boolean;
}

export function GameserverPlayerInMatchDtoFromJSON(json: any): GameserverPlayerInMatchDto {
    return GameserverPlayerInMatchDtoFromJSONTyped(json, false);
}

export function GameserverPlayerInMatchDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GameserverPlayerInMatchDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {

        'steam_id': json['steam_id'],
        'team': json['team'],
        'hero': json['hero'],
        'level': json['level'],
        'kills': json['kills'],
        'deaths': json['deaths'],
        'assists': json['assists'],
        'gpm': json['gpm'],
        'xpm': json['xpm'],
        'hero_damage': json['hero_damage'],
        'hero_healing': json['hero_healing'],
        'tower_damage': json['tower_damage'],
        'last_hits': json['last_hits'],
        'denies': json['denies'],
        'gold': json['gold'],
        'item0': json['item0'],
        'item1': json['item1'],
        'item2': json['item2'],
        'item3': json['item3'],
        'item4': json['item4'],
        'item5': json['item5'],
        'abandoned': json['abandoned'],
    };
}

export function GameserverPlayerInMatchDtoToJSON(value?: GameserverPlayerInMatchDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {

        'steam_id': value.steam_id,
        'team': value.team,
        'hero': value.hero,
        'level': value.level,
        'kills': value.kills,
        'deaths': value.deaths,
        'assists': value.assists,
        'gpm': value.gpm,
        'xpm': value.xpm,
        'hero_damage': value.hero_damage,
        'hero_healing': value.hero_healing,
        'tower_damage': value.tower_damage,
        'last_hits': value.last_hits,
        'denies': value.denies,
        'gold': value.gold,
        'item0': value.item0,
        'item1': value.item1,
        'item2': value.item2,
        'item3': value.item3,
        'item4': value.item4,
        'item5': value.item5,
        'abandoned': value.abandoned,
    };
}

