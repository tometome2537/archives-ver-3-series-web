
# YoutubeVideo


## Properties

Name | Type
------------ | -------------
`id` | string
`ownerChannelId` | string
`channelId` | string
`publishedAt` | Date
`privacyStatus` | string
`_short` | boolean
`musicType` | string
`thumbnailUrl` | string
`artistId` | Array&lt;string&gt;
`duration` | number

## Example

```typescript
import type { YoutubeVideo } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "ownerChannelId": null,
  "channelId": null,
  "publishedAt": null,
  "privacyStatus": null,
  "_short": null,
  "musicType": null,
  "thumbnailUrl": null,
  "artistId": null,
  "duration": null,
} satisfies YoutubeVideo

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as YoutubeVideo
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


