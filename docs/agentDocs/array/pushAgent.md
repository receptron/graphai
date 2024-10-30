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
    },
    "items": {
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
    "array"
  ]
}

````

#### output

```json

{
  "type": "object",
  "properties": {
    "array": {
      "type": "array"
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
  ":agentId.array.$2"
]

````
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$0.apple",
  ":agentId.array.$1",
  ":agentId.array.$1.lemon"
]

````
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$0.apple",
  ":agentId.array.$1",
  ":agentId.array.$1.lemon",
  ":agentId.array.$2",
  ":agentId.array.$2.banana"
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

{
  "array": [
    1,
    2,
    3
  ]
}

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

{
  "array": [
    {
      "apple": 1
    },
    {
      "lemon": 2
    }
  ]
}

````
### Sample2

#### inputs

```json

{
  "array": [
    {
      "apple": 1
    }
  ],
  "items": [
    {
      "lemon": 2
    },
    {
      "banana": 3
    }
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
    {
      "apple": 1
    },
    {
      "lemon": 2
    },
    {
      "banana": 3
    }
  ]
}

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

