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
  "type": "object",
  "properties": {
    "message": {
      "type": "string"
    }
  },
  "required": [
    "message"
  ]
}

```

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.test",
  ":agentId.test.$0"
]

```
```json

[
  ":agentId",
  ":agentId.$0"
]

```
```json

[
  ":agentId"
]

```

## Samples

### Sample0

#### inputs

```json

{
  "message": "hello"
}

```

#### params

```json

{}

```

#### result

```json

{
  "test": [
    "hello"
  ]
}

```
### Sample1

#### inputs

```json

{
  "message": "hello"
}

```

#### params

```json

{"resultNodeId":"test"}

```

#### result

```json

[
  "hello"
]

```
### Sample2

#### inputs

```json

{
  "loopCount": 5
}

```

#### params

```json

{"resultNodeId":"test"}

```

#### result

```json

4

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

