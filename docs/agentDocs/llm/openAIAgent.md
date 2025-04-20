# openAIAgent

## Package
[@graphai/openai_agent](https://www.npmjs.com/package/@graphai/openai_agent)
## Source
[https://github.com/receptron/graphai/blob/main/llm_agents/openai_agent/src/openai_agent.ts](https://github.com/receptron/graphai/blob/main/llm_agents/openai_agent/src/openai_agent.ts)

## Description

OpenAI Agent

## Schema

#### inputs

```json
{
  "type": "object",
  "properties": {
    "model": {
      "type": "string"
    },
    "system": {
      "type": "string"
    },
    "tools": {
      "type": "object"
    },
    "tool_choice": {
      "anyOf": [
        {
          "type": "array"
        },
        {
          "type": "object"
        }
      ]
    },
    "max_tokens": {
      "type": "number"
    },
    "verbose": {
      "type": "boolean"
    },
    "temperature": {
      "type": "number"
    },
    "baseURL": {
      "type": "string"
    },
    "apiKey": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        }
      ]
    },
    "stream": {
      "type": "boolean"
    },
    "prompt": {
      "type": "string",
      "description": "query string"
    },
    "messages": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        },
        {
          "type": "array"
        }
      ],
      "description": "chat messages"
    }
  }
}
```

#### output

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "object": {
      "type": "string"
    },
    "created": {
      "type": "integer"
    },
    "model": {
      "type": "string"
    },
    "choices": {
      "type": "array",
      "items": [
        {
          "type": "object",
          "properties": {
            "index": {
              "type": "integer"
            },
            "message": {
              "type": "array",
              "items": [
                {
                  "type": "object",
                  "properties": {
                    "content": {
                      "type": "string"
                    },
                    "role": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "content",
                    "role"
                  ]
                }
              ]
            }
          },
          "required": [
            "index",
            "message",
            "logprobs",
            "finish_reason"
          ]
        }
      ]
    },
    "usage": {
      "type": "object",
      "properties": {
        "prompt_tokens": {
          "type": "integer"
        },
        "completion_tokens": {
          "type": "integer"
        },
        "total_tokens": {
          "type": "integer"
        }
      },
      "required": [
        "prompt_tokens",
        "completion_tokens",
        "total_tokens"
      ]
    },
    "text": {
      "type": "string"
    },
    "tool": {
      "arguments": {
        "type": "object"
      },
      "name": {
        "type": "string"
      }
    },
    "message": {
      "type": "object",
      "properties": {
        "content": {
          "type": "string"
        },
        "role": {
          "type": "string"
        }
      },
      "required": [
        "content",
        "role"
      ]
    }
  },
  "required": [
    "id",
    "object",
    "created",
    "model",
    "choices",
    "usage"
  ]
}
```

## Input example of the next node

```json
[
  ":agentId",
  ":agentId.object",
  ":agentId.id",
  ":agentId.choices",
  ":agentId.choices.$0",
  ":agentId.choices.$0.message",
  ":agentId.choices.$0.message.role",
  ":agentId.choices.$0.message.content",
  ":agentId.choices.$0.finish_reason",
  ":agentId.choices.$0.index",
  ":agentId.choices.$0.logprobs",
  ":agentId.created",
  ":agentId.model"
]
```

## Samples

### Sample0

#### inputs

```json
{
  "prompt": "this is response result"
}
```

#### params

```json
{}
```

#### result

```json
{
  "object": "chat.completion",
  "id": "chatcmpl-9N7HxXYbwjmdbdiQE94MHoVluQhyt",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "this is response result"
      },
      "finish_reason": "stop",
      "index": 0,
      "logprobs": null
    }
  ],
  "created": 1715296589,
  "model": "gpt-4o"
}
```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT
