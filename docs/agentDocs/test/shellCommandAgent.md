# shellCommandAgent

## Description
Executes a specified shell command and returns its execution results.

## Schema

#### inputs

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "command": {
      "type": "string",
      "description": "Shell command to execute"
    }
  },
  "required": ["command"]
}
```

## Input example of the next node

```json
[
  ":agentId",
  ":agentId.stdout",
  ":agentId.stderr",
  ":agentId.exitCode"
]
```

## Samples

### Sample0

#### inputs

```json
{
  "command": "echo 'Hello World'"
}
```

#### result

```json
{
  "stdout": "Hello World\n",
  "stderr": "",
  "exitCode": 0
}
```

### Sample1

#### inputs

```json
{
  "command": "ls -la"
}
```

#### result

```json
{
  "stdout": "total 32\ndrwxr-xr-x  5 user  group   160 Mar 20 10:00 .\ndrwxr-xr-x  8 user  group   256 Mar 20 10:00 ..\n...",
  "stderr": "",
  "exitCode": 0
}
```

## Author

Satoshi Nakajima

## Repository

https://github.com/receptron/graphai

## License

MIT