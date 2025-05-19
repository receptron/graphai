import type { GraphAILLMStreamData } from "@graphai/llm_utils";

import { streamAgentFilterGenerator } from "./stream";

export const consoleStreamDataAgentFilter = streamAgentFilterGenerator<GraphAILLMStreamData>((context, data) => {
  if (data.type === "response.in_progress") {
    process.stdout.write(String(data.response.output[0].text));
  } else if (data.type === "response.completed") {
    process.stdout.write(String("\n"));
  }
});

export const consoleStreamAgentFilter = streamAgentFilterGenerator<string>((context, data) => {
  process.stdout.write(String(data));
});
