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
 * @interface ForumCreateMessageDTO
 */
export class ForumCreateMessageDTO {
    /**
     *
     * @type {object}
     * @memberof ForumCreateMessageDTO
     */
    author: object;
    /**
     *
     * @type {string}
     * @memberof ForumCreateMessageDTO
     */
    content: string;
}

export function ForumCreateMessageDTOFromJSON(json: any): ForumCreateMessageDTO {
    return ForumCreateMessageDTOFromJSONTyped(json, false);
}

export function ForumCreateMessageDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): ForumCreateMessageDTO {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {

        'author': json['author'],
        'content': json['content'],
    };
}

export function ForumCreateMessageDTOToJSON(value?: ForumCreateMessageDTO | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {

        'author': value.author,
        'content': value.content,
    };
}


