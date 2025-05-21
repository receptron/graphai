import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIItems } from "@graphai/agent_utils";
export declare const arrayToObjectAgent: AgentFunction<{
    key: string;
}, GraphAIItems, Record<string, any>>;
declare const arrayToObjectAgentInfo: AgentFunctionInfo;
export default arrayToObjectAgentInfo;
