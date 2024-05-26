## stringTemplateAgent

### Description

Template agent

### Samples

#### inputs

```json

[
  "hello",
  "test"
]

````

#### params

```json

{"template":"${0}: ${1}"}

````

#### result

```json

"hello: test"

````
#### inputs

```json

[
  "hello",
  "test"
]

````

#### params

```json

{"template":["${0}: ${1}","${1}: ${0}"]}

````

#### result

```json

[
  "hello: test",
  "test: hello"
]

````
#### inputs

```json

[
  "hello",
  "test"
]

````

#### params

```json

{"template":{"apple":"${0}","lemon":"${1}"}}

````

#### result

```json

{
  "apple": "hello",
  "lemon": "test"
}

````
#### inputs

```json

[
  "hello",
  "test"
]

````

#### params

```json

{"template":[{"apple":"${0}","lemon":"${1}"}]}

````

#### result

```json

[
  {
    "apple": "hello",
    "lemon": "test"
  }
]

````
#### inputs

```json

[
  "hello",
  "test"
]

````

#### params

```json

{"template":{"apple":"${0}","lemon":["${1}"]}}

````

#### result

```json

{
  "apple": "hello",
  "lemon": [
    "test"
  ]
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
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$1"
]

````
```json

[
  ":agentId",
  ":agentId.apple",
  ":agentId.lemon"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.apple",
  ":agentId.$0.lemon"
]

````
```json

[
  ":agentId",
  ":agentId.apple",
  ":agentId.lemon",
  ":agentId.lemon.$0"
]

````

### Author

Satoshi Nakajima

### Repository

https://github.com/receptron/graphai


### License

MIT

