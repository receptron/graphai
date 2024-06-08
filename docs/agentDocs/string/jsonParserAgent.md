# jsonParserAgent

## Description

Template agent

## Schema

#### inputs

```json

{
  "type": "any"
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

## Samples

### Sample0

#### inputs

```json

[
  {
    "apple": "red",
    "lemon": "yellow"
  }
]

````

#### params

```json

{"stringify":true}

````

#### result

```json

"{\n  \"apple\": \"red\",\n  \"lemon\": \"yellow\"\n}"

````
### Sample1

#### inputs

```json

[
  "{\n  \"apple\": \"red\",\n  \"lemon\": \"yellow\"\n}"
]

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

