# YouTubeApi

All URIs are relative to *https://api.node.tometome.giize.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1YoutubeReleaseGet**](YouTubeApi.md#v1youtubereleaseget) | **GET** /v1/youtube/release | リリースされたアルバムのリストを返します。 |
| [**v1YoutubeReleasesGet**](YouTubeApi.md#v1youtubereleasesget) | **GET** /v1/youtube/releases | リリースされたアルバムのリストを返します。 |
| [**v1YoutubeSongsGet**](YouTubeApi.md#v1youtubesongsget) | **GET** /v1/youtube/songs | リリースされたアルバムのリストを返します。 |



## v1YoutubeReleaseGet

> V1YoutubeReleaseGet200Response v1YoutubeReleaseGet(releaseid)

リリースされたアルバムのリストを返します。

### Example

```ts
import {
  Configuration,
  YouTubeApi,
} from '';
import type { V1YoutubeReleaseGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new YouTubeApi();

  const body = {
    // string
    releaseid: MPREb_QBTyp2wAmDf,
  } satisfies V1YoutubeReleaseGetRequest;

  try {
    const data = await api.v1YoutubeReleaseGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **releaseid** | `string` |  | [Defaults to `undefined`] |

### Return type

[**V1YoutubeReleaseGet200Response**](V1YoutubeReleaseGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | YouTube releases |  -  |
| **429** | Rate limit exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1YoutubeReleasesGet

> V1YoutubeReleasesGet200Response v1YoutubeReleasesGet(channelid)

リリースされたアルバムのリストを返します。

### Example

```ts
import {
  Configuration,
  YouTubeApi,
} from '';
import type { V1YoutubeReleasesGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new YouTubeApi();

  const body = {
    // string
    channelid: channelid_example,
  } satisfies V1YoutubeReleasesGetRequest;

  try {
    const data = await api.v1YoutubeReleasesGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **channelid** | `string` |  | [Defaults to `undefined`] |

### Return type

[**V1YoutubeReleasesGet200Response**](V1YoutubeReleasesGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | YouTube releases |  -  |
| **429** | Rate limit exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1YoutubeSongsGet

> V1YoutubeSongsGet200Response v1YoutubeSongsGet(channelid)

リリースされたアルバムのリストを返します。

### Example

```ts
import {
  Configuration,
  YouTubeApi,
} from '';
import type { V1YoutubeSongsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new YouTubeApi();

  const body = {
    // string
    channelid: channelid_example,
  } satisfies V1YoutubeSongsGetRequest;

  try {
    const data = await api.v1YoutubeSongsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **channelid** | `string` |  | [Defaults to `undefined`] |

### Return type

[**V1YoutubeSongsGet200Response**](V1YoutubeSongsGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | YouTube releases |  -  |
| **429** | Rate limit exceeded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

