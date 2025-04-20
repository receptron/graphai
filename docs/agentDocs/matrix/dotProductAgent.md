# dotProductAgent

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
      "description": "two dimensional matrix",
      "items": {
        "type": "array",
        "items": {
          "type": "number"
        }
      }
    },
    "vector": {
      "type": "array",
      "description": "the vector",
      "items": {
        "type": "number"
      }
    }
  },
  "required": [
    "matrix",
    "vector"
  ]
}
```

#### output

```json
{
  "type": "array"
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
