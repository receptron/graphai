# groqAgent

## Package
[@graphai/groq_agent](https://www.npmjs.com/package/@graphai/groq_agent)
## Source
[https://github.com/receptron/graphai/blob/main/agents/sleeper_agents/src/sleep_and_merge_agent.ts](https://github.com/receptron/graphai/blob/main/agents/sleeper_agents/src/sleep_and_merge_agent.ts)

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

## Input example of the next node



## Samples



## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

