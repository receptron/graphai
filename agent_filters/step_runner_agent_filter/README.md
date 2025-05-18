# @graphai/step_runner_agent_filters for GraphAI

Agent filter collections for GraphAI.

## Install

```
yarn add @graphai/step_runner_agent_filters
```

### USAGE

To debug graph data in the console, you can execute each agent step by step.

It can be used via:

```typescript

import { consoleStepRunner } from "@graphai/agent_filters";

const agentFilters = [
  {
    name: "consoleStepRunner",
    agent: consoleStepRunner,
  },
];

const graph = new GraphAI(
  graph_data,
  {
    ...agents,
  },
  { agentFilters },
);
await graph.run();
```


