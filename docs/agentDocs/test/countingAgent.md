# countingAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/counting_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/counting_agent.ts)

## Description

Counting agent

## Schema

#### inputs

```json

{
  "type": "object",
  "description": "This agent does not require any inputs. Leave empty.",
  "properties": {},
  "additionalProperties": false
}

```

#### output

```json

{
  "type": "object",
  "description": "An object containing a list of sequential integers.",
  "properties": {
    "list": {
      "type": "array",
      "description": "An array of integers from 0 to count - 1.",
      "items": {
        "type": "integer"
      }
    }
  },
  "required": [
    "list"
  ],
  "additionalProperties": false
}

```

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.list",
  ":agentId.list.$0",
  ":agentId.list.$1",
  ":agentId.list.$2",
  ":agentId.list.$3"
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

{"count":4}

```

#### result

```json

{
  "list": [
    0,
    1,
    2,
    3
  ]
}

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

