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

import { ForumMessageDTO, ForumMessageDTOFromJSON, ForumMessageDTOToJSON } from './';

/**
 *
 * @export
 * @interface ForumMessagePageDTO
 */
export class ForumMessagePageDTO {
    /**
     *
     * @type {Array<ForumMessageDTO>}
     * @memberof ForumMessagePageDTO
     */
    data: Array<ForumMessageDTO>;
    /**
     *
     * @type {number}
     * @memberof ForumMessagePageDTO
     */
    perPage: number;
    /**
     *
     * @type {number}
     * @memberof ForumMessagePageDTO
     */
    page: number;
    /**
     *
     * @type {number}
     * @memberof ForumMessagePageDTO
     */
    pages: number;
}

export function ForumMessagePageDTOFromJSON(json: any): ForumMessagePageDTO {
    return ForumMessagePageDTOFromJSONTyped(json, false);
}

export function ForumMessagePageDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): ForumMessagePageDTO {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {

        'data': ((json['data'] as Array<any>).map(ForumMessageDTOFromJSON)),
        'perPage': json['perPage'],
        'page': json['page'],
        'pages': json['pages'],
    };
}

export function ForumMessagePageDTOToJSON(value?: ForumMessagePageDTO | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {

        'data': ((value.data as Array<any>).map(ForumMessageDTOToJSON)),
        'perPage': value.perPage,
        'page': value.page,
        'pages': value.pages,
    };
}

