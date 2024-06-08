## copyAgent

### Description

Returns inputs[0]

### Samples

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

### Schema

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

### Input Format

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

### Author

Receptron team

### Repository

https://github.com/receptron/graphai


### License

MIT

