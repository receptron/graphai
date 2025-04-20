# @graphai/slashgpt_agent for GraphAI

SlashGPT agents for GraphAI.

### Install

```sh
yarn add @graphai/slashgpt_agent
```

This agent is in maintenance mode and will no longer be updated.
Please use other agents like OpenAI Agent, as they provide the necessary features.

### Usage

```typescript
import { GraphAI } from "graphai";
import { slashGPTAgent } from "@graphai/slashgpt_agent";

const agents = { slashGPTAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Agents description
- slashGPTAgent - Slash GPT Agent

### Input/Output/Params Schema & samples
 - [slashGPTAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/llm/slashGPTAgent.md)

### Input/Params example
 - slashGPTAgent

```typescript
{
  "inputs": {},
  "params": {
    "query": "Come up with ten business ideas for AI startup"
  }
}
```
