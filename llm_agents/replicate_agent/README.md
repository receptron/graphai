
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

### Agents description
- replicateAgent - Replicate Agent

### Input/Output/Params Schema & samples
 - [replicateAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/llm/replicateAgent.md)



### Environment Variables
 - replicateAgent
   - REPLICATE_API_TOKEN



### GraphData Example

#### graphDataReplicateMath
```json
{
  "version": 0.5,
  "nodes": {
    "inputData": {
      "value": "hello, let me know the answer 1 + 1"
    },
    "llm": {
      "agent": "replicateAgent",
      "inputs": {
        "prompt": ":inputData"
      },
      "params": {
        "model": "meta/meta-llama-3-70b-instruct"
      }
    }
  }
}
```




