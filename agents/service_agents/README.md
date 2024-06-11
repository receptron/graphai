
# @graphai/service_agents for GraphAI

Service agents for GraphAI.

### Install

```sh
yarn add @graphai/service_agents
```

### Usage

```typescript
import { GraphAI } from "graphai";
import { fetchAgent, wikipediaAgent } from "@graphai/service_agents";

const agents = { fetchAgent, wikipediaAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

