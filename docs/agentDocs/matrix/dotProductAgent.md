## dotProductAgent

### Description

dotProduct Agent

### Samples

#### inputs

```json

{
  "matrix": [
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
  "vector": [
    3,
    2
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
  7,
  17,
  27
]

````
#### inputs

```json

{
  "matrix": [
    [
      1,
      2
    ],
    [
      2,
      3
    ]
  ],
  "vector": [
    1,
    2
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
  5,
  8
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
    "matrix": {
      "type": "array",
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
    "vector": {
      "type": "array",
      "items": {
        "required": [],
        "properties": {}
      }
    }
  },
  "required": [
    "matrix",
    "vector"
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
    "matrix": {
      "type": "array",
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
    "vector": {
      "type": "array",
      "items": {
        "required": [],
        "properties": {}
      }
    }
  },
  "required": [
    "matrix",
    "vector"
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
  ":agentId.$1"
]

````

### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

