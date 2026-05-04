
# YoutubeRelease


## Properties

Name | Type
------------ | -------------
`id` | string
`listIndex` | number
`title` | string
`videoId` | string
`duration` | number
`releaseVideoId` | string
`playlistId` | string

## Example

```typescript
import type { YoutubeRelease } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "listIndex": null,
  "title": null,
  "videoId": null,
  "duration": null,
  "releaseVideoId": null,
  "playlistId": null,
} satisfies YoutubeRelease

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as YoutubeRelease
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


