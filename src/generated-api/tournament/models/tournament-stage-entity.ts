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
 * @interface TournamentStageEntity
 */
export interface TournamentStageEntity {
  /**
   *
   * @type {number}
   * @memberof TournamentStageEntity
   */
  id: number;
  /**
   *
   * @type {number}
   * @memberof TournamentStageEntity
   */
  tournament_id: number;
  /**
   *
   * @type {string}
   * @memberof TournamentStageEntity
   */
  name: string;
  /**
   *
   * @type {object}
   * @memberof TournamentStageEntity
   */
  type: object;
  /**
   *
   * @type {number}
   * @memberof TournamentStageEntity
   */
  number: number;
  /**
   *
   * @type {object}
   * @memberof TournamentStageEntity
   */
  settings: object;
}
