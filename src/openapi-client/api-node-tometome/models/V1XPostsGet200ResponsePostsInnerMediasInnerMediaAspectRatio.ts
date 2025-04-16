/* tslint:disable */
/* eslint-disable */
/**
 * api node tometome
 * API documentation.
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { V1XPostsGet200ResponsePostsInnerReplyId } from './V1XPostsGet200ResponsePostsInnerReplyId';
import {
    V1XPostsGet200ResponsePostsInnerReplyIdFromJSON,
    V1XPostsGet200ResponsePostsInnerReplyIdFromJSONTyped,
    V1XPostsGet200ResponsePostsInnerReplyIdToJSON,
    V1XPostsGet200ResponsePostsInnerReplyIdToJSONTyped,
} from './V1XPostsGet200ResponsePostsInnerReplyId';

/**
 * 
 * @export
 * @interface V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatio
 */
export interface V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatio {
    /**
     * 
     * @type {V1XPostsGet200ResponsePostsInnerReplyId}
     * @memberof V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatio
     */
    width?: V1XPostsGet200ResponsePostsInnerReplyId;
    /**
     * 
     * @type {V1XPostsGet200ResponsePostsInnerReplyId}
     * @memberof V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatio
     */
    height?: V1XPostsGet200ResponsePostsInnerReplyId;
}

/**
 * Check if a given object implements the V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatio interface.
 */
export function instanceOfV1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatio(value: object): value is V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatio {
    return true;
}

export function V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatioFromJSON(json: any): V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatio {
    return V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatioFromJSONTyped(json, false);
}

export function V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatioFromJSONTyped(json: any, ignoreDiscriminator: boolean): V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatio {
    if (json == null) {
        return json;
    }
    return {
        
        'width': json['width'] == null ? undefined : V1XPostsGet200ResponsePostsInnerReplyIdFromJSON(json['width']),
        'height': json['height'] == null ? undefined : V1XPostsGet200ResponsePostsInnerReplyIdFromJSON(json['height']),
    };
}

export function V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatioToJSON(json: any): V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatio {
    return V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatioToJSONTyped(json, false);
}

export function V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatioToJSONTyped(value?: V1XPostsGet200ResponsePostsInnerMediasInnerMediaAspectRatio | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'width': V1XPostsGet200ResponsePostsInnerReplyIdToJSON(value['width']),
        'height': V1XPostsGet200ResponsePostsInnerReplyIdToJSON(value['height']),
    };
}

