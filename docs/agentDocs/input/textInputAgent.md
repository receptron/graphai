# textInputAgent

## Description

Text Input Agent

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
  ":agentId",
  ":agentId.text",
  ":agentId.content",
  ":agentId.content.role",
  ":agentId.content.content"
]

````
```json

[
  ":agentId",
  ":agentId.text",
  ":agentId.content",
  ":agentId.content.role",
  ":agentId.content.content"
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

{"message":"Enter your message to AI."}

````

#### result

```json

{
  "text": "message from the user",
  "content": {
    "role": "user",
    "content": "message from the user"
  }
}

````
### Sample1

#### inputs

```json

{}

````

#### params

```json

{"message":"Enter your message to AI.","role":"system"}

````

#### result

```json

{
  "text": "message from the user",
  "content": {
    "role": "system",
    "content": "message from the user"
  }
}

````

## Author

Receptron team

## Repository

https://github.com/receptron/graphai

## License

MIT

