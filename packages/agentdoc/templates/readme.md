
# {packageName} for GraphAI

{description}

### Install

```sh
yarn add {packageName}
```

{READMEBefore}
### Usage

```typescript
import { GraphAI } from "graphai";
import { {agents} } from "{packageName}";

const agents = { {agents} };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Agents description
{agentsDescription}

### Input/Output/Params Schema & samples
{sample}

{environmentVariables}

{relatedAgents}

{GraphDataJSON}

{READMEAfter}

