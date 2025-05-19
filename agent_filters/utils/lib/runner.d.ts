import { AgentFunctionContext, AgentFunction, AgentFilterInfo, ResultData } from "graphai";
export declare const agentFilterRunnerBuilder: (__agentFilters: AgentFilterInfo[]) => (context: AgentFunctionContext, agent: AgentFunction) => Promise<ResultData>;
