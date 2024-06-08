## popAgent

### Description

Pop Agent

### Schema

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

````

#### output

```json

{
  "type": "object",
  "properties": {
    "item": {
      "type": "any",
      "description": "the item popped from the array"
    },
    "array": {
      "type": "array",
      "description": "the remaining array"
    }
  }
}

````

### Input Format

```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$1",
  ":agentId.item"
]

````
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$1",
  ":agentId.item"
]

````
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$1",
  ":agentId.item"
]

````

### Samples

#### inputs

```json

{
  "array": [
    1,
    2,
    3
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
    2
  ],
  "item": 3
}

````
#### inputs

```json

{
  "array": [
    "a",
    "b",
    "c"
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
    "b"
  ],
  "item": "c"
}

````
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
    2
  ],
  "item": 3
}

````

### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

