# nestedAgent

## Description

nested Agent

## Schema

#### inputs

```json

{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {
    "message": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": [
    "message"
  ]
}

````

## Input Format

```json

[
  ":agentId",
  ":agentId.test",
  ":agentId.test.$0"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "message": "hello"
}

````

#### params

```json

{}

````

#### result

```json

{
  "test": [
    "hello"
  ]
}

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

