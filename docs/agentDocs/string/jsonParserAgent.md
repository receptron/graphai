## jsonParserAgent

### Description

Template agent

### Samples

#### inputs

```json

[
  {
    "apple": "red",
    "lemon": "yellow"
  }
]

````

#### params

```json

{"stringify":true}

````

#### result

```json

"{\n  \"apple\": \"red\",\n  \"lemon\": \"yellow\"\n}"

````
#### inputs

```json

[
  "{\n  \"apple\": \"red\",\n  \"lemon\": \"yellow\"\n}"
]

````

#### params

```json

{}

````

#### result

```json

{
  "apple": "red",
  "lemon": "yellow"
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
      "apple",
      "lemon"
    ],
    "properties": {
      "apple": {
        "type": "string",
        "minLength": 1
      },
      "lemon": {
        "type": "string",
        "minLength": 1
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
    "required": [],
    "properties": {}
  }
}

````

### Input Format

```json

[
  ":agentId"
]

````
```json

[
  ":agentId",
  ":agentId.apple",
  ":agentId.lemon"
]

````

### Author

Satoshi Nakajima

### Repository

https://github.com/receptron/graphai


### License

MIT

