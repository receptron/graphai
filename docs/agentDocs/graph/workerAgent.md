# workerAgent

## Description

Map Agent

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
  ":agentId",
  ":agentId.message",
  ":agentId.message.text"
]

````
```json

[
  ":agentId",
  ":agentId.message",
  ":agentId.message.text"
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

{}

````

#### result

```json

{
  "message": {
    "text": "May the force be with you"
  }
}

````
### Sample1

#### inputs

```json

[
  "May the force be with you"
]

````

#### params

```json

{}

````

#### result

```json

{
  "message": {
    "text": "May the force be with you"
  }
}

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

