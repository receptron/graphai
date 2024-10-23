# copy2ArrayAgent

## Description

Copy2Array agent

## Schema

#### inputs

```json

{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {
    "item": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string",
          "minLength": 1
        }
      },
      "required": [
        "message"
      ]
    }
  },
  "required": [
    "item"
  ]
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.message",
  ":agentId.$1",
  ":agentId.$1.message",
  ":agentId.$2",
  ":agentId.$2.message",
  ":agentId.$3",
  ":agentId.$3.message",
  ":agentId.$4",
  ":agentId.$4.message",
  ":agentId.$5",
  ":agentId.$5.message",
  ":agentId.$6",
  ":agentId.$6.message",
  ":agentId.$7",
  ":agentId.$7.message",
  ":agentId.$8",
  ":agentId.$8.message",
  ":agentId.$9",
  ":agentId.$9.message"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.message",
  ":agentId.$1",
  ":agentId.$1.message",
  ":agentId.$2",
  ":agentId.$2.message",
  ":agentId.$3",
  ":agentId.$3.message",
  ":agentId.$4",
  ":agentId.$4.message",
  ":agentId.$5",
  ":agentId.$5.message",
  ":agentId.$6",
  ":agentId.$6.message",
  ":agentId.$7",
  ":agentId.$7.message",
  ":agentId.$8",
  ":agentId.$8.message",
  ":agentId.$9",
  ":agentId.$9.message"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$1",
  ":agentId.$2",
  ":agentId.$3",
  ":agentId.$4",
  ":agentId.$5",
  ":agentId.$6",
  ":agentId.$7",
  ":agentId.$8",
  ":agentId.$9"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "item": {
    "message": "hello"
  }
}

````

#### params

```json

{"count":10}

````

#### result

```json

[
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  }
]

````
### Sample1

#### inputs

```json

{
  "message": "hello"
}

````

#### params

```json

{"count":10}

````

#### result

```json

[
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  },
  {
    "message": "hello"
  }
]

````
### Sample2

#### inputs

```json

{
  "item": "hello"
}

````

#### params

```json

{"count":10}

````

#### result

```json

[
  "hello",
  "hello",
  "hello",
  "hello",
  "hello",
  "hello",
  "hello",
  "hello",
  "hello",
  "hello"
]

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

