## shiftAgent

### Description

shift Agent

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
    2,
    3
  ],
  "item": 1
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
    "b",
    "c"
  ],
  "item": "a"
}

````

### Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "description": "the array to shift an item from"
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
      "description": "the item shifted from the array"
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

### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

