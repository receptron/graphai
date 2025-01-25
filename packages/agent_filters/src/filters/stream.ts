import type { AgentFilterFunction, AgentFunctionContext } from "graphai";
import { NodeState } from "graphai";

export const streamAgentFilterGenerator = <T>(callback: (context: AgentFunctionContext, data: T) => void) => {
  const streamAgentFilter: AgentFilterFunction = async (context, next) => {
    if (context.debugInfo.isResult) {
      context.filterParams.streamTokenCallback = (data: T) => {
        if (context.debugInfo.state === NodeState.Executing) {
          callback(context, data);
        }
      };
    }
    return next(context);
  };
  return streamAgentFilter;
};
