## sortByValuesAgent

### Description

sortByValues Agent

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
    },
    "values": {
      "type": "array",
      "items": {
        "required": [],
        "properties": {}
      }
    }
  },
  "required": [
    "array",
    "values"
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
    "values": {
      "type": "array",
      "items": {
        "required": [],
        "properties": {}
      }
    }
  },
  "required": [
    "array",
    "values"
  ]
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

### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

