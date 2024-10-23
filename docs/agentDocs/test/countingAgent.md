# countingAgent

## Description

Counting agent

## Schema

#### inputs

```json

{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {},
  "required": []
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.list",
  ":agentId.list.$0",
  ":agentId.list.$1",
  ":agentId.list.$2",
  ":agentId.list.$3"
]

````

## Samples

### Sample0

#### inputs

```json

{}

````

#### params

```json

{"count":4}

````

#### result

```json

{
  "list": [
    0,
    1,
    2,
    3
  ]
}

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

