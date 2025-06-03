# copy2ArrayAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/copy2array_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/copy2array_agent.ts)

## Description

Copy2Array agent

## Schema

#### inputs

```json

{
  "type": "object",
  "description": "The input item to be duplicated. Can be provided as 'item' or as a free-form object.",
  "properties": {
    "item": {
      "description": "The item to be copied into each element of the resulting array.",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "string"
        },
        {
          "type": "number"
        },
        {
          "type": "array"
        },
        {
          "type": "boolean"
        }
      ]
    }
  },
  "additionalProperties": true
}

```

#### output

```json

{
  "type": "array",
  "description": "An array of 'count' copies of the input item.",
  "items": {
    "description": "A duplicated copy of the input item.",
    "anyOf": [
      {
        "type": "object"
      },
      {
        "type": "string"
      },
      {
        "type": "number"
      },
      {
        "type": "array"
      },
      {
        "type": "boolean"
      }
    ]
  }
}

```

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.message",
  ":agentId.$1",
  ":agentId.$1.message",
  ":agentId.$2",
  ":agentId.$2.message",
  ":agentId.$3",
  ":agentId.$3.message",
  ":agentId.$4",
  ":agentId.$4.message",
  ":agentId.$5",
  ":agentId.$5.message",
  ":agentId.$6",
  ":agentId.$6.message",
  ":agentId.$7",
  ":agentId.$7.message",
  ":agentId.$8",
  ":agentId.$8.message",
  ":agentId.$9",
  ":agentId.$9.message"
]

```
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.message",
  ":agentId.$1",
  ":agentId.$1.message",
  ":agentId.$2",
  ":agentId.$2.message",
  ":agentId.$3",
  ":agentId.$3.message",
  ":agentId.$4",
  ":agentId.$4.message",
  ":agentId.$5",
  ":agentId.$5.message",
  ":agentId.$6",
  ":agentId.$6.message",
  ":agentId.$7",
  ":agentId.$7.message",
  ":agentId.$8",
  ":agentId.$8.message",
  ":agentId.$9",
  ":agentId.$9.message"
]

```
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$1",
  ":agentId.$2",
  ":agentId.$3",
  ":agentId.$4",
  ":agentId.$5",
  ":agentId.$6",
  ":agentId.$7",
  ":agentId.$8",
  ":agentId.$9"
]

```

## Samples

### Sample0

#### inputs

```json

{
  "item": {
    "message": "hello"
  }
}

```

#### params

```json

{"count":10}

```

#### result

```json

[
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  }
]

```
### Sample1

#### inputs

```json

{
  "message": "hello"
}

```

#### params

```json

{"count":10}

```

#### result

```json

[
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  }
]

```
### Sample2

#### inputs

```json

{
  "item": "hello"
}

```

#### params

```json

{"count":10}

```

#### result

```json

[
  "hello",
  "hello",
  "hello",
  "hello",
  "hello",
  "hello",
  "hello",
  "hello",
  "hello",
  "hello"
]

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

