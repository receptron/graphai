import { AgentFilterFunction, AgentFunctionContext } from "graphai";

export const streamAgentFilterGenerator = <T>(callback: (context: AgentFunctionContext, data: T) => void) => {
  const streamAgentFilter: AgentFilterFunction = async (context, next) => {
    if (context.debugInfo.isResult) {
      context.filterParams.streamTokenCallback = (data: T) => {
        callback(context, data);
      };
    }
    return next(context);
  };
  return streamAgentFilter;
};
