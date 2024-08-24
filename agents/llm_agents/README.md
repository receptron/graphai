
# @graphai/llm_agents for GraphAI

LLM agents for GraphAI.

### Install

```sh
yarn add @graphai/llm_agents
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { anthropicAgent, geminiAgent, groqAgent, openAIAgent, openAIImageAgent, replicateAgent, slashGPTAgent, tokenBoundStringsAgent } from "@graphai/llm_agents";

const agents = { anthropicAgent, geminiAgent, groqAgent, openAIAgent, openAIImageAgent, replicateAgent, slashGPTAgent, tokenBoundStringsAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```



