import { ValidationError } from "@/validators/common";

export const agentValidator = (graphAgentIds: Set<string>, agentIds: Set<string>) => {
  graphAgentIds.forEach((agentId) => {
    if (!agentIds.has(agentId)) {
      throw new ValidationError("Invalid Agent : " + agentId + " is not in AgentFunctionInfoDictionary.");
    }
  });
  return true;
};
