## copyAgent

### Description

Returns inputs[0]

### Samples

#### inputs

```json

[
  {
    "color": "red",
    "model": "Model 3"
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
  "color": "red",
  "model": "Model 3"
}

````
#### inputs

```json

[
  "Hello World"
]

````

#### params

```json

{}

````

#### result

```json

"Hello World"

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
    "required": [
      "color",
      "model"
    ],
    "properties": {
      "color": {
        "type": "string",
        "minLength": 1
      },
      "model": {
        "type": "string",
        "minLength": 1
      }
    }
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
  ":agentId.color",
  ":agentId.model"
]

````
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

