# vanillaFetchAgent



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
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        }
      ],
      "description": "body"
    }
  },
  "required": []
}

````

#### output

```json

{
  "type": "array"
}

````

## Input example of the next node

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
```json

[
  ":agentId",
  ":agentId.method",
  ":agentId.url",
  ":agentId.headers",
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
```json

[
  ":agentId",
  ":agentId.method",
  ":agentId.url",
  ":agentId.headers",
  ":agentId.headers.Content-Type",
  ":agentId.headers.authentication",
  ":agentId.body"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "url": "https://example.com",
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
  "url": "https://example.com/?foo=bar",
  "headers": {
    "x-myHeader": "secret"
  }
}

````
### Sample1

#### inputs

```json

{
  "url": "https://example.com",
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
  "url": "https://example.com/",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"foo\":\"bar\"}"
}

````
### Sample2

#### inputs

```json

{
  "url": "https://example.com",
  "body": {
    "foo": "bar"
  },
  "method": "PUT"
}

````

#### params

```json

{"debug":true}

````

#### result

```json

{
  "method": "PUT",
  "url": "https://example.com/",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"foo\":\"bar\"}"
}

````
### Sample3

#### inputs

```json

{
  "url": "https://example.com",
  "method": "options"
}

````

#### params

```json

{"debug":true}

````

#### result

```json

{
  "method": "OPTIONS",
  "url": "https://example.com/",
  "headers": {}
}

````
### Sample4

#### inputs

```json

{}

````

#### params

```json

{"url":"https://example.com","body":{"foo":"bar"},"method":"PUT","debug":true}

````

#### result

```json

{
  "method": "PUT",
  "url": "https://example.com/",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"foo\":\"bar\"}"
}

````
### Sample5

#### inputs

```json

{
  "method": "DELETE",
  "headers": {
    "authentication": "bearer XXX"
  }
}

````

#### params

```json

{"url":"https://example.com","body":{"foo":"bar"},"method":"PUT","headers":{"Content-Type":"application/json"},"debug":true}

````

#### result

```json

{
  "method": "DELETE",
  "url": "https://example.com/",
  "headers": {
    "Content-Type": "application/json",
    "authentication": "bearer XXX"
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

