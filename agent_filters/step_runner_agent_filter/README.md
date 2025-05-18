# @graphai/step_runner_agent_filters for GraphAI

Agent filter collections for GraphAI.

## Install

```
yarn add @graphai/step_runner_agent_filters
```

### ConsoleStepRunner

To debug graph data in the console, you can execute each agent step by step.

You need to install the @inquirer/input npm package.

It can be used via:

```

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


