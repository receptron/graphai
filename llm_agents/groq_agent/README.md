
# @graphai/groq_agent for GraphAI

Groq agents for GraphAI.

### Install

```sh
yarn add @graphai/groq_agent
```

### Usage

```typescript
import { GraphAI } from "graphai";
import { groqAgent } from "@graphai/groq_agent";

const agents = { groqAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

