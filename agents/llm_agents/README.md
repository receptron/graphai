
# @graphai/llm_agents for GraphAI

LLM agents for GraphAI.

### Install

```sh
yarn add @graphai/llm_agents
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { 
  anthropicAgent,
  geminiAgent,
  groqAgent,
  openAIAgent,
  openAIImageAgent,
  replicateAgent,
  slashGPTAgent,
  tokenBoundStringsAgent
 } from "@graphai/llm_agents";

const agents = { 
  anthropicAgent,
  geminiAgent,
  groqAgent,
  openAIAgent,
  openAIImageAgent,
  replicateAgent,
  slashGPTAgent,
  tokenBoundStringsAgent
 };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### RelatedPackages
 - [@graphai/anthropic_agent](https://www.npmjs.com/package/@graphai/anthropic_agent)
 - [@graphai/gemini_agent](https://www.npmjs.com/package/@graphai/gemini_agent)
 - [@graphai/groq_agent](https://www.npmjs.com/package/@graphai/groq_agent)
 - [@graphai/openai_agent](https://www.npmjs.com/package/@graphai/openai_agent)
 - [@graphai/replicate_agent](https://www.npmjs.com/package/@graphai/replicate_agent)
 - [@graphai/slashgpt_agent](https://www.npmjs.com/package/@graphai/slashgpt_agent)





