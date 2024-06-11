
# @graphai/vanilla for GraphAI

Vanilla agents for GraphAI.

### Install

```
yarn add @graphai/vanilla
```

### Usage

```
import { GraphAI } from "graphai";
import { stringEmbeddingsAgent, stringSplitterAgent, stringTemplateAgent, jsonParserAgent, pushAgent, popAgent, shiftAgent, dotProductAgent, sortByValuesAgent, echoAgent, bypassAgent, countingAgent, copyMessageAgent, copy2ArrayAgent, mergeNodeIdAgent, streamMockAgent, nestedAgent, mapAgent, workerAgent, totalAgent, dataSumTemplateAgent, propertyFilterAgent, copyAgent } from "@graphai/vanilla";

const agents = { stringEmbeddingsAgent, stringSplitterAgent, stringTemplateAgent, jsonParserAgent, pushAgent, popAgent, shiftAgent, dotProductAgent, sortByValuesAgent, echoAgent, bypassAgent, countingAgent, copyMessageAgent, copy2ArrayAgent, mergeNodeIdAgent, streamMockAgent, nestedAgent, mapAgent, workerAgent, totalAgent, dataSumTemplateAgent, propertyFilterAgent, copyAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

