
# @graphai/replicate_agent for GraphAI

Replicate agents for GraphAI.

### Install

```sh
yarn add @graphai/replicate_agent
```

### Usage

```typescript
import { GraphAI } from "graphai";
import { replicateAgent } from "@graphai/replicate_agent";

const agents = { replicateAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

