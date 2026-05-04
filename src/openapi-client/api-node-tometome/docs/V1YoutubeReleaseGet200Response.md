
# V1YoutubeReleaseGet200Response


## Properties

Name | Type
------------ | -------------
`release` | [YoutubeReleases](YoutubeReleases.md)
`releaseItems` | [Array&lt;YoutubeRelease&gt;](YoutubeRelease.md)
`releaseItemsVideos` | [Array&lt;YoutubeVideo&gt;](YoutubeVideo.md)

## Example

```typescript
import type { V1YoutubeReleaseGet200Response } from ''

// TODO: Update the object below with actual values
const example = {
  "release": null,
  "releaseItems": null,
  "releaseItemsVideos": null,
} satisfies V1YoutubeReleaseGet200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as V1YoutubeReleaseGet200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


