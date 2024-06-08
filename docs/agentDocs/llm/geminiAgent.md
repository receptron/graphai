## geminiAgent

### Description

Gemini Agent

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
    "tools": {
      "type": "object"
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



### Samples



### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

