# sleeperAgentDebug




## Description

sleeper debug Agent

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {},
  "required": []
}

```

## Input example of the next node

```json

[
  ":agentId"
]

```
```json

[
  ":agentId",
  ":agentId.a",
  ":agentId.b"
]

```

## Samples

### Sample0

#### inputs

```json

{}

```

#### params

```json

{"duration":1}

```

#### result

```json

{}

```
### Sample1

#### inputs

```json

{
  "array": [
    {
      "a": 1
    },
    {
      "b": 2
    }
  ]
}

```

#### params

```json

{"duration":1}

```

#### result

```json

{
  "a": 1,
  "b": 2
}

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

