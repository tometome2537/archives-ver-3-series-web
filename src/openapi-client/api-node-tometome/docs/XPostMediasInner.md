
# XPostMediasInner


## Properties

Name | Type
------------ | -------------
`id` | string
`type` | string
`sourcePostId` | string
`sourceUserId` | string
`media` | [XPostMediasInnerMedia](XPostMediasInnerMedia.md)
`image` | [XPostMediasInnerImage](XPostMediasInnerImage.md)

## Example

```typescript
import type { XPostMediasInner } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "type": null,
  "sourcePostId": null,
  "sourceUserId": null,
  "media": null,
  "image": null,
} satisfies XPostMediasInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as XPostMediasInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


