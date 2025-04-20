# sleepAndMergeAgent

## Package
[@graphai/sleeper_agents](https://www.npmjs.com/package/@graphai/sleeper_agents)
## Source
[https://github.com/receptron/graphai/blob/main/agents/sleeper_agents/src/sleep_and_merge_agent.ts](https://github.com/receptron/graphai/blob/main/agents/sleeper_agents/src/sleep_and_merge_agent.ts)

## Description

sleeper and merge Agent

## Schema

#### inputs

```json

{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {},
  "required": []
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
  ":agentId.a",
  ":agentId.b"
]

````

## Samples

### Sample0

#### inputs

```json

{}

````

#### params

```json

{"duration":1}

````

#### result

```json

{}

````
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

````

#### params

```json

{"duration":1}

````

#### result

```json

{
  "a": 1,
  "b": 2
}

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

