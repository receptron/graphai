# arrayToObjectAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/array_to_object.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/array_to_object.ts)

## Description

Array To Object Agent

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "description": "the array to pop an item from"
    }
  },
  "required": [
    "items"
  ]
}

```

#### output

```json

{
  "type": "object",
  "properties": {
    "anyOf": [
      {
        "type": "string"
      },
      {
        "type": "integer"
      },
      {
        "type": "object"
      },
      {
        "type": "array"
      }
    ],
    "description": "the item popped from the array"
  }
}

```

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.1",
  ":agentId.1.id",
  ":agentId.1.data",
  ":agentId.2",
  ":agentId.2.id",
  ":agentId.2.data"
]

```

## Samples

### Sample0

#### inputs

```json

{
  "items": [
    {
      "id": 1,
      "data": "a"
    },
    {
      "id": 2,
      "data": "b"
    }
  ]
}

```

#### params

```json

{"key":"id"}

```

#### result

```json

{
  "1": {
    "id": 1,
    "data": "a"
  },
  "2": {
    "id": 2,
    "data": "b"
  }
}

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

