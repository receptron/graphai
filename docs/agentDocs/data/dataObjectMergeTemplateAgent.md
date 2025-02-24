# dataObjectMergeTemplateAgent

## Description

Merge object

## Schema

#### inputs

```json

{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "uniqueItems": true,
      "minItems": 1,
      "items": {
        "required": [
          "content1"
        ],
        "properties": {
          "content1": {
            "type": "string",
            "minLength": 1
          }
        }
      }
    }
  },
  "required": [
    "array"
  ]
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.content1",
  ":agentId.content2"
]

````
```json

[
  ":agentId",
  ":agentId.content1"
]

````
```json

[
  ":agentId",
  ":agentId.content"
]

````
```json

[
  ":agentId",
  ":agentId.a",
  ":agentId.b",
  ":agentId.c"
]

````
```json

[
  ":agentId",
  ":agentId.a",
  ":agentId.a.b",
  ":agentId.a.b.c",
  ":agentId.a.b.c.d",
  ":agentId.b",
  ":agentId.b.c",
  ":agentId.b.c.d",
  ":agentId.b.c.d.e",
  ":agentId.b.d",
  ":agentId.b.d.e",
  ":agentId.b.d.e.f"
]

````
```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.content1",
  ":agentId.data.content2"
]

````
```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.content1"
]

````
```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.content"
]

````
```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.a",
  ":agentId.data.b",
  ":agentId.data.c"
]

````
```json

[
  ":agentId",
  ":agentId.data",
  ":agentId.data.a",
  ":agentId.data.a.b",
  ":agentId.data.a.b.c",
  ":agentId.data.a.b.c.d",
  ":agentId.data.b",
  ":agentId.data.b.c",
  ":agentId.data.b.c.d",
  ":agentId.data.b.c.d.e",
  ":agentId.data.b.d",
  ":agentId.data.b.d.e",
  ":agentId.data.b.d.e.f"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "array": [
    {
      "content1": "hello"
    },
    {
      "content2": "test"
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
  "content1": "hello",
  "content2": "test"
}

````
### Sample1

#### inputs

```json

{
  "array": [
    {
      "content1": "hello"
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
  "content1": "hello"
}

````
### Sample2

#### inputs

```json

{
  "array": [
    {
      "content": "hello1"
    },
    {
      "content": "hello2"
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
  "content": "hello2"
}

````
### Sample3

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
      "b": 0,
      "c": 5
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
  "a": 3,
  "b": 0,
  "c": 5
}

````
### Sample4

#### inputs

```json

{
  "array": [
    {
      "a": {
        "b": {
          "c": {
            "d": "e"
          }
        }
      }
    },
    {
      "b": {
        "c": {
          "d": {
            "e": "f"
          }
        }
      }
    },
    {
      "b": {
        "d": {
          "e": {
            "f": "g"
          }
        }
      }
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
  "a": {
    "b": {
      "c": {
        "d": "e"
      }
    }
  },
  "b": {
    "c": {
      "d": {
        "e": "f"
      }
    },
    "d": {
      "e": {
        "f": "g"
      }
    }
  }
}

````
### Sample5

#### inputs

```json

{
  "array": [
    {
      "content1": "hello"
    },
    {
      "content2": "test"
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
    "content1": "hello",
    "content2": "test"
  }
}

````
### Sample6

#### inputs

```json

{
  "array": [
    {
      "content1": "hello"
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
    "content1": "hello"
  }
}

````
### Sample7

#### inputs

```json

{
  "array": [
    {
      "content": "hello1"
    },
    {
      "content": "hello2"
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
    "content": "hello2"
  }
}

````
### Sample8

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
      "b": 0,
      "c": 5
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
    "a": 3,
    "b": 0,
    "c": 5
  }
}

````
### Sample9

#### inputs

```json

{
  "array": [
    {
      "a": {
        "b": {
          "c": {
            "d": "e"
          }
        }
      }
    },
    {
      "b": {
        "c": {
          "d": {
            "e": "f"
          }
        }
      }
    },
    {
      "b": {
        "d": {
          "e": {
            "f": "g"
          }
        }
      }
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
    "a": {
      "b": {
        "c": {
          "d": "e"
        }
      }
    },
    "b": {
      "c": {
        "d": {
          "e": "f"
        }
      },
      "d": {
        "e": {
          "f": "g"
        }
      }
    }
  }
}

````

## Author

Satoshi Nakajima

## Repository

https://github.com/receptron/graphai

## License

MIT

