# arrayFindFirstExistsAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/array_flat_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/array_flat_agent.ts)

## Description

Array Flat Agent

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "description": "The array to be find"
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
  "type": "object"
}

```

## Input example of the next node

```json

[
  ":agentId"
]

```
```json

[
  ":agentId"
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
  "array": [
    null,
    2
  ]
}

```

#### params

```json

{}

```

#### result

```json

2

```
### Sample1

#### inputs

```json

{
  "array": [
    null,
    null,
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

3

```
### Sample2

#### inputs

```json

{
  "array": [
    null,
    null,
    0
  ]
}

```

#### params

```json

{}

```

#### result

```json

0

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

