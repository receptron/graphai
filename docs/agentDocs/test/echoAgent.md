# echoAgent

## Package
[@graphai/vanilla](https://www.npmjs.com/package/@graphai/vanilla)
## Source
[https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/echo_agent.ts](https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/test_agents/echo_agent.ts)

## Description

Echo agent

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
```

## Input example of the next node

```json
[
  ":agentId",
  ":agentId.text"
]
```

```json
[
  ":agentId"
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
{"text":"this is test"}
```

#### result

```json
{
  "text": "this is test"
}
```
### Sample1

#### inputs

```json
{}
```

#### params

```json
{"text":"If you add filterParams option, it will respond to filterParams","filterParams":true}
```

#### result

```json
{}
```

## Author

Satoshi Nakajima

## Repository

https://github.com/receptron/graphai

## License

MIT
