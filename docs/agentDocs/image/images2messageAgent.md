# images2messageAgent

## Description

Returns the message data for llm include image

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "description": "the array of base64 image data"
    },
    "prompt": {
      "type": "string",
      "description": "prompt message"
    }
  },
  "required": [
    "array"
  ]
}

````

#### output

```json

{
  "type": "object"
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.message",
  ":agentId.message.content",
  ":agentId.message.content.$0",
  ":agentId.message.content.$0.image_url",
  ":agentId.message.content.$0.image_url.detail",
  ":agentId.message.content.$0.image_url.url",
  ":agentId.message.content.$0.type",
  ":agentId.message.content.$1",
  ":agentId.message.content.$1.image_url",
  ":agentId.message.content.$1.image_url.detail",
  ":agentId.message.content.$1.image_url.url",
  ":agentId.message.content.$1.type",
  ":agentId.message.role"
]

````
```json

[
  ":agentId",
  ":agentId.message",
  ":agentId.message.content",
  ":agentId.message.content.$0",
  ":agentId.message.content.$0.type",
  ":agentId.message.content.$0.text",
  ":agentId.message.content.$1",
  ":agentId.message.content.$1.image_url",
  ":agentId.message.content.$1.image_url.detail",
  ":agentId.message.content.$1.image_url.url",
  ":agentId.message.content.$1.type",
  ":agentId.message.content.$2",
  ":agentId.message.content.$2.image_url",
  ":agentId.message.content.$2.image_url.detail",
  ":agentId.message.content.$2.image_url.url",
  ":agentId.message.content.$2.type",
  ":agentId.message.role"
]

````
```json

[
  ":agentId",
  ":agentId.message",
  ":agentId.message.content",
  ":agentId.message.content.$0",
  ":agentId.message.content.$0.image_url",
  ":agentId.message.content.$0.image_url.url",
  ":agentId.message.content.$0.type",
  ":agentId.message.content.$1",
  ":agentId.message.content.$1.image_url",
  ":agentId.message.content.$1.image_url.url",
  ":agentId.message.content.$1.type",
  ":agentId.message.role"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "array": [
    "abcabc",
    "122123"
  ]
}

````

#### params

```json

{"imageType":"png"}

````

#### result

```json

{
  "message": {
    "content": [
      {
        "image_url": {
          "detail": "auto",
          "url": "data:image/png;base64,abcabc"
        },
        "type": "image_url"
      },
      {
        "image_url": {
          "detail": "auto",
          "url": "data:image/png;base64,122123"
        },
        "type": "image_url"
      }
    ],
    "role": "user"
  }
}

````
### Sample1

#### inputs

```json

{
  "array": [
    "abcabc",
    "122123"
  ],
  "prompt": "hello"
}

````

#### params

```json

{"imageType":"jpg","detail":"high"}

````

#### result

```json

{
  "message": {
    "content": [
      {
        "type": "text",
        "text": "hello"
      },
      {
        "image_url": {
          "detail": "high",
          "url": "data:image/jpg;base64,abcabc"
        },
        "type": "image_url"
      },
      {
        "image_url": {
          "detail": "high",
          "url": "data:image/jpg;base64,122123"
        },
        "type": "image_url"
      }
    ],
    "role": "user"
  }
}

````
### Sample2

#### inputs

```json

{
  "array": [
    "http://example.com/1.jpg",
    "http://example.com/2.jpg"
  ]
}

````

#### params

```json

{"imageType":"http"}

````

#### result

```json

{
  "message": {
    "content": [
      {
        "image_url": {
          "url": "http://example.com/1.jpg"
        },
        "type": "image_url"
      },
      {
        "image_url": {
          "url": "http://example.com/2.jpg"
        },
        "type": "image_url"
      }
    ],
    "role": "user"
  }
}

````

## Author

Receptron team

## Repository

https://github.com/snakajima/graphai

## License

MIT

