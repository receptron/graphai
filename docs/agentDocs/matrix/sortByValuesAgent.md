# sortByValuesAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/matrix_agents/sort_by_values_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/matrix_agents/sort_by_values_agent.ts)

## Description

sortByValues Agent

## Schema

#### inputs

```json

{
  "type": "object",
  "properties": {
    "array": {
      "type": "array",
      "description": "The array of items to be sorted. Each item will be paired with a corresponding numeric value from the 'values' array."
    },
    "values": {
      "type": "array",
      "description": "An array of numeric values used to determine the sort order of the 'array' items. Must be the same length as 'array'.",
      "items": {
        "type": "number"
      }
    }
  },
  "required": [
    "array",
    "values"
  ],
  "additionalProperties": false
}

```

#### output

```json

{
  "type": "array",
  "description": "A new array where items from 'array' are sorted based on their corresponding values in 'values'.",
  "items": {
    "type": "any"
  }
}

```

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$1",
  ":agentId.$2",
  ":agentId.$3"
]

```
```json

[
  ":agentId",
  ":agentId.$0",
  ":agentId.$1",
  ":agentId.$2",
  ":agentId.$3"
]

```

## Samples

### Sample0

#### inputs

```json

{
  "array": [
    "banana",
    "orange",
    "lemon",
    "apple"
  ],
  "values": [
    2,
    5,
    6,
    4
  ]
}

```

#### params

```json

{}

```

#### result

```json

[
  "lemon",
  "orange",
  "apple",
  "banana"
]

```
### Sample1

#### inputs

```json

{
  "array": [
    "banana",
    "orange",
    "lemon",
    "apple"
  ],
  "values": [
    2,
    5,
    6,
    4
  ]
}

```

#### params

```json

{"assendant":true}

```

#### result

```json

[
  "banana",
  "apple",
  "orange",
  "lemon"
]

```

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

