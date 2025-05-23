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
import type { YoutubeRelease } from './YoutubeRelease';
import {
    YoutubeReleaseFromJSON,
    YoutubeReleaseFromJSONTyped,
    YoutubeReleaseToJSON,
    YoutubeReleaseToJSONTyped,
} from './YoutubeRelease';

/**
 * 
 * @export
 * @interface V1YoutubeReleasesGet200Response
 */
export interface V1YoutubeReleasesGet200Response {
    /**
     * 
     * @type {Array<YoutubeRelease>}
     * @memberof V1YoutubeReleasesGet200Response
     */
    releases?: Array<YoutubeRelease>;
}

/**
 * Check if a given object implements the V1YoutubeReleasesGet200Response interface.
 */
export function instanceOfV1YoutubeReleasesGet200Response(value: object): value is V1YoutubeReleasesGet200Response {
    return true;
}

export function V1YoutubeReleasesGet200ResponseFromJSON(json: any): V1YoutubeReleasesGet200Response {
    return V1YoutubeReleasesGet200ResponseFromJSONTyped(json, false);
}

export function V1YoutubeReleasesGet200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): V1YoutubeReleasesGet200Response {
    if (json == null) {
        return json;
    }
    return {
        
        'releases': json['releases'] == null ? undefined : ((json['releases'] as Array<any>).map(YoutubeReleaseFromJSON)),
    };
}

export function V1YoutubeReleasesGet200ResponseToJSON(json: any): V1YoutubeReleasesGet200Response {
    return V1YoutubeReleasesGet200ResponseToJSONTyped(json, false);
}

export function V1YoutubeReleasesGet200ResponseToJSONTyped(value?: V1YoutubeReleasesGet200Response | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'releases': value['releases'] == null ? undefined : ((value['releases'] as Array<any>).map(YoutubeReleaseToJSON)),
    };
}

