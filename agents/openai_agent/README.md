
# @graphai/openai_agent for GraphAI

OpenAI agents for GraphAI.

### Install

```sh
yarn add @graphai/openai_agent
```

### Usage

```typescript
import { GraphAI } from "graphai";
import { openAIAgent } from "@graphai/openai_agent";

const agents = { openAIAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

