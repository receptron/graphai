
# @graphai/openai_agent for GraphAI

OpenAI agents for GraphAI.

### Install

```sh
yarn add @graphai/openai_agent
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { openAIAgent, openAIImageAgent } from "@graphai/openai_agent";

const agents = { openAIAgent, openAIImageAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### GraphData Example

#### graphDataOpenAIMath
```json
{
  "version": 0.5,
  "nodes": {
    "inputData": {
      "value": "hello, let me know the answer 1 + 1"
    },
    "llm": {
      "agent": "openAIAgent",
      "inputs": {
        "prompt": ":inputData"
      }
    }
  }
}
```




