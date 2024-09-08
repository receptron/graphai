
# @graphai/sleeper_agents for GraphAI

Sleeper agents for GraphAI.

### Install

```sh
yarn add @graphai/sleeper_agents
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { sleeperAgent, sleeperAgentDebug } from "@graphai/sleeper_agents";

const agents = { sleeperAgent, sleeperAgentDebug };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Input/Output/Params Schema & samples
 - [sleeperAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/sleeper/sleeperAgent.md)
 - [sleeperAgentDebug](https://github.com/receptron/graphai/blob/main/docs/agentDocs/sleeper/sleeperAgentDebug.md)









