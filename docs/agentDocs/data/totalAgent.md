## totalAgent

### Description

Returns the sum of input values

### Samples

#### inputs

```json

[
  {
    "a": 1
  },
  {
    "a": 2
  },
  {
    "a": 3
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
  "a": 6
}

````
#### inputs

```json

[
  [
    {
      "a": 1,
      "b": -1
    },
    {
      "c": 10
    }
  ],
  [
    {
      "a": 2,
      "b": -1
    }
  ],
  [
    {
      "a": 3,
      "b": -2
    },
    {
      "d": -10
    }
  ]
]

````

#### params

```json

{}

````

#### result

```json

{
  "a": 6,
  "b": -4,
  "c": 10,
  "d": -10
}

````
#### inputs

```json

[
  {
    "a": 1
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
  "a": 1
}

````
#### inputs

```json

[
  {
    "a": 1
  },
  {
    "a": 2
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
  "a": 3
}

````
#### inputs

```json

[
  {
    "a": 1
  },
  {
    "a": 2
  },
  {
    "a": 3
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
  "a": 6
}

````
#### inputs

```json

[
  {
    "a": 1,
    "b": 1
  },
  {
    "a": 2,
    "b": 2
  },
  {
    "a": 3,
    "b": 0
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
  "a": 6,
  "b": 3
}

````
#### inputs

```json

[
  {
    "a": 1
  },
  {
    "a": 2,
    "b": 2
  },
  {
    "a": 3,
    "b": 0
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
  "a": 6,
  "b": 2
}

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
  ":agentId.a"
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
```json

[
  ":agentId",
  ":agentId.a"
]

````
```json

[
  ":agentId",
  ":agentId.a"
]

````
```json

[
  ":agentId",
  ":agentId.a"
]

````
```json

[
  ":agentId",
  ":agentId.a",
  ":agentId.b"
]

````
```json

[
  ":agentId",
  ":agentId.a",
  ":agentId.b"
]

````

### Author

Satoshi Nakajima

### Repository

https://github.com/snakajima/graphai


### License

MIT

