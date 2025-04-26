# mergeObjectAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/merge_objects_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/merge_objects_agent.ts)

## Description

Returns namedInputs

## Schema

#### inputs

```json

{
  "anyOf": [
    {
      "type": "object"
    }
  ]
}

```

#### output

```json

{
  "anyOf": {
    "type": "object"
  }
}

```

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.color",
  ":agentId.model"
]

```

## Samples

### Sample0

#### inputs

```json

{
  "items": [
    {
      "color": "red"
    },
    {
      "model": "Model 3"
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
  "color": "red",
  "model": "Model 3"
}

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

