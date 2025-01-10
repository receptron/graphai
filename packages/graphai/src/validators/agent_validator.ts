import { ValidationError } from "./common";

export const agentValidator = (graphAgentIds: Set<string>, agentIds: Set<string>) => {
  graphAgentIds.forEach((agentId) => {
    // agentId or dynamic agentId
    if (!agentIds.has(agentId) && agentId[0] !== ":") {
      throw new ValidationError("Invalid Agent : " + agentId + " is not in AgentFunctionInfoDictionary.");
    }
  });
  return true;
};
