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
 * @interface GameserverMatchInfoDto
 */
export class GameserverMatchInfoDto {
    /**
     *
     * @type {number}
     * @memberof GameserverMatchInfoDto
     */
    mode: GameserverMatchInfoDtoModeEnum;
    /**
     *
     * @type {string}
     * @memberof GameserverMatchInfoDto
     */
    roomId: string;
    /**
     *
     * @type {Array<string>}
     * @memberof GameserverMatchInfoDto
     */
    radiant: Array<string>;
    /**
     *
     * @type {Array<string>}
     * @memberof GameserverMatchInfoDto
     */
    dire: Array<string>;
    /**
     *
     * @type {number}
     * @memberof GameserverMatchInfoDto
     */
    averageMMR: number;
    /**
     *
     * @type {string}
     * @memberof GameserverMatchInfoDto
     */
    version: GameserverMatchInfoDtoVersionEnum;
}

export function GameserverMatchInfoDtoFromJSON(json: any): GameserverMatchInfoDto {
    return GameserverMatchInfoDtoFromJSONTyped(json, false);
}

export function GameserverMatchInfoDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GameserverMatchInfoDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {

        'mode': json['mode'],
        'roomId': json['roomId'],
        'radiant': json['radiant'],
        'dire': json['dire'],
        'averageMMR': json['averageMMR'],
        'version': json['version'],
    };
}

export function GameserverMatchInfoDtoToJSON(value?: GameserverMatchInfoDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {

        'mode': value.mode,
        'roomId': value.roomId,
        'radiant': value.radiant,
        'dire': value.dire,
        'averageMMR': value.averageMMR,
        'version': value.version,
    };
}

/**
* @export
* @enum {string}
*/
export enum GameserverMatchInfoDtoModeEnum {
    NUMBER_0 = 0,
    NUMBER_1 = 1,
    NUMBER_2 = 2,
    NUMBER_3 = 3,
    NUMBER_4 = 4,
    NUMBER_5 = 5,
    NUMBER_6 = 6,
    NUMBER_7 = 7,
    NUMBER_8 = 8,
    NUMBER_9 = 9,
    NUMBER_10 = 10
}
/**
* @export
* @enum {string}
*/
export enum GameserverMatchInfoDtoVersionEnum {
    _681 = 'Dota_681',
    _684 = 'Dota_684'
}

