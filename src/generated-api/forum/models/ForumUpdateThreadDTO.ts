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
 * @interface ForumUpdateThreadDTO
 */
export class ForumUpdateThreadDTO {
    /**
     *
     * @type {boolean}
     * @memberof ForumUpdateThreadDTO
     */
    pinned: boolean;
}

export function ForumUpdateThreadDTOFromJSON(json: any): ForumUpdateThreadDTO {
    return ForumUpdateThreadDTOFromJSONTyped(json, false);
}

export function ForumUpdateThreadDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): ForumUpdateThreadDTO {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {

        'pinned': json['pinned'],
    };
}

export function ForumUpdateThreadDTOToJSON(value?: ForumUpdateThreadDTO | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {

        'pinned': value.pinned,
    };
}

