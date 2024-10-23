# bypassAgent

## Description

bypass agent

## Schema

#### inputs

```json

{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {
    "a": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": [
    "a"
  ]
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.a"
]

````
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$0.$0",
  ":agentId.array.$0.$0.a",
  ":agentId.array.$0.$1",
  ":agentId.array.$0.$1.b",
  ":agentId.array.$1",
  ":agentId.array.$1.$0",
  ":agentId.array.$1.$0.c",
  ":agentId.array.$1.$1",
  ":agentId.array.$1.$1.d"
]

````
```json

[
  ":agentId",
  ":agentId.a",
  ":agentId.b",
  ":agentId.c",
  ":agentId.d"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "a": "123"
}

````

#### params

```json

{}

````

#### result

```json

{
  "a": "123"
}

````
### Sample1

#### inputs

```json

{
  "array": [
    [
      {
        "a": "123"
      },
      {
        "b": "abc"
      }
    ],
    [
      {
        "c": "987"
      },
      {
        "d": "xyz"
      }
    ]
  ]
}

````

#### params

```json

{}

````

#### result

```json

{
  "array": [
    [
      {
        "a": "123"
      },
      {
        "b": "abc"
      }
    ],
    [
      {
        "c": "987"
      },
      {
        "d": "xyz"
      }
    ]
  ]
}

````
### Sample2

#### inputs

```json

{
  "a": "123",
  "b": "abc",
  "c": "987",
  "d": "xyz"
}

````

#### params

```json

{}

````

#### result

```json

{
  "a": "123",
  "b": "abc",
  "c": "987",
  "d": "xyz"
}

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

