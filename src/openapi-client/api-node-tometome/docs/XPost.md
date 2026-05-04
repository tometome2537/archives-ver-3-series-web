
# XPost


## Properties

Name | Type
------------ | -------------
`id` | string
`text` | string
`publishedAt` | Date
`userId` | string
`replyId` | string
`repostId` | string
`quoteRepostId` | string
`urls` | Array&lt;string&gt;
`medias` | [Array&lt;XPostMediasInner&gt;](XPostMediasInner.md)
`mediaTypeVersion` | string

## Example

```typescript
import type { XPost } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "text": null,
  "publishedAt": null,
  "userId": null,
  "replyId": null,
  "repostId": null,
  "quoteRepostId": null,
  "urls": null,
  "medias": null,
  "mediaTypeVersion": null,
} satisfies XPost

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as XPost
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


