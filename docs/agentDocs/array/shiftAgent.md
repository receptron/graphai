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
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "items": {
        "required": [],
        "properties": {}
      }
    }
  },
  "required": [
    "array"
  ]
}

````
#### inputs

```json

{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "items": {
        "required": [],
        "properties": {}
      }
    }
  },
  "required": [
    "array"
  ]
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

