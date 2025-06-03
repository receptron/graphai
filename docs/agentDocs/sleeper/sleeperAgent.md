# sleeperAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/sleeper_agents/sleeper_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/sleeper_agents/sleeper_agent.ts)

## Description

sleeper Agent for test and debug

## Schema

#### inputs

```json

{
  "type": "object",
  "description": "Arbitrary input data. This agent does not modify it and returns it unchanged after a delay.",
  "additionalProperties": true
}

```

#### output

```json

{
  "type": "object",
  "description": "Returns the same object passed as 'inputs', unchanged.",
  "additionalProperties": true
}

```

## Input example of the next node

```json

[
  ":agentId"
]

```
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$0.a",
  ":agentId.array.$1",
  ":agentId.array.$1.b"
]

```

## Samples

### Sample0

#### inputs

```json

{}

```

#### params

```json

{"duration":1}

```

#### result

```json

{}

```
### Sample1

#### inputs

```json

{
  "array": [
    {
      "a": 1
    },
    {
      "b": 2
    }
  ]
}

```

#### params

```json

{"duration":1}

```

#### result

```json

{
  "array": [
    {
      "a": 1
    },
    {
      "b": 2
    }
  ]
}

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

