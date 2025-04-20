# nestedAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/graph_agents/nested_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/graph_agents/nested_agent.ts)

## Description

nested Agent

## Schema

#### inputs

```json

{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {
    "message": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": [
    "message"
  ]
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.test",
  ":agentId.test.$0"
]

````
```json

[
  ":agentId",
  ":agentId.$0"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "message": "hello"
}

````

#### params

```json

{}

````

#### result

```json

{
  "test": [
    "hello"
  ]
}

````
### Sample1

#### inputs

```json

{
  "message": "hello"
}

````

#### params

```json

{"resultNodeId":"test"}

````

#### result

```json

[
  "hello"
]

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

