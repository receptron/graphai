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

#### output

```json

{
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "description": "json string"
    },
    "data": {
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
  }
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

