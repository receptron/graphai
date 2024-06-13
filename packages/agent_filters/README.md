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

Receive stream data externally through streamTokenCallback of filterParams.
Available for both server and client. See express code.

https://github.com/receptron/graphai_utils/blob/main/packages/express/src/express.ts

### httpAgentFilter

In graph flow, bypass the agent execution and run it on the server via http.

Refer to the web sample.

https://github.com/isamu/graphai-stream-web/blob/main/src/views/Home.vue


### agentFilterRunnerBuilder

Execute agent filter and agent in test for agent filter usage
It also run agent filter and agent outside of GraphAI. This is useful in Express web server.