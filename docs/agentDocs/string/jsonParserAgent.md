# jsonParserAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/json_parser_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/json_parser_agent.ts)

## Description

Template agent

## Schema

#### inputs

```json

{
  "type": "object",
  "description": "The input object containing either a JSON string in 'text' or a raw JavaScript object in 'data'. One of them is required.",
  "properties": {
    "text": {
      "type": "string",
      "description": "A JSON string, possibly embedded in a Markdown code block. If provided, it will be parsed into a data object."
    },
    "data": {
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "array"
        },
        {
          "type": "string"
        },
        {
          "type": "number"
        }
      ],
      "description": "Raw data to be converted into a formatted JSON string in the 'text' output."
    }
  },
  "required": [],
  "additionalProperties": false
}

```

#### output

```json

{
  "type": "object",
  "description": "Returns either a parsed data object (from 'text') or a formatted JSON string (from 'data').",
  "properties": {
    "text": {
      "type": "string",
      "description": "A pretty-printed JSON string generated from the 'data' input, if provided."
    },
    "data": {
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "array"
        },
        {
          "type": "string"
        },
        {
          "type": "number"
        }
      ],
      "description": "Parsed data object from the 'text' input, or the original 'data' if no parsing was required."
    }
  },
  "required": [],
  "additionalProperties": false
}

```

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.text"
]

```
```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.apple",
  ":agentId.data.lemon"
]

```
```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.apple",
  ":agentId.data.lemon"
]

```
```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.apple",
  ":agentId.data.lemon"
]

```
```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.apple",
  ":agentId.data.lemon"
]

```

## Samples

### Sample0

#### inputs

```json

{
  "data": {
    "apple": "red",
    "lemon": "yellow"
  }
}

```

#### params

```json

{}

```

#### result

```json

{
  "text": "{\n  \"apple\": \"red\",\n  \"lemon\": \"yellow\"\n}"
}

```
### Sample1

#### inputs

```json

{
  "text": "{\n  \"apple\": \"red\",\n  \"lemon\": \"yellow\"\n}"
}

```

#### params

```json

{}

```

#### result

```json

{
  "data": {
    "apple": "red",
    "lemon": "yellow"
  }
}

```
### Sample2

#### inputs

```json

{
  "text": "```\n{\"apple\":\"red\",\"lemon\":\"yellow\"}\n```"
}

```

#### params

```json

{}

```

#### result

```json

{
  "data": {
    "apple": "red",
    "lemon": "yellow"
  }
}

```
### Sample3

#### inputs

```json

{
  "text": "```json\n{\"apple\":\"red\",\"lemon\":\"yellow\"}\n```"
}

```

#### params

```json

{}

```

#### result

```json

{
  "data": {
    "apple": "red",
    "lemon": "yellow"
  }
}

```
### Sample4

#### inputs

```json

{
  "text": "```JSON\n{\"apple\":\"red\",\"lemon\":\"yellow\"}\n```"
}

```

#### params

```json

{}

```

#### result

```json

{
  "data": {
    "apple": "red",
    "lemon": "yellow"
  }
}

```

## Author

Satoshi Nakajima

## Repository

https://github.com/receptron/graphai

## License

MIT

