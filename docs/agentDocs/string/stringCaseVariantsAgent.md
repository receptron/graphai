# stringCaseVariantsAgent

## Description

Format String Cases agent

## Schema

#### inputs

```json

{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": [
    "text"
  ]
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.kebabCase",
  ":agentId.lowerCamelCase",
  ":agentId.normalized",
  ":agentId.snakeCase"
]

````
```json

[
  ":agentId",
  ":agentId.kebabCase",
  ":agentId.lowerCamelCase",
  ":agentId.normalized",
  ":agentId.snakeCase"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "text": "this is a pen"
}

````

#### params

```json

{}

````

#### result

```json

{
  "kebabCase": "this-is-a-pen",
  "lowerCamelCase": "thisIsAPen",
  "normalized": "this is a pen",
  "snakeCase": "this_is_a_pen"
}

````
### Sample1

#### inputs

```json

{
  "text": "string case variants"
}

````

#### params

```json

{"suffix":"agent"}

````

#### result

```json

{
  "kebabCase": "string-case-variants-agent",
  "lowerCamelCase": "stringCaseVariantsAgent",
  "normalized": "string case variants agent",
  "snakeCase": "string_case_variants_agent"
}

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

