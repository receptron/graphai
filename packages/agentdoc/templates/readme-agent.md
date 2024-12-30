
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
import * as agents from "{packageName}";

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

| **Agent**      | APIKEY               | Stream | Tools | Web   | History |
|----------------|----------------------|--------|-------|-------|---------|
| anthropicAgent | ANTHROPIC_API_KEY    | Y      | N     | Y(*1) | Y       |
| geminiAgent    | GOOGLE_GENAI_API_KEY | Y      | Y     | ?     | Y       |
| groqAgent      | GROQ_API_KEY         | Y      | Y     | Y(*1) | Y       |
| openAIAgent    | OPENAI_API_KEY       | Y      | Y     | Y(*1) | Y       |
| replicateAgent | REPLICATE_API_TOKEN  | N      | N     | ?     | N       |

(*1) dangerouslyAllowBrowser

{relatedAgents}

{GraphDataJSON}

{READMEAfter}

