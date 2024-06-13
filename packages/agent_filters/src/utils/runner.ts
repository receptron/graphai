import { AgentFunctionContext, AgentFunction, AgentFilterInfo, ResultData } from "graphai";

// for test and server.
export const agentFilterRunnerBuilder = (__agentFilters: AgentFilterInfo[]) => {
  const agentFilters = __agentFilters;
  const agentFilterRunner = (context: AgentFunctionContext, agent: AgentFunction) => {
    let index = 0;

    const next = (context: AgentFunctionContext): Promise<ResultData> => {
      const agentFilter = agentFilters[index++];
      if (agentFilter) {
        return agentFilter.agent(context, next);
      }
      return agent(context);
    };

    return next(context);
  };
  return agentFilterRunner;
};
