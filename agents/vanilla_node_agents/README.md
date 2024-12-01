
# @graphai/vanilla_node_agents for GraphAI

Vanilla node agents for GraphAI.

### Install

```sh
yarn add @graphai/vanilla_node_agents
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { fileReadAgent } from "@graphai/vanilla_node_agents";

const agents = { fileReadAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Agents description
- fileReadAgent - Read data from file system and returns data

### Input/Output/Params Schema & samples
 - [fileReadAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/fs/fileReadAgent.md)









