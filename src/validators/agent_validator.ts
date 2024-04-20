export const agentValidator = (graphAgentIds: Set<string>, agentIds: Set<string>) => {
  graphAgentIds.forEach((agentId) => {
    if (!agentIds.has(agentId)) {
      throw new Error("Invalid AgentId : " + agentId + " is not in callbackDictonary.");
    }
  });
  return true;
};
