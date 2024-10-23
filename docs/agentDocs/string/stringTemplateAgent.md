# stringTemplateAgent

## Description

Template agent

## Schema

#### inputs

```json

{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "",
  "type": "object",
  "properties": {
    "message1": {
      "type": "string",
      "minLength": 1
    },
    "message2": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": [
    "message1",
    "message2"
  ]
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
  ":agentId.$0",
  ":agentId.$1"
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
  ":agentId.$0",
  ":agentId.$0.apple",
  ":agentId.$0.lemon"
]

````
```json

[
  ":agentId",
  ":agentId.apple",
  ":agentId.lemon",
  ":agentId.lemon.$0"
]

````
```json

[
  ":agentId",
  ":agentId.nodes",
  ":agentId.nodes.ai",
  ":agentId.nodes.ai.agent",
  ":agentId.nodes.ai.inputs",
  ":agentId.nodes.ai.inputs.prompt",
  ":agentId.nodes.ai.isResult",
  ":agentId.nodes.ai.params",
  ":agentId.nodes.ai.params.text",
  ":agentId.version"
]

````

## Samples

### Sample0

#### inputs

```json

{
  "message1": "hello",
  "message2": "test"
}

````

#### params

```json

{"template":"${message1}: ${message2}"}

````

#### result

```json

"hello: test"

````
### Sample1

#### inputs

```json

{
  "message1": "hello",
  "message2": "test"
}

````

#### params

```json

{"template":["${message1}: ${message2}","${message2}: ${message1}"]}

````

#### result

```json

[
  "hello: test",
  "test: hello"
]

````
### Sample2

#### inputs

```json

{
  "message1": "hello",
  "message2": "test"
}

````

#### params

```json

{"template":{"apple":"${message1}","lemon":"${message2}"}}

````

#### result

```json

{
  "apple": "hello",
  "lemon": "test"
}

````
### Sample3

#### inputs

```json

{
  "message1": "hello",
  "message2": "test"
}

````

#### params

```json

{"template":[{"apple":"${message1}","lemon":"${message2}"}]}

````

#### result

```json

[
  {
    "apple": "hello",
    "lemon": "test"
  }
]

````
### Sample4

#### inputs

```json

{
  "message1": "hello",
  "message2": "test"
}

````

#### params

```json

{"template":{"apple":"${message1}","lemon":["${message2}"]}}

````

#### result

```json

{
  "apple": "hello",
  "lemon": [
    "test"
  ]
}

````
### Sample5

#### inputs

```json

{
  "agent": "openAiAgent",
  "row": "hello world",
  "params": {
    "text": "message"
  }
}

````

#### params

```json

{"template":{"version":0.5,"nodes":{"ai":{"agent":"${agent}","isResult":true,"params":"${params}","inputs":{"prompt":"${row}"}}}}}

````

#### result

```json

{
  "nodes": {
    "ai": {
      "agent": "openAiAgent",
      "inputs": {
        "prompt": "hello world"
      },
      "isResult": true,
      "params": {
        "text": "message"
      }
    }
  },
  "version": 0.5
}

````

## Author

Satoshi Nakajima

## Repository

https://github.com/receptron/graphai

## License

MIT

