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
 * @interface TournamentCreateTournamentDto
 */
export interface TournamentCreateTournamentDto {
  /**
   *
   * @type {string}
   * @memberof TournamentCreateTournamentDto
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof TournamentCreateTournamentDto
   */
  entryType: TournamentCreateTournamentDtoEntryTypeEnum;
  /**
   *
   * @type {number}
   * @memberof TournamentCreateTournamentDto
   */
  startDate: number;
  /**
   *
   * @type {string}
   * @memberof TournamentCreateTournamentDto
   */
  imageUrl: string;
  /**
   *
   * @type {string}
   * @memberof TournamentCreateTournamentDto
   */
  strategy: TournamentCreateTournamentDtoStrategyEnum;
  /**
   *
   * @type {string}
   * @memberof TournamentCreateTournamentDto
   */
  version: string;
  /**
   *
   * @type {number}
   * @memberof TournamentCreateTournamentDto
   */
  roundBestOf: number;
  /**
   *
   * @type {number}
   * @memberof TournamentCreateTournamentDto
   */
  finalBestOf: number;
  /**
   *
   * @type {number}
   * @memberof TournamentCreateTournamentDto
   */
  grandFinalBestOf: number;
}

/**
 * @export
 * @enum {string}
 */
export enum TournamentCreateTournamentDtoEntryTypeEnum {
  PLAYER = "PLAYER",
  TEAM = "TEAM",
}
/**
 * @export
 * @enum {string}
 */
export enum TournamentCreateTournamentDtoStrategyEnum {
  SINGLEELIMINATION = "SINGLE_ELIMINATION",
  DOUBLEELIMINATION = "DOUBLE_ELIMINATION",
}
