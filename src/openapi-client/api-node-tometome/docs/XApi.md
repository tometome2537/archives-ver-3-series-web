# XApi

All URIs are relative to *https://api.node.tometome.giize.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1XPostPostIdGet**](XApi.md#v1xpostpostidget) | **GET** /v1/x/post/{postId} |  |
| [**v1XPostsGet**](XApi.md#v1xpostsget) | **GET** /v1/x/posts | Retrieve posts and user data |
| [**v1XUserGet**](XApi.md#v1xuserget) | **GET** /v1/x/user | Retrieve user data |
| [**xTextGet**](XApi.md#xtextget) | **GET** /x-text | テキストデータの解析 |
| [**xTextPost**](XApi.md#xtextpostoperation) | **POST** /x-text | テキストデータの解析 |



## v1XPostPostIdGet

> V1XPostPostIdGet200Response v1XPostPostIdGet(postId)



### Example

```ts
import {
  Configuration,
  XApi,
} from '';
import type { V1XPostPostIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: TokenAuth
    apiKey: "YOUR API KEY",
  });
  const api = new XApi(config);

  const body = {
    // string
    postId: postId_example,
  } satisfies V1XPostPostIdGetRequest;

  try {
    const data = await api.v1XPostPostIdGet(body);
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
| **postId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**V1XPostPostIdGet200Response**](V1XPostPostIdGet200Response.md)

### Authorization

[TokenAuth](../README.md#TokenAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | JWT |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1XPostsGet

> V1XPostsGet200Response v1XPostsGet(userid, username, relatedposts, count)

Retrieve posts and user data

Fetches posts and user information based on user ID or post ID.

### Example

```ts
import {
  Configuration,
  XApi,
} from '';
import type { V1XPostsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: TokenAuth
    apiKey: "YOUR API KEY",
  });
  const api = new XApi(config);

  const body = {
    // string | The ID of the user whose posts are to be retrieved. (optional)
    userid: userid_example,
    // string | ユーザー名(@は含まない)。 (optional)
    username: username_example,
    // boolean | The ID of a specific post to retrieve. (optional)
    relatedposts: true,
    // number | 取得する件数 (optional)
    count: 8.14,
  } satisfies V1XPostsGetRequest;

  try {
    const data = await api.v1XPostsGet(body);
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
| **userid** | `string` | The ID of the user whose posts are to be retrieved. | [Optional] [Defaults to `undefined`] |
| **username** | `string` | ユーザー名(@は含まない)。 | [Optional] [Defaults to `undefined`] |
| **relatedposts** | `boolean` | The ID of a specific post to retrieve. | [Optional] [Defaults to `undefined`] |
| **count** | `number` | 取得する件数 | [Optional] [Defaults to `undefined`] |

### Return type

[**V1XPostsGet200Response**](V1XPostsGet200Response.md)

### Authorization

[TokenAuth](../README.md#TokenAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response with user and posts data. |  -  |
| **500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1XUserGet

> XUser v1XUserGet(userid, username)

Retrieve user data

Fetches user information based on user ID.

### Example

```ts
import {
  Configuration,
  XApi,
} from '';
import type { V1XUserGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: TokenAuth
    apiKey: "YOUR API KEY",
  });
  const api = new XApi(config);

  const body = {
    // string | The ID of the user to retrieve. (optional)
    userid: userid_example,
    // string | The ID of the user to retrieve. (optional)
    username: username_example,
  } satisfies V1XUserGetRequest;

  try {
    const data = await api.v1XUserGet(body);
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
| **userid** | `string` | The ID of the user to retrieve. | [Optional] [Defaults to `undefined`] |
| **username** | `string` | The ID of the user to retrieve. | [Optional] [Defaults to `undefined`] |

### Return type

[**XUser**](XUser.md)

### Authorization

[TokenAuth](../README.md#TokenAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response with user data. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## xTextGet

> XText xTextGet(text)

テキストデータの解析

投稿のテキストの文字数をカウントします。

### Example

```ts
import {
  Configuration,
  XApi,
} from '';
import type { XTextGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new XApi();

  const body = {
    // string | 解析するテキスト
    text: text_example,
  } satisfies XTextGetRequest;

  try {
    const data = await api.xTextGet(body);
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
| **text** | `string` | 解析するテキスト | [Defaults to `undefined`] |

### Return type

[**XText**](XText.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | テキスト解析の結果 |  -  |
| **500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## xTextPost

> XText xTextPost(xTextPostRequest)

テキストデータの解析

投稿のテキストの文字数をカウントします。

### Example

```ts
import {
  Configuration,
  XApi,
} from '';
import type { XTextPostOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new XApi();

  const body = {
    // XTextPostRequest (optional)
    xTextPostRequest: ...,
  } satisfies XTextPostOperationRequest;

  try {
    const data = await api.xTextPost(body);
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
| **xTextPostRequest** | [XTextPostRequest](XTextPostRequest.md) |  | [Optional] |

### Return type

[**XText**](XText.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | テキスト解析の結果 |  -  |
| **500** | Internal server error. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

