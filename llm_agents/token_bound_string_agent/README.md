# @graphai/token_bound_string_agent for GraphAI

This agent generates a reference string from a sorted array of strings, adding one by one until the token count exceeds the specified limit.

### Install

```sh
yarn add @graphai/token_bound_string_agent
```

### Usage

```typescript
import { GraphAI } from "graphai";
import { tokenBoundStringsAgent } from "@graphai/token_bound_string_agent";

const agents = { tokenBoundStringsAgent };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Agents description
- tokenBoundStringsAgent - token bound Agent

### Input/Output/Params Schema & samples
 - [tokenBoundStringsAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/undefined/tokenBoundStringsAgent.md)

### Input/Params example
 - tokenBoundStringsAgent

```typescript
{
  "inputs": {
    "chunks": [
      "Here's to the crazy ones. The misfits. The rebels. The troublemakers.",
      "The round pegs in the square holes. The ones who see things differently.",
      "They're not fond of rules. And they have no respect for the status quo.",
      "You can quote them, disagree with them, glorify or vilify them.",
      "About the only thing you can't do is ignore them.",
      "Because they change things.",
      "They push the human race forward.",
      "And while some may see them as the crazy ones, we see genius.",
      "Because the people who are crazy enough to think they can change the world, are the ones who do."
    ]
  },
  "params": {
    "limit": 80
  }
}
```
