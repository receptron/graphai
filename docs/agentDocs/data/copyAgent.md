# copyAgent

## Description

Returns namedInputs

## Schema

#### inputs

```json

{
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
  ]
}

````

#### output

```json

{
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
  ]
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.color",
  ":agentId.model"
]

````
```json

[
  ":agentId",
  ":agentId.array",
  ":agentId.array.$0",
  ":agentId.array.$1"
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

{
  "color": "red",
  "model": "Model 3"
}

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
### Sample1

#### inputs

```json

{
  "array": [
    "Hello World",
    "Discarded"
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
    "Hello World",
    "Discarded"
  ]
}

````
### Sample2

#### inputs

```json

{
  "color": "red",
  "model": "Model 3"
}

````

#### params

```json

{"namedKey":"color"}

````

#### result

```json

"red"

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

