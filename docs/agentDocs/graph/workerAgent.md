## workerAgent

### Description

Map Agent

### Samples

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
  "message": "May the force be with you"
}

````
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
  "message": "May the force be with you"
}

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
```json

[
  ":agentId",
  ":agentId.message"
]

````

### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

