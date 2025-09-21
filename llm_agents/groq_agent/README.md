
# @graphai/groq_agent for GraphAI

Groq agents for GraphAI.

### Install

```sh
yarn add @graphai/groq_agent
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { groqAgent } from "@graphai/groq_agent";

const agents = { groqAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Agents description
- groqAgent - Groq Agent

### Input/Output/Params Schema & samples
 - [groqAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/llm/groqAgent.md)



### Environment Variables
 - groqAgent
   - GROQ_API_KEY



### GraphData Example

#### graphDataGroqMath
```json
{
  "version": 0.5,
  "nodes": {
    "inputData": {
      "value": "hello, let me know the answer 1 + 1"
    },
    "llm": {
      "agent": "groqAgent",
      "inputs": {
        "prompt": ":inputData"
      },
      "params": {
        "model": "llama-3.1-8b-instant"
      }
    }
  }
}
```




