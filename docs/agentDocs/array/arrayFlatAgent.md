# arrayFlatAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/array_flat_agent.ts](https://www.npmjs.com/package/https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/array_flat_agent.ts)

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
      "description": "The array to be flattened"
    }
  },
  "required": [
    "array"
  ]
}

````

#### output

```json

{
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "description": "flattened array"
    }
  }
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$1",
  ":agentId.array.$2"
]

````
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$1",
  ":agentId.array.$2",
  ":agentId.array.$2.$0"
]

````
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$1",
  ":agentId.array.$2"
]

````
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$1",
  ":agentId.array.$2"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "array": [
    [
      1
    ],
    [
      2
    ],
    [
      3
    ]
  ]
}

````

#### params

```json

{}

````

#### result

```json

{
  "array": [
    1,
    2,
    3
  ]
}

````
### Sample1

#### inputs

```json

{
  "array": [
    [
      1
    ],
    [
      2
    ],
    [
      [
        3
      ]
    ]
  ]
}

````

#### params

```json

{}

````

#### result

```json

{
  "array": [
    1,
    2,
    [
      3
    ]
  ]
}

````
### Sample2

#### inputs

```json

{
  "array": [
    [
      1
    ],
    [
      2
    ],
    [
      [
        3
      ]
    ]
  ]
}

````

#### params

```json

{"depth":2}

````

#### result

```json

{
  "array": [
    1,
    2,
    3
  ]
}

````
### Sample3

#### inputs

```json

{
  "array": [
    [
      "a"
    ],
    [
      "b"
    ],
    [
      "c"
    ]
  ]
}

````

#### params

```json

{}

````

#### result

```json

{
  "array": [
    "a",
    "b",
    "c"
  ]
}

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

