// tslint:disable
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

/**
 *
 * @export
 * @interface TournamentTournamentDto
 */
export interface TournamentTournamentDto {
  /**
   *
   * @type {number}
   * @memberof TournamentTournamentDto
   */
  id: number;
  /**
   *
   * @type {string}
   * @memberof TournamentTournamentDto
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof TournamentTournamentDto
   */
  entryType: TournamentTournamentDtoEntryTypeEnum;
  /**
   *
   * @type {string}
   * @memberof TournamentTournamentDto
   */
  status: TournamentTournamentDtoStatusEnum;
  /**
   *
   * @type {string}
   * @memberof TournamentTournamentDto
   */
  version: TournamentTournamentDtoVersionEnum;
  /**
   *
   * @type {number}
   * @memberof TournamentTournamentDto
   */
  startDate: number;
  /**
   *
   * @type {string}
   * @memberof TournamentTournamentDto
   */
  imageUrl: string;
  /**
   *
   * @type {string}
   * @memberof TournamentTournamentDto
   */
  description: string;
}

/**
 * @export
 * @enum {string}
 */
export enum TournamentTournamentDtoEntryTypeEnum {
  PLAYER = "PLAYER",
  TEAM = "TEAM",
}
/**
 * @export
 * @enum {string}
 */
export enum TournamentTournamentDtoStatusEnum {
  NEW = "NEW",
  ONGOING = "ONGOING",
  FINISHED = "FINISHED",
  CANCELLED = "CANCELLED",
}
/**
 * @export
 * @enum {string}
 */
export enum TournamentTournamentDtoVersionEnum {
  _681 = "Dota_681",
  _684 = "Dota_684",
}
