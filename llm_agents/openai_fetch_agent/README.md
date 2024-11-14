
# @graphai/openai_fetch_agent for GraphAI

OpenAI fetch agents for GraphAI and browser.

### Install

```sh
yarn add @graphai/openai_fetch_agent
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { openAIFetchAgent } from "@graphai/openai_fetch_agent";

const agents = { openAIFetchAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Agents description
- openAIFetchAgent - OpenAI Fetch Agent

### Input/Output/Params Schema & samples
 - [openAIFetchAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/llm/openAIFetchAgent.md)





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

#### graphDataOpenAIPaint
```json
{
  "version": 0.5,
  "nodes": {
    "inputData": {
      "value": "dragon flying in the sky"
    },
    "llm": {
      "agent": "openAIImageAgent",
      "inputs": {
        "prompt": ":inputData"
      },
      "params": {
        "system": "Generate user-specified image",
        "model": "dall-e-3"
      },
      "isResult": true
    }
  }
}
```

#### graphDataOpenAIImageDescription
```json
{
  "version": 0.5,
  "nodes": {
    "inputData": {
      "value": "what is this"
    },
    "llm": {
      "agent": "openAIAgent",
      "inputs": {
        "prompt": ":inputData"
      },
      "params": {
        "model": "gpt-4o-mini",
        "system": "Describe the given image",
        "images": [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Kumamoto_Castle_Keep_Tower_20221022-3.jpg/1920px-Kumamoto_Castle_Keep_Tower_20221022-3.jpg"
        ]
      },
      "isResult": true
    }
  }
}
```




