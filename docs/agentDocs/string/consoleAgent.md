# consoleAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/console_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/console_agent.ts)

## Description

Just text to console.info

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "description": "text"
    }
  }
}

```

#### output

```json

{
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "description": "text"
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

## Samples

### Sample0

#### inputs

```json

{
  "text": "hello"
}

```

#### params

```json

{}

```

#### result

```json

{
  "text": "hello"
}

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

