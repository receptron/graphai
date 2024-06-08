## anthropicAgent

### Description

Anthropic Agent

### Samples



### Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "model": {
      "type": "string"
    },
    "system": {
      "type": "string"
    },
    "max_tokens": {
      "type": "number"
    },
    "temperature": {
      "type": "number"
    },
    "prompt": {
      "type": "string",
      "description": "query string"
    },
    "messages": {
      "type": "any",
      "description": "chat messages"
    }
  }
}

````

#### output

```json

{
  "type": "object"
}

````

### Input Format



### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

