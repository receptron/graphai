# totalAgent

## Description

Returns the sum of input values

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "description": "the array"
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
  "type": "object"
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.a"
]

````
```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.a",
  ":agentId.data.b",
  ":agentId.data.c",
  ":agentId.data.d"
]

````
```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.a"
]

````
```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.a"
]

````
```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.a"
]

````
```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.a",
  ":agentId.data.b"
]

````
```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.a",
  ":agentId.data.b"
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

{
  "array": [
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
}

````

#### params

```json

{}

````

#### result

```json

{
  "data": {
    "a": 6
  }
}

````
### Sample1

#### inputs

```json

{
  "array": [
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
}

````

#### params

```json

{}

````

#### result

```json

{
  "data": {
    "a": 6,
    "b": -4,
    "c": 10,
    "d": -10
  }
}

````
### Sample2

#### inputs

```json

{
  "array": [
    {
      "a": 1
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
  "data": {
    "a": 1
  }
}

````
### Sample3

#### inputs

```json

{
  "array": [
    {
      "a": 1
    },
    {
      "a": 2
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
  "data": {
    "a": 3
  }
}

````
### Sample4

#### inputs

```json

{
  "array": [
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
}

````

#### params

```json

{}

````

#### result

```json

{
  "data": {
    "a": 6
  }
}

````
### Sample5

#### inputs

```json

{
  "array": [
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
}

````

#### params

```json

{}

````

#### result

```json

{
  "data": {
    "a": 6,
    "b": 3
  }
}

````
### Sample6

#### inputs

```json

{
  "array": [
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
}

````

#### params

```json

{}

````

#### result

```json

{
  "data": {
    "a": 6,
    "b": 2
  }
}

````
### Sample7

#### inputs

```json

{
  "array": [
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
}

````

#### params

```json

{"flatResponse":true}

````

#### result

```json

{
  "a": 6
}

````
### Sample8

#### inputs

```json

{
  "array": [
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
}

````

#### params

```json

{"flatResponse":true}

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
### Sample9

#### inputs

```json

{
  "array": [
    {
      "a": 1
    }
  ]
}

````

#### params

```json

{"flatResponse":true}

````

#### result

```json

{
  "a": 1
}

````
### Sample10

#### inputs

```json

{
  "array": [
    {
      "a": 1
    },
    {
      "a": 2
    }
  ]
}

````

#### params

```json

{"flatResponse":true}

````

#### result

```json

{
  "a": 3
}

````
### Sample11

#### inputs

```json

{
  "array": [
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
}

````

#### params

```json

{"flatResponse":true}

````

#### result

```json

{
  "a": 6
}

````
### Sample12

#### inputs

```json

{
  "array": [
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
}

````

#### params

```json

{"flatResponse":true}

````

#### result

```json

{
  "a": 6,
  "b": 3
}

````
### Sample13

#### inputs

```json

{
  "array": [
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
}

````

#### params

```json

{"flatResponse":true}

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

