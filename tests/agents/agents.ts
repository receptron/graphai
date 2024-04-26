import { AgentFunctionDictonary } from "@/graphai";
import { sleeperAgent, sleeperAgentDebug, nestedAgent, mapAgent, totalAgent, bypassAgent, echoAgent, mergeNodeIdAgent } from "@/experimental_agents";

export const defaultTestAgents: AgentFunctionDictonary = {
  bypassAgent,
  echoAgent,
  mergeNodeIdAgent,
  sleeperAgent,
  sleeperAgentDebug,
  nestedAgent,
  mapAgent,
  totalAgent,
};
