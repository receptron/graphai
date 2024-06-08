## groqAgent

### Description

Groq Agent

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
    "tools": {
      "type": "object"
    },
    "tool_choice": {
      "type": "any"
    },
    "max_tokens": {
      "type": "number"
    },
    "verbose": {
      "type": "boolean"
    },
    "temperature": {
      "type": "number"
    },
    "stream": {
      "type": "boolean"
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

