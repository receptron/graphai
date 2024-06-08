# dataObjectMergeTemplateAgent

## Description

Merge object

## Schema

#### inputs

```json

{
  "type": "array",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "minItems": 1,
  "uniqueItems": true,
  "items": {
    "type": "object",
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

````

## Input Format

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

## Samples

### Sample0

#### inputs

```json

[
  {
    "content1": "hello"
  },
  {
    "content2": "test"
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
  "content1": "hello",
  "content2": "test"
}

````
### Sample1

#### inputs

```json

[
  {
    "content1": "hello"
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
  "content1": "hello"
}

````
### Sample2

#### inputs

```json

[
  {
    "content": "hello1"
  },
  {
    "content": "hello2"
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
  "content": "hello2"
}

````
### Sample3

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
    "b": 0,
    "c": 5
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
  "a": 3,
  "b": 0,
  "c": 5
}

````
### Sample4

#### inputs

```json

[
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

````

#### params

```json

{}

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

## Author

Satoshi Nakajima

## Repository

https://github.com/receptron/graphai

## License

MIT

