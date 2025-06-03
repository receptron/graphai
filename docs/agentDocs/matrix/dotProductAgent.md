# dotProductAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/matrix_agents/dot_product_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/matrix_agents/dot_product_agent.ts)

## Description

dotProduct Agent

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "matrix": {
      "type": "array",
      "description": "A two-dimensional array of numbers. Each inner array represents a vector to be compared.",
      "items": {
        "type": "array",
        "items": {
          "type": "number",
          "description": "A numeric value within a vector."
        },
        "description": "A vector of numbers (row in the matrix)."
      }
    },
    "vector": {
      "type": "array",
      "description": "A single vector of numbers to compute dot products with each vector in the matrix.",
      "items": {
        "type": "number",
        "description": "A numeric component of the target vector."
      }
    }
  },
  "required": [
    "matrix",
    "vector"
  ],
  "additionalProperties": false
}

```

#### output

```json

{
  "type": "array",
  "description": "An array of numbers representing the dot products between each vector in 'matrix' and the input 'vector'.",
  "items": {
    "type": "number",
    "description": "The result of a dot product between a matrix row and the input vector."
  }
}

```

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$1",
  ":agentId.$2"
]

```
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$1"
]

```

## Samples

### Sample0

#### inputs

```json

{
  "matrix": [
    [
      1,
      2
    ],
    [
      3,
      4
    ],
    [
      5,
      6
    ]
  ],
  "vector": [
    3,
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

[
  7,
  17,
  27
]

```
### Sample1

#### inputs

```json

{
  "matrix": [
    [
      1,
      2
    ],
    [
      2,
      3
    ]
  ],
  "vector": [
    1,
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

[
  5,
  8
]

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

