# mergeNodeIdAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/merge_node_id_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/merge_node_id_agent.ts)

## Description

merge node id agent

## Schema

#### inputs

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "uniqueItems": true,
      "minItems": 1,
      "items": {
        "required": [
          "message"
        ],
        "properties": {
          "message": {
            "type": "string",
            "minLength": 1
          }
        }
      }
    }
  },
  "required": [
    "array"
  ]
}
```

## Input example of the next node

```json
[
  ":agentId",
  ":agentId.message",
  ":agentId.test"
]
```

## Samples

### Sample0

#### inputs

```json
{
  "array": [
    {
      "message": "hello"
    }
  ]
}
```

#### params

```json
{}
```

#### result

```json
{
  "message": "hello",
  "test": "hello"
}
```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT
