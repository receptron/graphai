import type { GraphAILLMStreamData } from "@graphai/llm_utils";

import { streamAgentFilterGenerator } from "./stream";

export const consoleStreamDataAgentFilter = streamAgentFilterGenerator<GraphAILLMStreamData>((__context, data) => {
  if (data.type === "response.in_progress" && data.response.output[0].type === "text") {
    console.log(data.response.output[0].text);
  }
});

export const consoleStreamAgentFilter = streamAgentFilterGenerator<string>((__context, data) => {
  console.log(data);
});
