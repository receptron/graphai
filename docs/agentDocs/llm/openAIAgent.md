## openAIAgent

### Description

Openai Agent

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

### Schema

#### inputs

```json

{
  "type": "array",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "minItems": 1,
  "uniqueItems": true,
  "items": {
    "type": "object",
    "required": [],
    "properties": {}
  }
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

### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

