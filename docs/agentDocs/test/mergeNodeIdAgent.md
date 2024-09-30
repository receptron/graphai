# mergeNodeIdAgent

## Description

merge node id agent

## Schema

#### inputs

```json

{
  "type": "array",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "minItems": 1,
  "uniqueItems": true,
  "items": {
    "type": "object",
    "required": [
      "message"
    ],
    "properties": {
      "message": {
        "type": "string",
        "minLength": 1
      }
    }
  }
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.message",
  ":agentId.test"
]

````

## Samples

### Sample0

#### inputs

```json

[
  {
    "message": "hello"
  }
]

````

#### params

```json

{}

````

#### result

```json

{
  "message": "hello",
  "test": "hello"
}

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

