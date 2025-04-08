# dataSumTemplateAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/data_sum_template_agent.ts](https://www.npmjs.com/package/https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/data_sum_template_agent.ts)

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
      "description": "the array of numbers to calculate the sum of",
      "items": {
        "type": "integer"
      }
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
  "type": "number"
}

````

## Input example of the next node

```json

[
  ":agentId",
  ":agentId.result"
]

````
```json

[
  ":agentId",
  ":agentId.result"
]

````
```json

[
  ":agentId",
  ":agentId.result"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````
```json

[
  ":agentId"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "array": [
    1
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
  "result": 1
}

````
### Sample1

#### inputs

```json

{
  "array": [
    1,
    2
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
  "result": 3
}

````
### Sample2

#### inputs

```json

{
  "array": [
    1,
    2,
    3
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
  "result": 6
}

````
### Sample3

#### inputs

```json

{
  "array": [
    1
  ]
}

````

#### params

```json

{"flatResponse":true}

````

#### result

```json

1

````
### Sample4

#### inputs

```json

{
  "array": [
    1,
    2
  ]
}

````

#### params

```json

{"flatResponse":true}

````

#### result

```json

3

````
### Sample5

#### inputs

```json

{
  "array": [
    1,
    2,
    3
  ]
}

````

#### params

```json

{"flatResponse":true}

````

#### result

```json

6

````

## Author

Satoshi Nakajima

## Repository

https://github.com/receptron/graphai

## License

MIT

