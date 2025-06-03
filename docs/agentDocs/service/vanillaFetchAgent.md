# vanillaFetchAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/service_agents/vanilla_fetch_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/service_agents/vanilla_fetch_agent.ts)

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
      "description": "The request URL. Can be provided in either 'inputs' or 'params'."
    },
    "method": {
      "type": "string",
      "description": "The HTTP method to use (GET, POST, PUT, etc.). Defaults to GET if not specified and no body is provided; otherwise POST."
    },
    "headers": {
      "type": "object",
      "description": "Optional HTTP headers to include in the request. Values from both inputs and params are merged."
    },
    "queryParams": {
      "type": "object",
      "description": "Optional query parameters to append to the URL."
    },
    "body": {
      "description": "Optional request body to send with POST, PUT, or PATCH methods.",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        }
      ]
    }
  },
  "required": [],
  "additionalProperties": false
}

```

#### output

```json

{
  "description": "Returns either the HTTP response body or a debug object. If an error occurs and 'supressError' is true, returns an object with an 'onError' key.",
  "anyOf": [
    {
      "type": "object",
      "properties": {
        "onError": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string"
            },
            "status": {
              "type": "integer"
            },
            "error": {}
          },
          "required": [
            "message",
            "status",
            "error"
          ]
        }
      },
      "required": [
        "onError"
      ],
      "additionalProperties": true
    },
    {
      "type": "object",
      "description": "Debug information returned when 'debug' is true.",
      "properties": {
        "method": {
          "type": "string"
        },
        "url": {
          "type": "string"
        },
        "headers": {
          "type": "object"
        },
        "body": {}
      },
      "required": [
        "method",
        "url",
        "headers"
      ]
    },
    {},
    {
      "type": "object",
      "description": "When 'flatResponse' is false, the response is wrapped as { data: ... }.",
      "properties": {
        "data": {}
      },
      "required": [
        "data"
      ],
      "additionalProperties": true
    }
  ]
}

```

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

```
```json

[
  ":agentId",
  ":agentId.method",
  ":agentId.url",
  ":agentId.headers",
  ":agentId.headers.Content-Type",
  ":agentId.body"
]

```
```json

[
  ":agentId",
  ":agentId.method",
  ":agentId.url",
  ":agentId.headers",
  ":agentId.headers.Content-Type",
  ":agentId.body"
]

```
```json

[
  ":agentId",
  ":agentId.method",
  ":agentId.url",
  ":agentId.headers",
  ":agentId.body"
]

```
```json

[
  ":agentId",
  ":agentId.method",
  ":agentId.url",
  ":agentId.headers",
  ":agentId.headers.Content-Type",
  ":agentId.body"
]

```
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

```

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

```

#### params

```json

{"debug":true}

```

#### result

```json

{
  "method": "GET",
  "url": "https://example.com/?foo=bar",
  "headers": {
    "x-myHeader": "secret"
  }
}

```
### Sample1

#### inputs

```json

{
  "url": "https://example.com",
  "body": {
    "foo": "bar"
  }
}

```

#### params

```json

{"debug":true}

```

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

```
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

```

#### params

```json

{"debug":true}

```

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

```
### Sample3

#### inputs

```json

{
  "url": "https://example.com",
  "method": "options"
}

```

#### params

```json

{"debug":true}

```

#### result

```json

{
  "method": "OPTIONS",
  "url": "https://example.com/",
  "headers": {}
}

```
### Sample4

#### inputs

```json

{}

```

#### params

```json

{"url":"https://example.com","body":{"foo":"bar"},"method":"PUT","debug":true}

```

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

```
### Sample5

#### inputs

```json

{
  "method": "DELETE",
  "headers": {
    "authentication": "bearer XXX"
  }
}

```

#### params

```json

{"url":"https://example.com","body":{"foo":"bar"},"method":"PUT","headers":{"Content-Type":"application/json"},"debug":true}

```

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

```

## Author

Receptron

## Repository

https://github.com/receptron/graphai

## License

MIT

