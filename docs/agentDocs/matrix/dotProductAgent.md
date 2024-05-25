## dotProductAgent

### Description

dotProduct Agent

### Samples

#### inputs

```json

[
  [
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
  [
    3,
    2
  ]
]

````

#### params

```json

{}

````

#### result

```json

[
  7,
  17,
  27
]

````
#### inputs

```json

[
  [
    [
      1,
      2
    ],
    [
      2,
      3
    ]
  ],
  [
    1,
    2
  ]
]

````

#### params

```json

{}

````

#### result

```json

[
  5,
  8
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
      "0",
      "1"
    ],
    "properties": {
      "0": {
        "type": "array",
        "uniqueItems": true,
        "items": {
          "required": [],
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
            },
            "2": {
              "type": "array",
              "uniqueItems": true,
              "items": {
                "required": [],
                "properties": {}
              }
            }
          }
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
  ":agentId.$0",
  ":agentId.$1",
  ":agentId.$2"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$1"
]

````

### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

