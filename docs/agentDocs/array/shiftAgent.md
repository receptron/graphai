# shiftAgent

## Description

shift Agent

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "description": "the array to shift an item from"
    }
  },
  "required": [
    "array"
  ]
}

````

#### output

```json

{
  "type": "object",
  "properties": {
    "item": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "integer"
        },
        {
          "type": "object"
        },
        {
          "type": "array"
        }
      ],
      "description": "the item shifted from the array"
    },
    "array": {
      "type": "array",
      "description": "the remaining array"
    }
  }
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$1",
  ":agentId.item"
]

````
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$1",
  ":agentId.item"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "array": [
    1,
    2,
    3
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
    2,
    3
  ],
  "item": 1
}

````
### Sample1

#### inputs

```json

{
  "array": [
    "a",
    "b",
    "c"
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
    "b",
    "c"
  ],
  "item": "a"
}

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

