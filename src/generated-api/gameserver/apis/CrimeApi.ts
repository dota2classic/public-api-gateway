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


import * as runtime from '../runtime';

import {
  GameserverCrimeLogPageDto,
  GameserverCrimeLogPageDtoFromJSON,
} from '../models';

export interface CrimeControllerCrimeLogRequest {
  page: number;
  perPage?: number;
  steamId?: string;
}

/**
 *
 */
export class CrimeApi extends runtime.BaseAPI {

    /**
     */
    private async crimeControllerCrimeLogRaw(requestParameters: CrimeControllerCrimeLogRequest): Promise<runtime.ApiResponse<GameserverCrimeLogPageDto>> {
        this.crimeControllerCrimeLogValidation(requestParameters);
        const context = this.crimeControllerCrimeLogContext(requestParameters);
        const response = await this.request(context);

        return new runtime.JSONApiResponse(response, (jsonValue) => GameserverCrimeLogPageDtoFromJSON(jsonValue));
    }



    /**
     */
    private crimeControllerCrimeLogValidation(requestParameters: CrimeControllerCrimeLogRequest) {
        if (requestParameters.page === null || requestParameters.page === undefined) {
            throw new runtime.RequiredError('page','Required parameter requestParameters.page was null or undefined when calling crimeControllerCrimeLog.');
        }
    }

    /**
     */
    crimeControllerCrimeLogContext(requestParameters: CrimeControllerCrimeLogRequest): runtime.RequestOpts {
        const queryParameters: any = {};

        if (requestParameters.page !== undefined) {
            queryParameters['page'] = requestParameters.page;
        }

        if (requestParameters.perPage !== undefined) {
            queryParameters['per_page'] = requestParameters.perPage;
        }

        if (requestParameters.steamId !== undefined) {
            queryParameters['steam_id'] = requestParameters.steamId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        return {
            path: `/crime`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     */
    crimeControllerCrimeLog = async (page: number, perPage?: number, steamId?: string): Promise<GameserverCrimeLogPageDto> => {
        const response = await this.crimeControllerCrimeLogRaw({ page: page, perPage: perPage, steamId: steamId });
        return await response.value();
    }

}