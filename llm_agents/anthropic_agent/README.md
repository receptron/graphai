
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




