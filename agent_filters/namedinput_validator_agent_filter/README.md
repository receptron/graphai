# @graphai/namedinput_validator_agent_filter for GraphAI

Cache Agent filter for GraphAI.

## Install

```
yarn add @graphai/namedinput_validator_agent_filter
```

### USAGE

Validate values of namedInputs based on the input schema of agentFunctionInfo

https://github.com/isamu/graphai/blob/agentFilter/packages/agent_filters/tests/validation/test_agent_namedinput_validator.ts

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

