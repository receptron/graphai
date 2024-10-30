# echoAgent

## Description

Echo agent

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
  ":agentId.text"
]

````
```json

[
  ":agentId"
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

{"text":"this is test"}

````

#### result

```json

{
  "text": "this is test"
}

````
### Sample1

#### inputs

```json

{}

````

#### params

```json

{"text":"If you add filterParams option, it will respond to filterParams","filterParams":true}

````

#### result

```json

{}

````

## Author

Satoshi Nakajima

## Repository

https://github.com/receptron/graphai

## License

MIT

