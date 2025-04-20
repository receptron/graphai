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

### Agents description
- anthropicAgent - Anthropic Agent

### Input/Output/Params Schema & samples
 - [anthropicAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/llm/anthropicAgent.md)


### Environment Variables
 - anthropicAgent
   - ANTHROPIC_API_KEY


### GraphData Example

#### graphDataAnthropicMath
```json
{
  "version": 0.5,
  "nodes": {
    "inputData": {
      "value": "hello, let me know the answer 1 + 1"
    },
    "llm": {
      "agent": "anthropicAgent",
      "inputs": {
        "prompt": ":inputData"
      }
    }
  }
}
```
