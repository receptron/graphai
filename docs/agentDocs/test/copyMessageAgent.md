# copyMessageAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/copy_message_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/copy_message_agent.ts)

## Description

CopyMessage agent

## Schema

#### inputs

```json

{
  "type": "object",
  "description": "This agent does not use any inputs. Leave empty.",
  "properties": {},
  "additionalProperties": false
}

```

#### output

```json

{
  "type": "object",
  "description": "An object containing the repeated messages.",
  "properties": {
    "messages": {
      "type": "array",
      "description": "An array of repeated message strings.",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "messages"
  ],
  "additionalProperties": false
}

```

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.messages",
  ":agentId.messages.$0",
  ":agentId.messages.$1",
  ":agentId.messages.$2",
  ":agentId.messages.$3"
]

```

## Samples

### Sample0

#### inputs

```json

{}

```

#### params

```json

{"count":4,"message":"hello"}

```

#### result

```json

{
  "messages": [
    "hello",
    "hello",
    "hello",
    "hello"
  ]
}

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

