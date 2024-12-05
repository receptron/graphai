
# @graphai/sleeper_agents for GraphAI

Sleeper agents for GraphAI.

### Install

```sh
yarn add @graphai/sleeper_agents
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { sleepAndMergeAgent, sleeperAgentDebug } from "@graphai/sleeper_agents";

const agents = { sleepAndMergeAgent, sleeperAgentDebug };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Agents description
- sleepAndMergeAgent - sleeper and merge Agent
- sleeperAgentDebug - sleeper debug Agent

### Input/Output/Params Schema & samples
 - [sleepAndMergeAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/sleeper/sleepAndMergeAgent.md)
 - [sleeperAgentDebug](https://github.com/receptron/graphai/blob/main/docs/agentDocs/sleeper/sleeperAgentDebug.md)

### Input/Params example
 - sleepAndMergeAgent

```typescript
{
  "inputs": {},
  "params": {
    "duration": 1
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      {
        "a": 1
      },
      {
        "b": 2
      }
    ]
  },
  "params": {
    "duration": 1
  }
}
```

 - sleeperAgentDebug

```typescript
{
  "inputs": {},
  "params": {
    "duration": 1
  }
}
```


```typescript
{
  "inputs": {
    "array": [
      {
        "a": 1
      },
      {
        "b": 2
      }
    ]
  },
  "params": {
    "duration": 1
  }
}
```










