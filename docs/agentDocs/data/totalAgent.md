# totalAgent

## Description

Returns the sum of input values

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

## Samples

### Sample0

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
### Sample1

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
### Sample2

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
### Sample3

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
### Sample4

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
### Sample5

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
### Sample6

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

## Author

Satoshi Nakajima

## Repository

https://github.com/snakajima/graphai

## License

MIT

