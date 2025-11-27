
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

### Agents description
- openAIAgent - OpenAI Agent
- openAIImageAgent - OpenAI Image Agent

### Input/Output/Params Schema & samples
 - [openAIAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/llm/openAIAgent.md)
 - [openAIImageAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/llm/openAIImageAgent.md)

### Input/Params example
 - openAIAgent
   - inputs
     - prompt(string)
       - query string
     - messages(undefined)
       - chat messages
   - params
     - prompt(string)
       - query string
     - messages(undefined)
       - chat messages

```typescript
{
  "inputs": {
    "prompt": "this is response result"
  },
  "params": {}
}
```


### Environment Variables
 - openAIAgent
   - OPENAI_API_KEY
 - openAIImageAgent
   - OPENAI_API_KEY



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
      },
      "params": {
        "max_tokens": 2000
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
          "https://raw.githubusercontent.com/ultralytics/yolov5/master/data/images/zidane.jpg"
        ]
      },
      "isResult": true
    }
  }
}
```




