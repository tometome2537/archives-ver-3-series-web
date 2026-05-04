
# YoutubeReleases


## Properties

Name | Type
------------ | -------------
`id` | string
`releaseId` | string
`type` | string
`title` | string
`year` | number
`thumbnailUrl` | string
`duration` | number
`artistChannelIds` | Array&lt;string&gt;
`createdAt` | Date
`lastUpdated` | Date

## Example

```typescript
import type { YoutubeReleases } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "releaseId": null,
  "type": null,
  "title": null,
  "year": null,
  "thumbnailUrl": null,
  "duration": null,
  "artistChannelIds": null,
  "createdAt": null,
  "lastUpdated": null,
} satisfies YoutubeReleases

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as YoutubeReleases
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


