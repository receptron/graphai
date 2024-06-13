# @graphai/agent_filters for GraphAI

Agent filter collections for GraphAI.

## Install

```
yarn add @graphai/agent_filters
```

## Usage


### namedInput Validator

Validate values of namedInputs based on the input schema of agentFunctionInfo

```typescript
import { GraphAI } from "graphai";
import * as agents from "@graphai/agents";
import { namedInputValidatorFilter } from "@graphai/agent_filters";

const agentFilters = [
  {
    name: "namedInputValidatorFilter",
    agent: namedInputValidatorFilter,
  },
];

const graph = new GraphAI(graph_data, agents, { agentFilters });
const results = await graph.run();

```


### streamAgentFilterGenerator



### httpAgentFilter

In graph flow, bypass the agent execution and run it on the server via http.


