// tslint:disable
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
export interface GameserverPlayerSummaryDto {
    /**
     * 
     * @type {number}
     * @memberof GameserverPlayerSummaryDto
     */
    mmr: number;
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
    rank: number;
    /**
     * 
     * @type {number}
     * @memberof GameserverPlayerSummaryDto
     */
    newbieUnrankedGamesLeft: number;
}


