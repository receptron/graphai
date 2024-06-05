## pushAgent

### Description

push Agent

### Samples

#### inputs

```json

{
  "array": [
    1,
    2
  ],
  "item": 3
}

````

#### params

```json

{}

````

#### result

```json

[
  1,
  2,
  3
]

````
#### inputs

```json

{
  "array": [
    {
      "apple": 1
    }
  ],
  "item": {
    "lemon": 2
  }
}

````

#### params

```json

{}

````

#### result

```json

[
  {
    "apple": 1
  },
  {
    "lemon": 2
  }
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
    "item": {
      "type": "number"
    }
  },
  "required": [
    "array",
    "item"
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
      "uniqueItems": true,
      "minItems": 1,
      "items": {
        "required": [
          "apple"
        ],
        "properties": {
          "apple": {
            "type": "number"
          }
        }
      }
    },
    "item": {
      "type": "object",
      "properties": {
        "lemon": {
          "type": "number"
        }
      },
      "required": [
        "lemon"
      ]
    }
  },
  "required": [
    "array",
    "item"
  ]
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
  ":agentId.$0.apple",
  ":agentId.$1",
  ":agentId.$1.lemon"
]

````

### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

