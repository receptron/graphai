
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

### Input/Output/Params Schema & samples
 - [geminiAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/llm/geminiAgent.md)

### Environment Variables
 - geminiAgent
   - GOOGLE_GENAI_API_KEY



### GraphData Example

#### graphDataGeminiMath
```json
{
  "version": 0.5,
  "nodes": {
    "inputData": {
      "value": "hello, let me know the answer 1 + 1"
    },
    "llm": {
      "agent": "geminiAgent",
      "inputs": {
        "prompt": ":inputData"
      }
    }
  }
}
```




