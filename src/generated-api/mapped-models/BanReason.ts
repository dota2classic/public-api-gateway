/* tslint:disable */
/* eslint-disable */

/**
 * Public REST api for dota2classic
 * All stuff
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { BanReason } from '../../gateway/shared-types/ban';

export type GameserverBanReason = BanReason;


export function GameserverBanReasonFromJSON(json: any): GameserverBanReason {
  return GameserverBanReasonFromJSONTyped(json, false);
}

export function GameserverBanReasonFromJSONTyped(json: any, ignoreDiscriminator: boolean): GameserverBanReason {
  return json as GameserverBanReason;
}

export function GameserverBanReasonToJSON(value?: GameserverBanReason | null): any {
  return value as any;
}
