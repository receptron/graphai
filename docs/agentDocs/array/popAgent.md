# popAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/pop_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/pop_agent.ts)

## Description

Pop Agent

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "description": "the array to pop an item from"
    }
  },
  "required": [
    "array"
  ]
}

```

#### output

```json

{
  "type": "object",
  "properties": {
    "item": {
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
    },
    "array": {
      "type": "array",
      "description": "the remaining array"
    }
  }
}

```

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$1",
  ":agentId.item"
]

```
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$1",
  ":agentId.item"
]

```
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$1",
  ":agentId.item"
]

```

## Samples

### Sample0

#### inputs

```json

{
  "array": [
    1,
    2,
    3
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
  "array": [
    1,
    2
  ],
  "item": 3
}

```
### Sample1

#### inputs

```json

{
  "array": [
    "a",
    "b",
    "c"
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
  "array": [
    "a",
    "b"
  ],
  "item": "c"
}

```
### Sample2

#### inputs

```json

{
  "array": [
    1,
    2,
    3
  ],
  "array2": [
    "a",
    "b",
    "c"
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
  "array": [
    1,
    2
  ],
  "item": 3
}

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT
