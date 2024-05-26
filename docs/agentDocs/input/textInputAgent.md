## textInputAgent

### Description

Text Input Agent

### Samples

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

### Schema

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

### Input Format

```json

[
  ":agentId"
]

````

### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

