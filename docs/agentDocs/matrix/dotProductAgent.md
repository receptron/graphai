## dotProductAgent

### Description

dotProduct Agent

### Samples

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

````

#### params

```json

{}

````

#### result

```json

[
  7,
  17,
  27
]

````
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

````

#### params

```json

{}

````

#### result

```json

[
  5,
  8
]

````

### Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "matrix": {
      "type": "array",
      "description": "two dimentional matrix"
    },
    "vector": {
      "type": "array",
      "description": "the vector"
    }
  },
  "required": [
    "array",
    "vector"
  ]
}

````

#### output

```json

{
  "type": "array"
}

````

### Input Format

```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$1",
  ":agentId.$2"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$1"
]

````

### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

