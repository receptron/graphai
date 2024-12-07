# fileReadAgent

## Description

Read data from file system and returns data

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "description": "file names"
    }
  },
  "required": [
    "array"
  ]
}

````

#### output

```json

{
  "type": "object"
}

````

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

````
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0"
]

````
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0"
]

````
```json

[
  ":agentId",
  ":agentId.data"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "array": [
    "test.txt"
  ]
}

````

#### params

```json

{"baseDir":"/home/runner/work/graphai/graphai/agents/vanilla_node_agents/lib/node_file_agents/../../tests/files/"}

````

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

````
### Sample1

#### inputs

```json

{
  "array": [
    "test.txt"
  ]
}

````

#### params

```json

{"baseDir":"/home/runner/work/graphai/graphai/agents/vanilla_node_agents/lib/node_file_agents/../../tests/files/","outputType":"base64"}

````

#### result

```json

{
  "array": [
    "aGVsbG8K"
  ]
}

````
### Sample2

#### inputs

```json

{
  "array": [
    "test.txt"
  ]
}

````

#### params

```json

{"baseDir":"/home/runner/work/graphai/graphai/agents/vanilla_node_agents/lib/node_file_agents/../../tests/files/","outputType":"text"}

````

#### result

```json

{
  "array": [
    "hello\n"
  ]
}

````
### Sample3

#### inputs

```json

{
  "file": "test.txt"
}

````

#### params

```json

{"baseDir":"/home/runner/work/graphai/graphai/agents/vanilla_node_agents/lib/node_file_agents/../../tests/files/","outputType":"text"}

````

#### result

```json

{
  "data": "hello\n"
}

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

