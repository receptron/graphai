## streamMockAgent

### Description

Stream mock agent

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
  ":agentId",
  ":agentId.message"
]

````

### Samples

#### inputs

```json

[]

````

#### params

```json

{"message":"this is test"}

````

#### result

```json

{
  "message": "this is test"
}

````

### Author

Isamu Arimoto

### Repository

https://github.com/receptron/graphai


### License

MIT

