import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIArray, GraphAIArrayWithOptionalItemAndItems } from "@graphai/agent_utils";
export declare const pushAgent: AgentFunction<{
    arrayKey?: string;
}, GraphAIArray | Record<string, unknown[]>, GraphAIArrayWithOptionalItemAndItems>;
declare const pushAgentInfo: AgentFunctionInfo;
export default pushAgentInfo;
