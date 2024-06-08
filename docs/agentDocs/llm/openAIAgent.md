## openAIAgent

### Description

Openai Agent

### Schema

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
      "type": "any"
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
      "type": "any"
    },
    "stream": {
      "type": "boolean"
    },
    "prompt": {
      "type": "string",
      "description": "query string"
    },
    "messages": {
      "type": "any",
      "description": "chat messages"
    }
  }
}

````

#### output

```json

{
  "type": "object"
}

````

### Input Format

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

````

### Samples

#### inputs

```json

[
  "this is response result"
]

````

#### params

```json

{}

````

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
  "model": "gpt-3.5-turbo-0125"
}

````

### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

