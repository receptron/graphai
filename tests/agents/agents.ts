import { AgentFunction, AgentFunctionDictonary } from "@/graphai";
import { sleeperAgent, sleeperAgentDebug, nestedAgent, totalAgent } from "@/experimental_agents";

export const bypassAgent: AgentFunction = async (context) => {
  if (context.inputs.length === 1) {
    return context.inputs[0];
  }
  return context.inputs;
};
export const echoAgent: AgentFunction = async ({ params }) => {
  return params;
};
export const echoForkIndexAgent: AgentFunction = async ({ debugInfo: { forkIndex } }) => {
  return { forkIndex };
};

export const mergeNodeIdAgent: AgentFunction = async ({ debugInfo: { nodeId }, inputs }) => {
  // console.log("executing", nodeId);
  return inputs.reduce(
    (tmp, input) => {
      return { ...tmp, ...input };
    },
    { [nodeId]: "hello" },
  );
};

export const defaultTestAgents: AgentFunctionDictonary = {
  bypassAgent,
  echoAgent,
  echoForkIndexAgent,
  mergeNodeIdAgent,
  sleeperAgent,
  sleeperAgentDebug,
  nestedAgent,
  totalAgent,
};
