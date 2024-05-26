## fetchAgent

### Description

Retrieves JSON data from the specified URL

### Samples

#### inputs

```json

[
  "https://www.google.com",
  {
    "foo": "bar"
  },
  {
    "x-myHeader": "secret"
  }
]

````

#### params

```json

{"debug":true}

````

#### result

```json

{
  "method": "GET",
  "url": "https://www.google.com/?foo=bar",
  "headers": {
    "x-myHeader": "secret"
  }
}

````
#### inputs

```json

[
  "https://www.google.com",
  null,
  null,
  {
    "foo": "bar"
  }
]

````

#### params

```json

{"debug":true}

````

#### result

```json

{
  "method": "POST",
  "url": "https://www.google.com/",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"foo\":\"bar\"}"
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
      "1",
      "2"
    ],
    "properties": {
      "1": {
        "type": "object",
        "properties": {
          "foo": {
            "type": "string",
            "minLength": 1
          }
        },
        "required": [
          "foo"
        ]
      },
      "2": {
        "type": "object",
        "properties": {
          "x-myHeader": {
            "type": "string",
            "minLength": 1
          }
        },
        "required": [
          "x-myHeader"
        ]
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
      "3"
    ],
    "properties": {
      "3": {
        "type": "object",
        "properties": {
          "foo": {
            "type": "string",
            "minLength": 1
          }
        },
        "required": [
          "foo"
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
  ":agentId.method",
  ":agentId.url",
  ":agentId.headers",
  ":agentId.headers.x-myHeader",
  ":agentId.body"
]

````
```json

[
  ":agentId",
  ":agentId.method",
  ":agentId.url",
  ":agentId.headers",
  ":agentId.headers.Content-Type",
  ":agentId.body"
]

````

### Author

Receptron

### Repository

https://github.com/receptron/graphai


### License

MIT

