# textInputAgent

## Description

Text Input Agent

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
    "required": [],
    "properties": {}
  }
}

````

## Input example of the next node

```json

[
  ":agentId"
]

````

## Samples

### Sample0

#### inputs

```json

[]

````

#### params

```json

{"message":"Enter your message to AI."}

````

#### result

```json

"message from the user"

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

