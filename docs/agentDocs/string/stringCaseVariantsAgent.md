# stringCaseVariantsAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/string_case_variants_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/string_case_variants_agent.ts)

## Description

Format String Cases agent

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "description": "The input string to be transformed into various casing styles."
    }
  },
  "required": [
    "text"
  ],
  "additionalProperties": false
}

```

#### output

```json

{
  "type": "object",
  "properties": {
    "kebabCase": {
      "type": "string",
      "description": "The input string converted to kebab-case (e.g., 'this-is-a-pen')."
    },
    "snakeCase": {
      "type": "string",
      "description": "The input string converted to snake_case (e.g., 'this_is_a_pen')."
    },
    "lowerCamelCase": {
      "type": "string",
      "description": "The input string converted to lowerCamelCase (e.g., 'thisIsAPen')."
    },
    "normalized": {
      "type": "string",
      "description": "The original string, optionally appended with the suffix, in lowercase with normalized spacing."
    }
  },
  "required": [
    "kebabCase",
    "snakeCase",
    "lowerCamelCase",
    "normalized"
  ],
  "additionalProperties": false
}

```

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.kebabCase",
  ":agentId.lowerCamelCase",
  ":agentId.normalized",
  ":agentId.snakeCase"
]

```
```json

[
  ":agentId",
  ":agentId.kebabCase",
  ":agentId.lowerCamelCase",
  ":agentId.normalized",
  ":agentId.snakeCase"
]

```

## Samples

### Sample0

#### inputs

```json

{
  "text": "this is a pen"
}

```

#### params

```json

{}

```

#### result

```json

{
  "kebabCase": "this-is-a-pen",
  "lowerCamelCase": "thisIsAPen",
  "normalized": "this is a pen",
  "snakeCase": "this_is_a_pen"
}

```
### Sample1

#### inputs

```json

{
  "text": "string case variants"
}

```

#### params

```json

{"suffix":"agent"}

```

#### result

```json

{
  "kebabCase": "string-case-variants-agent",
  "lowerCamelCase": "stringCaseVariantsAgent",
  "normalized": "string case variants agent",
  "snakeCase": "string_case_variants_agent"
}

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

