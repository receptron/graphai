# mergeNodeIdAgent

## Description

merge node id agent

## Schema

#### inputs

```json

{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "uniqueItems": true,
      "minItems": 1,
      "items": {
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
  },
  "required": [
    "array"
  ]
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

{
  "array": [
    {
      "message": "hello"
    }
  ]
}

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

