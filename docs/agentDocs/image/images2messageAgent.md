# images2messageAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/images_agents/image_to_message_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/images_agents/image_to_message_agent.ts)

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
      "description": "An array of base64-encoded image data strings or image URLs. These will be converted into OpenAI Vision-compatible image message format.",
      "items": {
        "type": "string",
        "description": "Base64 image string or HTTP URL depending on 'imageType'."
      }
    },
    "prompt": {
      "type": "string",
      "description": "Optional prompt text to include as the first message content before images."
    }
  },
  "required": [
    "array"
  ],
  "additionalProperties": false
}

```

#### output

```json

{
  "type": "object",
  "properties": {
    "message": {
      "type": "object",
      "description": "OpenAI-compatible chat message including images and optional prompt text.",
      "properties": {
        "role": {
          "type": "string",
          "enum": [
            "user"
          ],
          "description": "Message role, always 'user' for this agent."
        },
        "content": {
          "type": "array",
          "description": "The array of message content elements, including optional text and one or more images.",
          "items": {
            "type": "object",
            "oneOf": [
              {
                "properties": {
                  "type": {
                    "type": "string",
                    "const": "text"
                  },
                  "text": {
                    "type": "string",
                    "description": "Prompt message text."
                  }
                },
                "required": [
                  "type",
                  "text"
                ],
                "additionalProperties": false
              },
              {
                "properties": {
                  "type": {
                    "type": "string",
                    "const": "image_url"
                  },
                  "image_url": {
                    "type": "object",
                    "properties": {
                      "url": {
                        "type": "string",
                        "description": "URL or data URL of the image."
                      },
                      "detail": {
                        "type": "string",
                        "description": "Image detail level (e.g., 'high', 'low', 'auto'). Optional for base64."
                      }
                    },
                    "required": [
                      "url"
                    ],
                    "additionalProperties": false
                  }
                },
                "required": [
                  "type",
                  "image_url"
                ],
                "additionalProperties": false
              }
            ]
          }
        }
      },
      "required": [
        "role",
        "content"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "message"
  ],
  "additionalProperties": false
}

```

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

```
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

```
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

```

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

```

#### params

```json

{"imageType":"png"}

```

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

```
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

```

#### params

```json

{"imageType":"jpg","detail":"high"}

```

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

```
### Sample2

#### inputs

```json

{
  "array": [
    "http://example.com/1.jpg",
    "http://example.com/2.jpg"
  ]
}

```

#### params

```json

{"imageType":"http"}

```

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

```

## Author

Receptron team

## Repository

https://github.com/snakajima/graphai

## License

MIT

