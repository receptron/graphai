import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIArray } from "@graphai/agent_utils";
export declare const arrayFlatAgent: AgentFunction<{
    depth?: number;
}, GraphAIArray, GraphAIArray>;
declare const arrayFlatAgentInfo: AgentFunctionInfo;
export default arrayFlatAgentInfo;
