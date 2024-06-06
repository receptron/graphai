## fetchAgent

### Description

Retrieves JSON data from the specified URL

### Samples

#### inputs

```json

{
  "url": "https://www.google.com",
  "queryParams": {
    "foo": "bar"
  },
  "headers": {
    "x-myHeader": "secret"
  }
}

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

{
  "url": "https://www.google.com",
  "body": {
    "foo": "bar"
  }
}

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
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "minLength": 1
    },
    "queryParams": {
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
    "headers": {
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
  },
  "required": [
    "url",
    "queryParams",
    "headers"
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
    "url": {
      "type": "string",
      "minLength": 1
    },
    "body": {
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
  },
  "required": [
    "url",
    "body"
  ]
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

