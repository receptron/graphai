# copyAgent

## Description

Returns inputs[0]

## Schema

#### inputs

```json

{
  "type": "array"
}

````

#### output

```json

{
  "type": "any"
}

````

## Input Format

```json

[
  ":agentId",
  ":agentId.color",
  ":agentId.model"
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

[
  {
    "color": "red",
    "model": "Model 3"
  }
]

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

[
  "Hello World",
  "Discarded"
]

````

#### params

```json

{}

````

#### result

```json

"Hello World"

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

