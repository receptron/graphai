
# @graphai/vanilla_node_agents for GraphAI

Vanilla node agents for GraphAI.

### Install

```sh
yarn add @graphai/vanilla_node_agents
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { fileReadAgent, fileWriteAgent } from "@graphai/vanilla_node_agents";

const agents = { fileReadAgent, fileWriteAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Agents description
- fileReadAgent - Read data from file system and returns data
- fileWriteAgent - Write data to file system

### Input/Output/Params Schema & samples
 - [fileReadAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/fs/fileReadAgent.md)
 - [fileWriteAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/fs/fileWriteAgent.md)

### Input/Params example
 - fileReadAgent

```typescript
{
  "inputs": {
    "array": [
      "test.txt"
    ]
  },
  "params": {
    "basePath": "/tmp/tests/files/"
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      "test.txt"
    ]
  },
  "params": {
    "basePath": "/tmp/tests/files/",
    "outputType": "base64"
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      "test.txt"
    ]
  },
  "params": {
    "basePath": "/tmp/tests/files/",
    "outputType": "text"
  }
}
```


```typescript
{
  "inputs": {
    "file": "test.txt"
  },
  "params": {
    "basePath": "/tmp/tests/files/",
    "outputType": "text"
  }
}
```

 - fileWriteAgent

```typescript
{
  "inputs": {
    "fileName": "write.txt",
    "text": "hello"
  },
  "params": {
    "basePath": "/tmp/tests/files/"
  }
}
```










