# streamMockAgent

## Description

Stream mock agent

## Schema

#### inputs

```json

{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {},
  "required": []
}

````

## Input example of the next node

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

## Samples

### Sample0

#### inputs

```json

{}

````

#### params

```json

{"message":"this is params test"}

````

#### result

```json

{
  "message": "this is params test"
}

````
### Sample1

#### inputs

```json

{
  "message": "this is named inputs test"
}

````

#### params

```json

{}

````

#### result

```json

{
  "message": "this is named inputs test"
}

````

## Author

Isamu Arimoto

## Repository

https://github.com/receptron/graphai

## License

MIT

