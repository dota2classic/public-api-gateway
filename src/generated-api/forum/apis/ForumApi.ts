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
  ForumCreateMessageDTO,
  ForumCreateMessageDTOToJSON,
  ForumCreateThreadDTO,
  ForumCreateThreadDTOToJSON,
  ForumMessageDTO,
  ForumMessageDTOFromJSON,
  ForumThreadDTO,
  ForumThreadDTOFromJSON,
} from '../models';

export interface ForumControllerGetThreadRequest {
  id: string;
}

export interface ForumControllerGetThreadForKeyRequest {
    forumCreateThreadDTO: ForumCreateThreadDTO;
}

export interface ForumControllerMessagesRequest {
    id: string;
    after?: number;
    limit?: number;
}

export interface ForumControllerPostMessageRequest {
    id: string;
    forumCreateMessageDTO: ForumCreateMessageDTO;
}

/**
 *
 */
export class ForumApi extends runtime.BaseAPI {

    /**
     */
    forumControllerGetThreadContext(requestParameters: ForumControllerGetThreadRequest): runtime.RequestOpts {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        return {
            path: `/forum/thread/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     */
    forumControllerGetThread = async (id: string): Promise<ForumThreadDTO> => {
        const response = await this.forumControllerGetThreadRaw({ id: id });
        return await response.value();
    }

    /**
     */
    forumControllerGetThreadForKeyContext(requestParameters: ForumControllerGetThreadForKeyRequest): runtime.RequestOpts {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        return {
            path: `/forum/thread`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ForumCreateThreadDTOToJSON(requestParameters.forumCreateThreadDTO),
        };
    }

    /**
     */
    forumControllerGetThreadForKey = async (forumCreateThreadDTO: ForumCreateThreadDTO): Promise<ForumThreadDTO> => {
        const response = await this.forumControllerGetThreadForKeyRaw({ forumCreateThreadDTO: forumCreateThreadDTO });
        return await response.value();
    }

    /**
     */
    forumControllerMessagesContext(requestParameters: ForumControllerMessagesRequest): runtime.RequestOpts {
        const queryParameters: any = {};

        if (requestParameters.after !== undefined) {
            queryParameters['after'] = requestParameters.after;
        }

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        return {
            path: `/forum/thread/{id}/messages`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     */
    forumControllerMessages = async (id: string, after?: number, limit?: number): Promise<Array<ForumMessageDTO>> => {
        const response = await this.forumControllerMessagesRaw({ id: id, after: after, limit: limit });
        return await response.value();
    }

    /**
     */
    forumControllerPostMessageContext(requestParameters: ForumControllerPostMessageRequest): runtime.RequestOpts {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        return {
            path: `/forum/thread/{id}/message`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ForumCreateMessageDTOToJSON(requestParameters.forumCreateMessageDTO),
        };
    }

    /**
     */
    forumControllerPostMessage = async (id: string, forumCreateMessageDTO: ForumCreateMessageDTO): Promise<ForumMessageDTO> => {
        const response = await this.forumControllerPostMessageRaw({ id: id, forumCreateMessageDTO: forumCreateMessageDTO });
        return await response.value();
    }

    /**
     */
    private async forumControllerGetThreadRaw(requestParameters: ForumControllerGetThreadRequest): Promise<runtime.ApiResponse<ForumThreadDTO>> {
        this.forumControllerGetThreadValidation(requestParameters);
        const context = this.forumControllerGetThreadContext(requestParameters);
        const response = await this.request(context);

        return new runtime.JSONApiResponse(response, (jsonValue) => ForumThreadDTOFromJSON(jsonValue));
    }

    /**
     */
    private forumControllerGetThreadValidation(requestParameters: ForumControllerGetThreadRequest) {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling forumControllerGetThread.');
        }
    }

    /**
     */
    private async forumControllerGetThreadForKeyRaw(requestParameters: ForumControllerGetThreadForKeyRequest): Promise<runtime.ApiResponse<ForumThreadDTO>> {
        this.forumControllerGetThreadForKeyValidation(requestParameters);
        const context = this.forumControllerGetThreadForKeyContext(requestParameters);
        const response = await this.request(context);

        return new runtime.JSONApiResponse(response, (jsonValue) => ForumThreadDTOFromJSON(jsonValue));
    }

    /**
     */
    private forumControllerGetThreadForKeyValidation(requestParameters: ForumControllerGetThreadForKeyRequest) {
        if (requestParameters.forumCreateThreadDTO === null || requestParameters.forumCreateThreadDTO === undefined) {
            throw new runtime.RequiredError('forumCreateThreadDTO','Required parameter requestParameters.forumCreateThreadDTO was null or undefined when calling forumControllerGetThreadForKey.');
        }
    }

    /**
     */
    private async forumControllerMessagesRaw(requestParameters: ForumControllerMessagesRequest): Promise<runtime.ApiResponse<Array<ForumMessageDTO>>> {
        this.forumControllerMessagesValidation(requestParameters);
        const context = this.forumControllerMessagesContext(requestParameters);
        const response = await this.request(context);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ForumMessageDTOFromJSON));
    }

    /**
     */
    private forumControllerMessagesValidation(requestParameters: ForumControllerMessagesRequest) {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling forumControllerMessages.');
        }
    }

    /**
     */
    private async forumControllerPostMessageRaw(requestParameters: ForumControllerPostMessageRequest): Promise<runtime.ApiResponse<ForumMessageDTO>> {
        this.forumControllerPostMessageValidation(requestParameters);
        const context = this.forumControllerPostMessageContext(requestParameters);
        const response = await this.request(context);

        return new runtime.JSONApiResponse(response, (jsonValue) => ForumMessageDTOFromJSON(jsonValue));
    }

    /**
     */
    private forumControllerPostMessageValidation(requestParameters: ForumControllerPostMessageRequest) {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling forumControllerPostMessage.');
        }
        if (requestParameters.forumCreateMessageDTO === null || requestParameters.forumCreateMessageDTO === undefined) {
            throw new runtime.RequiredError('forumCreateMessageDTO','Required parameter requestParameters.forumCreateMessageDTO was null or undefined when calling forumControllerPostMessage.');
        }
    }

}