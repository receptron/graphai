# lookupDictionaryAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/lookup_dictionary_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/lookup_dictionary_agent.ts)

## Description

Select elements with params

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "namedKey": {
      "type": "string",
      "description": "The key to look up in the dictionary provided by 'params'."
    },
    "supressError": {
      "type": "boolean",
      "description": "If true, prevents the agent from throwing an error when the key is missing in 'params'. Optional."
    }
  },
  "required": [
    "namedKey"
  ],
  "additionalProperties": false
}

```

#### output

```json

{
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
}

```

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.model",
  ":agentId.temperature"
]

```
```json

[
  ":agentId",
  ":agentId.model",
  ":agentId.temperature"
]

```

## Samples

### Sample0

#### inputs

```json

{
  "namedKey": "openai"
}

```

#### params

```json

{"openai":{"model":"gpt4-o","temperature":0.7},"groq":{"model":"llama3-8b-8192","temperature":0.6},"gemini":{"model":"gemini-2.0-pro-exp-02-05","temperature":0.7}}

```

#### result

```json

{
  "model": "gpt4-o",
  "temperature": 0.7
}

```
### Sample1

#### inputs

```json

{
  "namedKey": "gemini"
}

```

#### params

```json

{"openai":{"model":"gpt4-o","temperature":0.7},"groq":{"model":"llama3-8b-8192","temperature":0.6},"gemini":{"model":"gemini-2.0-pro-exp-02-05","temperature":0.7}}

```

#### result

```json

{
  "model": "gemini-2.0-pro-exp-02-05",
  "temperature": 0.7
}

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

