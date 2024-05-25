## echoAgent

### Description

Echo agent

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
#### inputs

```json

[]

````

#### params

```json

{"message":"If you add filterParams option, it will respond to filterParams","filterParams":true}

````

#### result

```json

{}

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
  ":agentId"
]

````

### Author

Satoshi Nakajima

### Repository

https://github.com/receptron/graphai


### License

MIT

