import { AgentFunctionContext, AgentFunction, AgentFilterInfo, ResultData } from "../type";
export declare const agentFilterRunnerBuilder: (__agentFilters: AgentFilterInfo[]) => (context: AgentFunctionContext, agent: AgentFunction) => Promise<ResultData>;
