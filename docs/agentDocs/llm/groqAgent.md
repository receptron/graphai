# groqAgent

## Description

Groq Agent

## Schema

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
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "integer"
        },
        {
          "type": "object"
        },
        {
          "type": "array"
        }
      ]
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
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "integer"
        },
        {
          "type": "object"
        },
        {
          "type": "array"
        }
      ],
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

## Input Format



## Samples



## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

