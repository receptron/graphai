# jsonParserAgent

## Description

Template agent

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
  "type": "string"
}

````

## Input example of the next node

```json

[
  ":agentId"
]

````
```json

[
  ":agentId",
  ":agentId.apple",
  ":agentId.lemon"
]

````
```json

[
  ":agentId",
  ":agentId.apple",
  ":agentId.lemon"
]

````
```json

[
  ":agentId",
  ":agentId.apple",
  ":agentId.lemon"
]

````
```json

[
  ":agentId",
  ":agentId.apple",
  ":agentId.lemon"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "data": {
    "apple": "red",
    "lemon": "yellow"
  }
}

````

#### params

```json

{}

````

#### result

```json

"{\n  \"apple\": \"red\",\n  \"lemon\": \"yellow\"\n}"

````
### Sample1

#### inputs

```json

{
  "text": "{\n  \"apple\": \"red\",\n  \"lemon\": \"yellow\"\n}"
}

````

#### params

```json

{}

````

#### result

```json

{
  "apple": "red",
  "lemon": "yellow"
}

````
### Sample2

#### inputs

```json

{
  "text": "```\n{\"apple\":\"red\",\"lemon\":\"yellow\"}\n```"
}

````

#### params

```json

{}

````

#### result

```json

{
  "apple": "red",
  "lemon": "yellow"
}

````
### Sample3

#### inputs

```json

{
  "text": "```json\n{\"apple\":\"red\",\"lemon\":\"yellow\"}\n```"
}

````

#### params

```json

{}

````

#### result

```json

{
  "apple": "red",
  "lemon": "yellow"
}

````
### Sample4

#### inputs

```json

{
  "text": "```JSON\n{\"apple\":\"red\",\"lemon\":\"yellow\"}\n```"
}

````

#### params

```json

{}

````

#### result

```json

{
  "apple": "red",
  "lemon": "yellow"
}

````

## Author

Satoshi Nakajima

## Repository

https://github.com/receptron/graphai

## License

MIT

