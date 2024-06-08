# fetchAgent

## Description

Retrieves JSON data from the specified URL

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "description": "baseurl"
    },
    "method": {
      "type": "string",
      "description": "HTTP method"
    },
    "headers": {
      "type": "object",
      "description": "HTTP headers"
    },
    "quaryParams": {
      "type": "object",
      "description": "Query parameters"
    },
    "body": {
      "type": "object",
      "description": "body"
    }
  },
  "required": [
    "url"
  ]
}

````

#### output

```json

{
  "type": "array"
}

````

## Input Format

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

## Samples

### Sample0

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
### Sample1

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

## Author

Receptron

## Repository

https://github.com/receptron/graphai

## License

MIT

