import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIPathName, GraphAIDirNames } from "@graphai/agent_utils";
type InputsParam = Partial<GraphAIDirNames & GraphAIPathName>;
export declare const pathUtilsAgent: AgentFunction<{
    method: string;
} & InputsParam, GraphAIPathName, InputsParam>;
declare const pathUtilsAgentInfo: AgentFunctionInfo;
export default pathUtilsAgentInfo;
