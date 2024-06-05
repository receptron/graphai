## popAgent

### Description

Pop Agent

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
    },
    "array2": {
      "type": "array",
      "items": {
        "required": [],
        "properties": {}
      }
    }
  },
  "required": [
    "array",
    "array2"
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

