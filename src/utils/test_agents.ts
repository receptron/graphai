import { AgentFunctionDictonary } from "@/graphai";
import {
  sleeperAgent,
  sleeperAgentDebug,
  stringTemplateAgent,
  nestedAgent,
  mapAgent,
  totalAgent,
  bypassAgent,
  echoAgent,
  copyMessageAgent,
  mergeNodeIdAgent,
  countingAgent,
  copy2ArrayAgent,
  pushAgent,
  popAgent,
  shiftAgent,
  streamMockAgent,
} from "@/experimental_agents";

import { openAIMockAgent } from "@/experimental_agents/llm_agents/openai_agent";

export const defaultTestAgents: AgentFunctionDictonary = {
  bypassAgent,
  echoAgent,
  copyMessageAgent,
  mergeNodeIdAgent,
  sleeperAgent,
  sleeperAgentDebug,
  stringTemplateAgent,
  nestedAgent,
  mapAgent,
  totalAgent,
  countingAgent,
  copy2ArrayAgent,
  pushAgent,
  popAgent,
  shiftAgent,
  streamMockAgent,
  openAIMockAgent,
};
