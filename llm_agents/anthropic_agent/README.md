
# @graphai/anthropic_agent for GraphAI

Anthropic agents for GraphAI.

### Install

```sh
yarn add @graphai/anthropic_agent
```

### Usage

```typescript
import { GraphAI } from "graphai";
import { anthropicAgent } from "@graphai/anthropic_agent";

const agents = { anthropicAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

