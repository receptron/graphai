import type { GraphAILLMStreamData } from "@graphai/llm_utils";

import { streamAgentFilterGenerator } from "./stream";

export const consoleStreamDataAgentFilter = streamAgentFilterGenerator<GraphAILLMStreamData>((context, data) => {
  if (data.type === "response.in_progress") {
    console.log(data.response.output[0].text);
  }
});

export const consoleStreamAgentFilter = streamAgentFilterGenerator<string>((context, data) => {
  console.log(data);
});
