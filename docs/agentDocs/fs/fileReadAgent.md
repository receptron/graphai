# fileReadAgent

## Package
[@graphai/vanilla_node_agents](https://www.npmjs.com/package/@graphai/vanilla_node_agents)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_node_agents/src/node_file_agents/file_read_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_node_agents/src/node_file_agents/file_read_agent.ts)

## Description

Read data from file system and returns data

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "file": {
      "type": "string",
      "description": "Name of a single file to read"
    },
    "array": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of multiple file names to read"
    }
  },
  "oneOf": [
    {
      "required": [
        "file"
      ]
    },
    {
      "required": [
        "array"
      ]
    }
  ]
}

```

#### output

```json

{
  "oneOf": [
    {
      "type": "object",
      "required": [
        "data"
      ],
      "properties": {
        "data": {
          "oneOf": [
            {
              "type": "string",
              "description": "Text or base64 depending on outputType"
            },
            {
              "type": "object",
              "description": "Readable stream (not serializable in JSON)"
            },
            {
              "type": "array",
              "items": {
                "type": "number"
              },
              "description": "Buffer (as byte array)"
            }
          ]
        }
      },
      "additionalProperties": false
    },
    {
      "type": "object",
      "required": [
        "array"
      ],
      "properties": {
        "array": {
          "type": "array",
          "items": {
            "oneOf": [
              {
                "type": "string",
                "description": "Text or base64 string"
              },
              {
                "type": "object",
                "description": "Readable stream (not serializable in JSON)"
              },
              {
                "type": "array",
                "items": {
                  "type": "number"
                },
                "description": "Buffer (as byte array)"
              }
            ]
          }
        }
      },
      "additionalProperties": false
    }
  ]
}

```

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$0.0",
  ":agentId.array.$0.1",
  ":agentId.array.$0.2",
  ":agentId.array.$0.3",
  ":agentId.array.$0.4",
  ":agentId.array.$0.5"
]

```
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0"
]

```
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0"
]

```
```json

[
  ":agentId",
  ":agentId.data"
]

```

## Samples

### Sample0

#### inputs

```json

{
  "array": [
    "test.txt"
  ]
}

```

#### params

```json

{"baseDir":"/home/runner/work/graphai/graphai/agents/vanilla_node_agents/lib/node_file_agents/../../tests/files/"}

```

#### result

```json

{
  "array": [
    {
      "type": "Buffer",
      "data": [
        104,
        101,
        108,
        108,
        111,
        10
      ]
    }
  ]
}

```
### Sample1

#### inputs

```json

{
  "array": [
    "test.txt"
  ]
}

```

#### params

```json

{"baseDir":"/home/runner/work/graphai/graphai/agents/vanilla_node_agents/lib/node_file_agents/../../tests/files/","outputType":"base64"}

```

#### result

```json

{
  "array": [
    "aGVsbG8K"
  ]
}

```
### Sample2

#### inputs

```json

{
  "array": [
    "test.txt"
  ]
}

```

#### params

```json

{"baseDir":"/home/runner/work/graphai/graphai/agents/vanilla_node_agents/lib/node_file_agents/../../tests/files/","outputType":"text"}

```

#### result

```json

{
  "array": [
    "hello\n"
  ]
}

```
### Sample3

#### inputs

```json

{
  "file": "test.txt"
}

```

#### params

```json

{"baseDir":"/home/runner/work/graphai/graphai/agents/vanilla_node_agents/lib/node_file_agents/../../tests/files/","outputType":"text"}

```

#### result

```json

{
  "data": "hello\n"
}

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

