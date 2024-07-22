
# @graphai/gemini_agent for GraphAI

Gemini agents for GraphAI.

### Install

```sh
yarn add @graphai/gemini_agent
```

### Usage

```typescript
import { GraphAI } from "graphai";
import { geminiAgent } from "@graphai/gemini_agent";

const agents = { geminiAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

