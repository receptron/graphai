
# @graphai/tools_agent for GraphAI

General tools agents

### Install

```sh
yarn add @graphai/tools_agent
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { toolsAgent } from "@graphai/tools_agent";

const agents = { toolsAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Agents description
- toolsAgent - 

### Input/Output/Params Schema & samples
 - [toolsAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/undefined/toolsAgent.md)

### Input/Params example
 - toolsAgent

```typescript
{
  "inputs": {
    "llmAgent": "openAIAgent",
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "lightAgent--toggleLight",
          "description": "Switch of light",
          "parameters": {
            "type": "object",
            "properties": {
              "switch": {
                "type": "boolean",
                "description": "change light state"
              }
            }
          }
        }
      }
    ],
    "messages": [
      {
        "role": "system",
        "content": "You are a light switch. Please follow the user's instructions."
      }
    ],
    "userInput": {
      "text": "turn on the light.",
      "message": {
        "role": "user",
        "content": "turn on the light."
      }
    }
  },
  "params": {}
}
```










