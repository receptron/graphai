# LLM Agent

The **LLM Agent** provides a unified interface for interacting with large language models such as **OpenAI**, **Anthropic**, and **local LLMs** (e.g., **Ollama** via an OpenAI-compatible API).  
It accepts **system prompts**, **user prompts**, and **messages (conversation history)** as inputs, along with many other configurable parameters, and returns the model’s response.

## Key Features

- **Unified Input/Output Format**  
  All agents share a consistent data structure for inputs and outputs, regardless of the backend. This applies to:
  - Standard conversation messages
  - Tool call data (function/tool integrations)
  - Configurable parameters (e.g., temperature, max_tokens, etc.)

- **Cross-Platform**  
  Works in both **Node.js (server)** and **Web (browser)** environments.
  - Supports passing API keys appropriately for each environment  
  - Provides flags for web execution  
  - Supports local models (e.g., Ollama)

- **Streaming Responses**  
  Streaming works in **Node**, **Web**, and hybrid setups, and is handled **in combination with Agent Filters** (the agent does not stream by itself).

## GraphData Examples

### Using OpenAI GPT-4o
```yaml
llm:
  agent: openAIAgent
  params:
    model: gpt-4o
  inputs:
    messages: :messages
    prompt: :userInput.text
```
### Using Local Ollama (keep `openAIAgent`, just change params)

```yaml
llm:
  agent: openAIAgent
  params:
    model: llama3
    baseURL: http://127.0.0.1:11434/v1
  inputs:
    messages: :messages
    prompt: :userInput.text
```

> Error handling is managed at the **GraphAI** level, so no special instructions are needed here.

## Streaming Example (Node.js Console)

Use an Agent Filter to receive partial tokens while the model generates:

```ts
import { streamAgentFilterGenerator } from "@graphai/stream_agent_filter";
import { GraphAI } from "@graphai/core";
import type { GraphAILLMStreamData } from "@graphai/types";

const consoleStreamAgentFilter = streamAgentFilterGenerator<GraphAILLMStreamData>((context, data) => {
  if (data.type === "response.in_progress") {
    console.log(data.response); // partial chunks as they arrive
  }
});

const streamAgentFilter = {
  name: "streamAgentFilter",
  agent: consoleStreamAgentFilter,
};

const agentFilters = [streamAgentFilter];

const graphai = new GraphAI(graph, { ...agents }, { agentFilters });
```
---

## Tools Interop (⚠️ Important)

### 1) Inputs messages: Always send tool data in **OpenAI format** (even for non-OpenAI backends)

- **Messages** can include OpenAI-style tool calls and tool results inside the conversation history.  
- The LLM Agent will **accept OpenAI format**, **convert internally** to the target provider’s format (e.g., Anthropic Tool Use), run the request, and **convert back** to OpenAI format **internally**.

**Example (OpenAI-style input messages):**

```typescript
[
  {
    role: "user",
    content: "東京・大阪・札幌の天気、USDJPYのレート、AAPLとMSFTの株価を教えて",
  },
  {
    role: "assistant",
    content: "東京、大阪、札幌の天気、USDJPYの為替レート、そしてAAPLとMSFTの株価を調べますね。",
    tool_calls: [
      {
        id: "toolu_0175tZ6uqBFKDCBy8zzUsSvq",
        function: {
          name: "generalToolAgent--get_weather",
          arguments: JSON.stringify({
            city: "東京",
          }),
        },
      },
    ],
  },
  {
    role: "tool",
    tool_call_id: "toolu_0175tZ6uqBFKDCBy8zzUsSvq",
    content: "Weather for 東京: fine.",
    extra: {
      agent: "generalToolAgent",
      arg: {
	city: "東京",
      },
      func: "get_weather",
    },
  },
]
```
### 2) Outputs: The agent **does not** return OpenAI’s tool call shape

When the model requests tools, the agent exposes them in a **GraphAI-friendly canonical format** for ease of use in your pipelines. This is intentionally different from OpenAI’s shape:

```ts
type type GraphAIToolPayload = { 
  id: string; 
  name: string; 
  arguments?: unknown
};
type GraphAITool = { tool: GraphAIToolPayload };
type GraphAIToolCalls = { tool_calls: Array<GraphAIToolPayload> };
```


**What you get from the agent (example):**

**Key differences vs OpenAI:**
- `arguments` is an **object** (parsed), not a JSON **string**.  
- No `"type": "function"` wrapper and no nested `"function"` object.  
- This canonical shape is returned **even if the underlying provider isn’t OpenAI**.

> ⚠️ **Common Pitfall**: Do not assume the agent outputs OpenAI’s tool schema.  
> Always handle the **GraphAI canonical format** (`{ id, name, arguments }[]`) in downstream logic.

---
