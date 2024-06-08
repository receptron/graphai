## sortByValuesAgent

### Description

sortByValues Agent

### Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "description": "the array to sort"
    },
    "values": {
      "type": "array",
      "description": "values associated with items in the array"
    }
  },
  "required": [
    "array",
    "values"
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
  ":agentId.$2",
  ":agentId.$3"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$1",
  ":agentId.$2",
  ":agentId.$3"
]

````

### Samples

#### inputs

```json

{
  "array": [
    "banana",
    "orange",
    "lemon",
    "apple"
  ],
  "values": [
    2,
    5,
    6,
    4
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
  "lemon",
  "orange",
  "apple",
  "banana"
]

````
#### inputs

```json

{
  "array": [
    "banana",
    "orange",
    "lemon",
    "apple"
  ],
  "values": [
    2,
    5,
    6,
    4
  ]
}

````

#### params

```json

{"assendant":true}

````

#### result

```json

[
  "banana",
  "apple",
  "orange",
  "lemon"
]

````

### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

