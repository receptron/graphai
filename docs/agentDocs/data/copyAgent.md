# copyAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/copy_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/copy_agent.ts)

## Description

Returns namedInputs

## Schema

#### inputs

```json

{
  "type": "object",
  "description": "A dynamic object containing any number of named input fields. The agent either returns the whole object or a single value by key.",
  "additionalProperties": {
    "type": [
      "string",
      "number",
      "boolean",
      "object",
      "array",
      "null"
    ],
    "description": "A value associated with a named input key. Can be any JSON-compatible type."
  }
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
  ":agentId.color",
  ":agentId.model"
]

```
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$1"
]

```
```json

[
  ":agentId"
]

```

## Samples

### Sample0

#### inputs

```json

{
  "color": "red",
  "model": "Model 3"
}

```

#### params

```json

{}

```

#### result

```json

{
  "color": "red",
  "model": "Model 3"
}

```
### Sample1

#### inputs

```json

{
  "array": [
    "Hello World",
    "Discarded"
  ]
}

```

#### params

```json

{}

```

#### result

```json

{
  "array": [
    "Hello World",
    "Discarded"
  ]
}

```
### Sample2

#### inputs

```json

{
  "color": "red",
  "model": "Model 3"
}

```

#### params

```json

{"namedKey":"color"}

```

#### result

```json

"red"

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

