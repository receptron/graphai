# pushAgent

## Description

push Agent

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "description": "the array to push an item to"
    },
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
      "description": "the item push into the array"
    }
  },
  "required": [
    "array",
    "item"
  ]
}

````

#### output

```json

{
  "type": "array"
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$1",
  ":agentId.$2"
]

````
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$0.apple",
  ":agentId.$1",
  ":agentId.$1.lemon"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "array": [
    1,
    2
  ],
  "item": 3
}

````

#### params

```json

{}

````

#### result

```json

[
  1,
  2,
  3
]

````
### Sample1

#### inputs

```json

{
  "array": [
    {
      "apple": 1
    }
  ],
  "item": {
    "lemon": 2
  }
}

````

#### params

```json

{}

````

#### result

```json

[
  {
    "apple": 1
  },
  {
    "lemon": 2
  }
]

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

