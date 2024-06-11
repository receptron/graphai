
# @graphai/data_agents for GraphAI

Data agents for GraphAI.

### Install

```
yarn add @graphai/data_agents
```

### Usage

```
import { GraphAI } from "graphai";
import { dataObjectMergeTemplateAgent } from "@graphai/data_agents";

const agents = { dataObjectMergeTemplateAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

