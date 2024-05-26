## popAgent

### Description

Pop Agent

### Samples

#### inputs

```json

[
  [
    1,
    2,
    3
  ]
]

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

[
  [
    "a",
    "b",
    "c"
  ]
]

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

[
  [
    1,
    2,
    3
  ],
  [
    "a",
    "b",
    "c"
  ]
]

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
  "type": "array",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "minItems": 1,
  "uniqueItems": true,
  "items": {
    "type": "object",
    "required": [
      "0"
    ],
    "properties": {
      "0": {
        "type": "array",
        "uniqueItems": true,
        "items": {
          "required": [],
          "properties": {}
        }
      }
    }
  }
}

````
#### inputs

```json

{
  "type": "array",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "minItems": 1,
  "uniqueItems": true,
  "items": {
    "type": "object",
    "required": [
      "0"
    ],
    "properties": {
      "0": {
        "type": "array",
        "uniqueItems": true,
        "items": {
          "required": [],
          "properties": {}
        }
      }
    }
  }
}

````
#### inputs

```json

{
  "type": "array",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "minItems": 1,
  "uniqueItems": true,
  "items": {
    "type": "object",
    "required": [
      "0",
      "1"
    ],
    "properties": {
      "0": {
        "type": "array",
        "uniqueItems": true,
        "items": {
          "required": [],
          "properties": {}
        }
      },
      "1": {
        "type": "array",
        "uniqueItems": true,
        "items": {
          "required": [],
          "properties": {}
        }
      }
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

### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

