import { AgentFunction, AgentFunctionInfo } from "graphai";
import type { GraphAIResult, GraphAIFileName, GraphAIText, GraphAIBaseDirName } from "@graphai/agent_utils";
export declare const fileWriteAgent: AgentFunction<Partial<GraphAIBaseDirName>, GraphAIResult<boolean>, GraphAIFileName & Partial<GraphAIText & {
    buffer?: Buffer;
}>>;
declare const fileWriteAgentInfo: AgentFunctionInfo;
export default fileWriteAgentInfo;
