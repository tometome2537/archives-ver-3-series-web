# DefaultApi

All URIs are relative to *https://api.node.tometome.giize.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**jwtAppleMusicNameGet**](DefaultApi.md#jwtapplemusicnameget) | **GET** /jwt/apple/music/{name} |  |



## jwtAppleMusicNameGet

> JwtAppleMusicNameGet200Response jwtAppleMusicNameGet(name)



### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { JwtAppleMusicNameGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    name: name_example,
  } satisfies JwtAppleMusicNameGetRequest;

  try {
    const data = await api.jwtAppleMusicNameGet(body);
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
| **name** | `string` |  | [Defaults to `undefined`] |

### Return type

[**JwtAppleMusicNameGet200Response**](JwtAppleMusicNameGet200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | JWT |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

