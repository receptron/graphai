## pushAgent

### Description

push Agent

### Samples

#### inputs

```json

[
  [
    1,
    2
  ],
  3
]

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

[
  [
    1,
    2
  ],
  3,
  4,
  5
]

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
  3,
  4,
  5
]

````
#### inputs

```json

[
  [
    {
      "apple": 1
    }
  ],
  {
    "lemon": 2
  }
]

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
      "1": {
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
    }
  }
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
  ":agentId.$1",
  ":agentId.$2",
  ":agentId.$3",
  ":agentId.$4"
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

