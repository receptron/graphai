# @graphai/llm_agents for GraphAI

LLM agents for GraphAI.

### Install

```sh
yarn add @graphai/llm_agents
```

| **Agent**      | APIKEY               | Stream | Tools | Web   | History |
|----------------|----------------------|--------|-------|-------|---------|
| anthropicAgent | ANTHROPIC_API_KEY    | Y      | Y     | Y(*1) | Y       |
| geminiAgent    | GOOGLE_GENAI_API_KEY | Y      | Y     | Y     | Y       |
| groqAgent      | GROQ_API_KEY         | Y      | Y     | Y(*1) | Y       |
| openAIAgent    | OPENAI_API_KEY       | Y      | Y     | Y(*1) | Y       |
| replicateAgent | REPLICATE_API_TOKEN  | N      | N     | N     | N       |

(*1) dangerouslyAllowBrowser

### Usage

```typescript
import { GraphAI } from "graphai";
import {
  anthropicAgent,
  geminiAgent,
  groqAgent,
  openAIAgent,
  openAIFetchAgent,
  openAIImageAgent,
  replicateAgent
 } from "@graphai/llm_agents";

const agents = {
  anthropicAgent,
  geminiAgent,
  groqAgent,
  openAIAgent,
  openAIFetchAgent,
  openAIImageAgent,
  replicateAgent
 };

const graph = new GraphAI(graph_data, agents);
const result = await graph.run();
```

### Agents description
- anthropicAgent - Anthropic Agent
- geminiAgent - Gemini Agent
- groqAgent - Groq Agent
- openAIAgent - OpenAI Agent
- openAIFetchAgent - OpenAI Fetch Agent
- openAIImageAgent - OpenAI Image Agent
- replicateAgent - Replicate Agent

### Input/Output/Params Schema & samples
 - [anthropicAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/llm/anthropicAgent.md)
 - [geminiAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/llm/geminiAgent.md)
 - [groqAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/llm/groqAgent.md)
 - [openAIAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/llm/openAIAgent.md)
 - [openAIFetchAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/llm/openAIFetchAgent.md)
 - [openAIImageAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/llm/openAIImageAgent.md)
 - [replicateAgent](https://github.com/receptron/graphai/blob/main/docs/agentDocs/llm/replicateAgent.md)

### Input/Params example
 - openAIAgent

```typescript
{
  "inputs": {
    "prompt": "this is response result"
  },
  "params": {}
}
```

 - openAIFetchAgent

```typescript
{
  "inputs": {
    "prompt": "this is response result"
  },
  "params": {}
}
```

### Environment Variables
 - anthropicAgent
   - ANTHROPIC_API_KEY
 - geminiAgent
   - GOOGLE_GENAI_API_KEY
 - groqAgent
   - GROQ_API_KEY
 - openAIAgent
   - OPENAI_API_KEY
 - openAIImageAgent
   - OPENAI_API_KEY
 - replicateAgent
   - REPLICATE_API_TOKEN

### Related Agent Packages
 - [@graphai/anthropic_agent](https://www.npmjs.com/package/@graphai/anthropic_agent)
 - [@graphai/gemini_agent](https://www.npmjs.com/package/@graphai/gemini_agent)
 - [@graphai/groq_agent](https://www.npmjs.com/package/@graphai/groq_agent)
 - [@graphai/openai_agent](https://www.npmjs.com/package/@graphai/openai_agent)
 - [@graphai/openai_fetch_agent](https://www.npmjs.com/package/@graphai/openai_fetch_agent)
 - [@graphai/replicate_agent](https://www.npmjs.com/package/@graphai/replicate_agent)
