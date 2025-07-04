# geminiAgent

## Package
[@graphai/gemini_agent](https://www.npmjs.com/package/@graphai/gemini_agent)
## Source
[https://github.com/receptron/graphai/blob/main/llm_agents/gemini_agent/src/gemini_agent.ts](https://github.com/receptron/graphai/blob/main/llm_agents/gemini_agent/src/gemini_agent.ts)

## Description

Gemini Agent

This agent returns results in a format compatible with OpenAI's Chat Completion API.

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
    "response_format": {
      "type": "object"
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

```

#### output

```json

{
  "type": "object"
}

```

## Input example of the next node



## Samples



## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

