
# @graphai/data_agents for GraphAI

Data agents for GraphAI.

### Install

```sh
yarn add @graphai/data_agents
```


### Usage

```typescript
import { GraphAI } from "graphai";
import { dataObjectMergeTemplateAgent } from "@graphai/data_agents";

const agents = { dataObjectMergeTemplateAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

- dataObjectMergeTemplateAgent - Merge object

### Input/Output/Params Schema & samples
 - [dataObjectMergeTemplateAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/data/dataObjectMergeTemplateAgent.md)









